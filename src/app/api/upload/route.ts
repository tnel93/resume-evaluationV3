'use client';

import { NextRequest, NextResponse } from 'next/server';

// Mock function to simulate text extraction
// This is a temporary replacement for the PDF/DOCX parsing functionality
async function mockExtractTextFromFile(buffer: Buffer, fileType: string): Promise<string> {
  // Return a placeholder message instead of actual parsing
  return `This is a mock extraction of your ${fileType === 'application/pdf' ? 'PDF' : 'DOCX'} file. 
  
The actual text extraction has been temporarily disabled to resolve deployment issues.

Your file has been received and is ready for processing. In a future update, we'll restore the full text extraction functionality.

For now, you can continue with the workflow to see the ATS analysis and resume rewriting features with this placeholder text.`;
}

export async function POST(request: NextRequest) {
  try {
    // Get the form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    
    // Check file type
    const fileType = file.type;
    if (fileType !== 'application/pdf' && fileType !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return NextResponse.json({ error: 'Only PDF and DOCX files are supported' }, { status: 400 });
    }
    
    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File size exceeds 5MB limit' }, { status: 400 });
    }
    
    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Use mock extraction instead of actual parsing
    const text = await mockExtractTextFromFile(buffer, fileType);
    
    // Return the extracted text
    return NextResponse.json({ 
      success: true, 
      text,
      fileName: file.name
    });
    
  } catch (error) {
    console.error('Error processing file:', error);
    return NextResponse.json({ error: 'Failed to process file' }, { status: 500 });
  }
}
