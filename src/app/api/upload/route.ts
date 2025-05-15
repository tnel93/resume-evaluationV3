import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { v4 as uuidv4 } from 'uuid';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

// Extract text from PDF or DOCX file
const extractTextFromFile = async (buffer: Buffer, fileType: string): Promise<string> => {
  try {
    if (fileType === 'application/pdf') {
      // Extract text from PDF
      const pdfData = await pdfParse(buffer);
      return pdfData.text;
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      // Extract text from DOCX
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    } else {
      throw new Error('Unsupported file type');
    }
  } catch (error) {
    console.error('Error extracting text:', error);
    return `Failed to extract text from ${fileType} file. Error: ${error.message}`;
  }
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }
    
    // Validate file type
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload a PDF or DOCX file.' },
        { status: 400 }
      );
    }
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size exceeds 5MB limit' },
        { status: 400 }
      );
    }
    
    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Save file temporarily
    const tempDir = os.tmpdir();
    const fileExtension = file.type === 'application/pdf' ? '.pdf' : '.docx';
    const fileName = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(tempDir, fileName);
    
    await fs.writeFile(filePath, buffer);
    
    // Extract text from file
    const extractedText = await extractTextFromFile(buffer, file.type);
    
    // Clean up temporary file
    await fs.unlink(filePath).catch(err => console.error('Error deleting temp file:', err));
    
    // Return the extracted text
    return NextResponse.json({
      success: true,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      extractedText,
    });
    
  } catch (error) {
    console.error('Error processing file upload:', error);
    return NextResponse.json(
      { error: 'Failed to process file upload' },
      { status: 500 }
    );
  }
}
