'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileText, Upload, X, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface ResumeUploaderProps {
  onUploadComplete: (fileContent: string, fileName: string) => void;
}

export default function ResumeUploader({ onUploadComplete }: ResumeUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadError(null);
    
    if (acceptedFiles.length === 0) {
      return;
    }
    
    const file = acceptedFiles[0];
    
    // Validate file type
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Please upload a PDF or DOCX file');
      toast.error('Invalid file type. Please upload a PDF or DOCX file.');
      return;
    }
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size exceeds 5MB limit');
      toast.error('File size exceeds 5MB limit');
      return;
    }
    
    setFile(file);
    
    // Create a preview for PDF files
    if (file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = () => {
        setFilePreview(URL.createObjectURL(file));
      };
      reader.readAsArrayBuffer(file);
    }
    
    toast.success('Resume selected successfully!');
  }, []);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1
  });
  
  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    // Set up progress tracking
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 5;
      });
    }, 100);
    
    try {
      // Create form data for API call
      const formData = new FormData();
      formData.append('file', file);
      
      // Call the API to upload and parse the file
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      // Clear the progress interval
      clearInterval(interval);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload file');
      }
      
      const data = await response.json();
      
      // Set upload as complete
      setUploadProgress(100);
      
      // Call the parent component's callback with the extracted content
      onUploadComplete(data.text, file.name);
      
      toast.success('Resume uploaded and parsed successfully!');
      
      // Reset upload state after a delay
      setTimeout(() => {
        setIsUploading(false);
      }, 1000);
      
    } catch (_error) {
      clearInterval(interval);
      setUploadError('Failed to upload file. Please try again.');
      toast.error(_error instanceof Error ? _error.message : 'Upload failed. Please try again.');
      setIsUploading(false);
    }
  };
  
  const handleRemoveFile = () => {
    setFile(null);
    setFilePreview(null);
    setUploadError(null);
  };
  
  return (
    <div className="w-full">
      {!file ? (
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive 
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
              : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <Upload className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-lg font-medium">Drag and drop your resume here</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Supports PDF and DOCX files (max 5MB)
              </p>
            </div>
            <button 
              type="button"
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Browse Files
            </button>
          </div>
        </div>
      ) : (
        <div className="border rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mr-3">
                <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-medium truncate max-w-xs">{file.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            <button 
              onClick={handleRemoveFile}
              className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {uploadError && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-md flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              <p className="text-sm">{uploadError}</p>
            </div>
          )}
          
          {filePreview && (
            <div className="mb-4 border rounded overflow-hidden">
              <iframe 
                src={filePreview} 
                className="w-full h-64" 
                title="Resume Preview"
              />
            </div>
          )}
          
          {isUploading ? (
            <div className="space-y-2">
              <div className="flex justify-between text-sm mb-1">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <button
              onClick={handleUpload}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center justify-center space-x-2 transition-colors"
            >
              <Upload className="h-5 w-5" />
              <span>Upload Resume</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
