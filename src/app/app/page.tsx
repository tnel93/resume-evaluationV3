'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

export default function MainWorkflowLayout() {
  const [showGapReport, setShowGapReport] = useState(false);
  const [showRewriteWizard, setShowRewriteWizard] = useState(false);

  // This is a placeholder function that would be replaced with actual functionality
  // when the backend is implemented
  const handleUploadComplete = () => {
    toast.success('Resume uploaded successfully!');
    // Show the gap report iframe after a simulated analysis
    setTimeout(() => {
      setShowGapReport(true);
      toast.success('Gap analysis complete!');
    }, 2000);
  };

  // This is a placeholder function that would be replaced with actual functionality
  const handleGapReportComplete = () => {
    // Show the rewrite wizard iframe
    setShowRewriteWizard(true);
    toast.success('Ready for rewriting!');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Resume Evaluation & Rewriting</h1>
      
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Upload iframe placeholder */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Upload Your Resume</h2>
          <div 
            id="iframe-upload" 
            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg h-[300px] flex items-center justify-center"
          >
            {/* TODO: This will be replaced with the actual upload widget iframe */}
            <div className="text-center">
              <p className="text-gray-500 dark:text-gray-400 mb-4">Drag and drop your resume file here or click to browse</p>
              <button 
                onClick={handleUploadComplete}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Simulate Upload
              </button>
            </div>
          </div>
        </div>
        
        {/* Gap Report iframe placeholder - hidden by default */}
        {showGapReport && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">ATS & Keyword Gap Analysis</h2>
            <div 
              id="iframe-gap-report" 
              className="border border-gray-300 dark:border-gray-600 rounded-lg h-[500px] flex items-center justify-center"
            >
              {/* TODO: This will be replaced with the actual gap report iframe */}
              <div className="text-center">
                <p className="text-gray-500 dark:text-gray-400 mb-4">Your resume has been analyzed against job requirements</p>
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span>ATS Compatibility Score</span>
                    <span>72%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '72%' }}></div>
                  </div>
                </div>
                <button 
                  onClick={handleGapReportComplete}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Proceed to Rewriting
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Rewrite Wizard iframe placeholder - hidden by default */}
        {showRewriteWizard && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Resume Rewriting Wizard</h2>
            <div 
              id="iframe-rewrite-wizard" 
              className="border border-gray-300 dark:border-gray-600 rounded-lg h-[650px] flex items-center justify-center"
            >
              {/* TODO: This will be replaced with the actual rewrite wizard iframe */}
              <div className="text-center max-w-md mx-auto">
                <p className="text-gray-500 dark:text-gray-400 mb-4">Let&apos;s optimize your resume with AI-powered suggestions</p>
                
                <div className="space-y-4 text-left mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">What role are you targeting?</label>
                    <input type="text" className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" placeholder="e.g., Software Engineer" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Years of experience in this field?</label>
                    <select className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600">
                      <option>0-1 years</option>
                      <option>1-3 years</option>
                      <option>3-5 years</option>
                      <option>5-10 years</option>
                      <option>10+ years</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Tone preference for rewriting</label>
                    <select className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600">
                      <option>Professional</option>
                      <option>Confident</option>
                      <option>Achievement-focused</option>
                      <option>Technical</option>
                    </select>
                  </div>
                </div>
                
                <button 
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Generate Optimized Resume
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
