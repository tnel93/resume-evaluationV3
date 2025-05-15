'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { ArrowRight, CheckCircle, Edit, FileText, Loader2 } from 'lucide-react';

interface ResumeRewriterProps {
  resumeText: string;
  jobDescription?: string;
}

// Define the resume JSON structure based on the custom methodology
interface ResumeData {
  value_thesis: string;
  summary: string;
  core_competencies: string[];
  experience: {
    title: string;
    company: string;
    location: string;
    dates: string;
    bullets: string[];
  }[];
  education: string[];
  certifications: string[];
  technical_skills: string[];
  awards: string[];
  volunteer: string[];
}

export default function ResumeRewriter({ resumeText, jobDescription }: ResumeRewriterProps) {
  const [step, setStep] = useState(1);
  const [targetAudience, setTargetAudience] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [editSection, setEditSection] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  
  // Function to call the OpenAI API through our backend
  const processResumeWithOpenAI = async () => {
    setIsProcessing(true);
    
    try {
      // Call our backend API to process the resume with OpenAI
      const response = await fetch('/api/rewrite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeText,
          targetAudience,
          jobDescription
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process resume');
      }
      
      const data = await response.json();
      
      if (!data.success || !data.data) {
        throw new Error('Invalid response from server');
      }
      
      // Set the optimized resume data
      setResumeData(data.data);
      setStep(3);
      
      // Show success message
      toast.success('Resume optimized successfully!');
      
    } catch (error) {
      console.error('Error processing resume:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to process resume');
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Function to handle section editing
  const handleEditSection = (section: string, content: any) => {
    setEditSection(section);
    
    if (typeof content === 'string') {
      setEditContent(content);
    } else if (Array.isArray(content)) {
      setEditContent(content.join('\\n'));
    } else if (typeof content === 'object') {
      setEditContent(JSON.stringify(content, null, 2));
    }
  };
  
  // Function to save edited content
  const handleSaveEdit = () => {
    if (!editSection || !resumeData) return;
    
    const newResumeData = { ...resumeData };
    
    if (editSection === 'value_thesis') {
      newResumeData.value_thesis = editContent;
    } else if (editSection === 'summary') {
      newResumeData.summary = editContent;
    } else if (editSection === 'core_competencies') {
      newResumeData.core_competencies = editContent.split('\\n').filter(Boolean);
    } else if (editSection === 'technical_skills') {
      newResumeData.technical_skills = editContent.split('\\n').filter(Boolean);
    } else if (editSection === 'education') {
      newResumeData.education = editContent.split('\\n').filter(Boolean);
    } else if (editSection === 'certifications') {
      newResumeData.certifications = editContent.split('\\n').filter(Boolean);
    } else if (editSection === 'awards') {
      newResumeData.awards = editContent.split('\\n').filter(Boolean);
    } else if (editSection === 'volunteer') {
      newResumeData.volunteer = editContent.split('\\n').filter(Boolean);
    }
    
    setResumeData(newResumeData);
    setEditSection(null);
    setEditContent('');
  };
  
  // Function to render the appropriate step
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Step 1: Target Audience</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Who is the target audience or what industry are you applying to?
            </p>
            <div className="space-y-4">
              <input
                type="text"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="e.g., FAANG tech-recruiter, Healthcare industry, etc."
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
              />
              <button
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                onClick={() => setStep(2)}
                disabled={!targetAudience.trim()}
              >
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Step 2: Resume Analysis</h2>
            <p className="text-gray-600 dark:text-gray-400">
              We'll analyze your resume and optimize it based on the North-Star specifications:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-400">
              <li>Target reader: {targetAudience}</li>
              <li>Time-to-decision: skimmable → shortlist in ≤ 30 seconds</li>
              <li>Parsing constraint: 100% Conforms to standard ATS parsers</li>
              <li>Value thesis: open with ONE sentence summarizing your brand & ROI</li>
              <li>Proof style: every bullet = Verb + Metric + Business-Impact</li>
              <li>Layout guardrails: single page, 11 pt Helvetica/Arial, no tables/text boxes</li>
              <li>Success metric: ≥ 80% recruiter-sim shortlist score</li>
            </ul>
            <div className="flex justify-end">
              <button
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                onClick={processResumeWithOpenAI}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Optimize Resume <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Step 3: Optimized Resume</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Your resume has been optimized for ATS compatibility and recruiter appeal. You can edit any section by clicking the edit button.
            </p>
            
            {resumeData && (
              <div className="space-y-8">
                {/* Value Thesis */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Value Thesis</h3>
                    <button 
                      className="text-blue-600 dark:text-blue-400"
                      onClick={() => handleEditSection('value_thesis', resumeData.value_thesis)}
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{resumeData.value_thesis}</p>
                </div>
                
                {/* Summary */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Professional Summary</h3>
                    <button 
                      className="text-blue-600 dark:text-blue-400"
                      onClick={() => handleEditSection('summary', resumeData.summary)}
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{resumeData.summary}</p>
                </div>
                
                {/* Core Competencies */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Core Competencies</h3>
                    <button 
                      className="text-blue-600 dark:text-blue-400"
                      onClick={() => handleEditSection('core_competencies', resumeData.core_competencies)}
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {resumeData.core_competencies.map((skill, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Experience */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Professional Experience</h3>
                  </div>
                  <div className="space-y-6">
                    {resumeData.experience.map((exp, expIndex) => (
                      <div key={expIndex} className="border-l-2 border-blue-500 pl-4 py-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{exp.title}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {exp.company} | {exp.location} | {exp.dates}
                            </p>
                          </div>
                          <button 
                            className="text-blue-600 dark:text-blue-400"
                            onClick={() => handleEditSection(`experience_${expIndex}`, exp)}
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                        </div>
                        <ul className="mt-2 space-y-2">
                          {exp.bullets.map((bullet, bulletIndex) => (
                            <li key={bulletIndex} className="flex items-start">
                              <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                              <span className="text-sm">{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Education */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Education</h3>
                    <button 
                      className="text-blue-600 dark:text-blue-400"
                      onClick={() => handleEditSection('education', resumeData.education)}
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                  <ul className="space-y-1">
                    {resumeData.education.map((edu, index) => (
                      <li key={index} className="text-gray-700 dark:text-gray-300 text-sm">
                        {edu}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Technical Skills */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Technical Skills</h3>
                    <button 
                      className="text-blue-600 dark:text-blue-400"
                      onClick={() => handleEditSection('technical_skills', resumeData.technical_skills)}
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                  <ul className="space-y-1">
                    {resumeData.technical_skills.map((skill, index) => (
                      <li key={index} className="text-gray-700 dark:text-gray-300 text-sm">
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Certifications */}
                {resumeData.certifications.length > 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">Certifications</h3>
                      <button 
                        className="text-blue-600 dark:text-blue-400"
                        onClick={() => handleEditSection('certifications', resumeData.certifications)}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                    <ul className="space-y-1">
                      {resumeData.certifications.map((cert, index) => (
                        <li key={index} className="text-gray-700 dark:text-gray-300 text-sm">
                          {cert}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Awards */}
                {resumeData.awards.length > 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">Awards & Recognition</h3>
                      <button 
                        className="text-blue-600 dark:text-blue-400"
                        onClick={() => handleEditSection('awards', resumeData.awards)}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                    <ul className="space-y-1">
                      {resumeData.awards.map((award, index) => (
                        <li key={index} className="text-gray-700 dark:text-gray-300 text-sm">
                          {award}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Volunteer */}
                {resumeData.volunteer.length > 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">Volunteer Experience</h3>
                      <button 
                        className="text-blue-600 dark:text-blue-400"
                        onClick={() => handleEditSection('volunteer', resumeData.volunteer)}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                    <ul className="space-y-1">
                      {resumeData.volunteer.map((vol, index) => (
                        <li key={index} className="text-gray-700 dark:text-gray-300 text-sm">
                          {vol}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Download Button */}
                <div className="flex justify-end">
                  <button
                    className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                    onClick={() => {
                      // In a real implementation, this would generate a PDF
                      alert('Download functionality will be implemented in the next phase');
                    }}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Download Resume
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };
  
  // Render edit modal
  const renderEditModal = () => {
    if (!editSection) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
          <h3 className="text-xl font-semibold mb-4">Edit {editSection.replace('_', ' ').replace(/^\w/, c => c.toUpperCase())}</h3>
          <textarea
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 mb-4"
            rows={10}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          ></textarea>
          <div className="flex justify-end space-x-3">
            <button
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={() => {
                setEditSection(null);
                setEditContent('');
              }}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              onClick={handleSaveEdit}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      {renderStep()}
      {renderEditModal()}
    </div>
  );
}
