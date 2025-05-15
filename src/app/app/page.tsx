'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import ResumeUploader from '@/components/ui/ResumeUploader';
import GapReport from '@/components/ui/GapReport';
import ResumeRewriter from '@/components/ui/ResumeRewriter';

export default function MainWorkflowLayout() {
  const [showGapReport, setShowGapReport] = useState(false);
  const [showRewriteWizard, setShowRewriteWizard] = useState(false);
  // These state variables will be used in future backend integration
  const [_resumeContent, setResumeContent] = useState<string | null>(null);
  const [_resumeFileName, setResumeFileName] = useState<string | null>(null);
  const [jobDescInput, setJobDescInput] = useState<string>('');

  // Handle resume upload completion
  const handleUploadComplete = (fileContent: string, fileName: string) => {
    setResumeContent(fileContent);
    setResumeFileName(fileName);
    
    // Show the gap report iframe after a simulated analysis
    setTimeout(() => {
      setShowGapReport(true);
      toast.success('Gap analysis complete!');
    }, 2000);
  };

  // Handle gap report completion
  const handleGapReportComplete = () => {
    // Show the rewrite wizard iframe
    setShowRewriteWizard(true);
    toast.success('Ready for rewriting!');
  };
  
  // Handle proceeding to rewriting from gap report
  const handleProceedToRewriting = () => {
    setShowRewriteWizard(true);
    toast.success('Ready for rewriting!');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Resume Evaluation & Rewriting</h1>
      
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Upload section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Upload Your Resume</h2>
          <div id="iframe-upload" className="h-[300px]">
            <ResumeUploader onUploadComplete={handleUploadComplete} />
          </div>
        </div>
        
        {/* Gap Report - hidden by default */}
        {showGapReport && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">ATS & Keyword Gap Analysis</h2>
            <div id="iframe-gap-report" className="h-[500px]">
              {_resumeContent && (
                <GapReport 
                  resumeText={_resumeContent} 
                  onProceedToRewriting={handleProceedToRewriting}
                />
              )}
            </div>
          </div>
        )}
        
        {/* Resume Rewriting Wizard - hidden by default */}
        {showRewriteWizard && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Resume Rewriting Wizard</h2>
            <div id="iframe-rewrite-wizard" className="h-[650px]">
              {_resumeContent && (
                <ResumeRewriter 
                  resumeText={_resumeContent} 
                  jobDescription={jobDescInput}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
