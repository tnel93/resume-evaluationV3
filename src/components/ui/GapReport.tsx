'use client';

import { useState } from 'react';
import { AlertCircle, CheckCircle, FileText } from 'lucide-react';

interface GapReportProps {
  resumeText: string;
  jobDescription?: string;
  onProceedToRewriting: () => void;
}

// Mock data for skills and keywords
const commonSkills = [
  'JavaScript', 'React', 'Node.js', 'TypeScript', 'HTML', 'CSS', 
  'Python', 'Java', 'SQL', 'AWS', 'Docker', 'Git', 'Agile',
  'Communication', 'Problem Solving', 'Team Leadership'
];

export default function GapReport({ resumeText, jobDescription, onProceedToRewriting }: GapReportProps) {
  const [jobDescInput, setJobDescInput] = useState(jobDescription || '');
  
  // Generate analysis based on resume text and job description
  const analysis = generateAnalysis(resumeText, jobDescInput);
  
  return (
    <div className="space-y-6">
      {/* Optional Job Description Input */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <h3 className="font-medium mb-2">Job Description (Optional)</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          Paste a job description to get a more accurate analysis
        </p>
        <textarea
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          rows={4}
          placeholder="Paste job description here..."
          value={jobDescInput}
          onChange={(e) => setJobDescInput(e.target.value)}
        ></textarea>
        {jobDescInput && (
          <button
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            onClick={() => {
              // Re-analyze with the new job description
              // In a real implementation, this would trigger a new analysis
            }}
          >
            Update Analysis
          </button>
        )}
      </div>
      
      {/* Overall Score */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold mb-4">ATS Compatibility Score</h3>
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-700 dark:text-gray-300">Overall Score</span>
          <span className="font-bold text-lg">{analysis.overallScore}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-4">
          <div 
            className={`h-2.5 rounded-full ${getScoreColorClass(analysis.overallScore)}`}
            style={{ width: `${analysis.overallScore}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {getScoreMessage(analysis.overallScore)}
        </p>
      </div>
      
      {/* Keyword Analysis */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold mb-4">Keyword Analysis</h3>
        
        {/* Present Keywords */}
        <div className="mb-6">
          <h4 className="font-medium text-green-600 dark:text-green-400 mb-2 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            Keywords Found
          </h4>
          <div className="flex flex-wrap gap-2">
            {analysis.presentKeywords.map((keyword, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
        
        {/* Missing Keywords */}
        <div>
          <h4 className="font-medium text-red-600 dark:text-red-400 mb-2 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            Missing Keywords
          </h4>
          <div className="flex flex-wrap gap-2">
            {analysis.missingKeywords.map((keyword, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-full text-sm"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      {/* Recommendations */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold mb-4">Recommendations</h3>
        <ul className="space-y-3">
          {analysis.recommendations.map((recommendation, index) => (
            <li key={index} className="flex items-start">
              <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
              <span>{recommendation}</span>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Action Button */}
      <div className="flex justify-end">
        <button
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          onClick={onProceedToRewriting}
        >
          Proceed to Resume Rewriting
        </button>
      </div>
    </div>
  );
}

// Helper function to get color class based on score
function getScoreColorClass(score: number): string {
  if (score >= 80) return 'bg-green-600';
  if (score >= 60) return 'bg-yellow-500';
  return 'bg-red-600';
}

// Helper function to get score message
function getScoreMessage(score: number): string {
  if (score >= 80) {
    return 'Your resume is well-optimized for ATS systems. Great job!';
  }
  if (score >= 60) {
    return 'Your resume has decent ATS compatibility but could use some improvements.';
  }
  return 'Your resume needs significant optimization to pass ATS systems.';
}

// Mock function to generate analysis
// In a real implementation, this would use NLP and more sophisticated algorithms
function generateAnalysis(resumeText: string, jobDescription: string): {
  overallScore: number;
  presentKeywords: string[];
  missingKeywords: string[];
  recommendations: string[];
} {
  // Convert texts to lowercase for case-insensitive matching
  const resumeLower = resumeText.toLowerCase();
  
  // Determine which skills to check against
  let keywordsToCheck = commonSkills;
  
  // If job description is provided, extract keywords from it
  if (jobDescription) {
    // This is a simplified approach - a real implementation would use NLP
    // to extract relevant keywords from the job description
    keywordsToCheck = commonSkills.filter(skill => 
      jobDescription.toLowerCase().includes(skill.toLowerCase())
    );
    
    // If no keywords were found in the job description, fall back to common skills
    if (keywordsToCheck.length === 0) {
      keywordsToCheck = commonSkills;
    }
  }
  
  // Check which keywords are present in the resume
  const presentKeywords = keywordsToCheck.filter(skill => 
    resumeLower.includes(skill.toLowerCase())
  );
  
  // Determine missing keywords
  const missingKeywords = keywordsToCheck.filter(skill => 
    !resumeLower.includes(skill.toLowerCase())
  );
  
  // Calculate overall score
  const overallScore = keywordsToCheck.length > 0
    ? Math.round((presentKeywords.length / keywordsToCheck.length) * 100)
    : 50; // Default score if no keywords to check
  
  // Generate recommendations
  const recommendations: string[] = [];
  
  if (missingKeywords.length > 0) {
    recommendations.push(`Add these missing keywords to your resume: ${missingKeywords.join(', ')}.`);
  }
  
  if (overallScore < 80) {
    recommendations.push('Use more industry-specific terminology throughout your resume.');
    recommendations.push('Ensure your skills section clearly lists your technical and soft skills.');
  }
  
  if (!jobDescription) {
    recommendations.push('For a more accurate analysis, paste a specific job description above.');
  }
  
  // Add general recommendations
  recommendations.push('Use a clean, ATS-friendly format with standard section headings.');
  recommendations.push('Quantify your achievements with numbers and metrics where possible.');
  
  return {
    overallScore,
    presentKeywords,
    missingKeywords,
    recommendations
  };
}
