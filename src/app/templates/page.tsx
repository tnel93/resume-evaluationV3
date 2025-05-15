'use client';

import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { Download, X } from 'lucide-react';
import toast from 'react-hot-toast';

// Define template interface
interface Template {
  id: number;
  name: string;
  image: string;
}

// Mock template data - in a real app, this would come from an API
const templates: Template[] = [
  { id: 1, name: 'Professional', image: '/templates/template1.png' },
  { id: 2, name: 'Modern', image: '/templates/template2.png' },
  { id: 3, name: 'Creative', image: '/templates/template3.png' },
  { id: 4, name: 'Executive', image: '/templates/template4.png' },
  { id: 5, name: 'Technical', image: '/templates/template5.png' },
  { id: 6, name: 'Minimalist', image: '/templates/template6.png' },
];

export default function TemplateGallery() {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  
  const openModal = (template: Template) => {
    setSelectedTemplate(template);
  };
  
  const closeModal = () => {
    setSelectedTemplate(null);
  };
  
  const handleDownload = () => {
    if (selectedTemplate) {
      toast.success(`Template "${selectedTemplate.name}" will be downloaded soon.`);
      // In a real app, this would trigger an actual download
      setTimeout(() => {
        closeModal();
      }, 1500);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4 text-center">Resume Templates</h1>
      <p className="text-center text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
        Choose from our professionally designed templates to get started. Each template is ATS-friendly and optimized for maximum impact.
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {templates.map((template) => (
          <div 
            key={template.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-transform hover:scale-105"
            onClick={() => openModal(template)}
          >
            <div className="relative h-80 w-full">
              {/* This would be replaced with actual template images */}
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                <p className="text-lg font-medium">{template.name} Template</p>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg">{template.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Perfect for {template.name.toLowerCase()} roles</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Template Preview Modal */}
      {selectedTemplate && (
        <Dialog
          open={!!selectedTemplate}
          onClose={closeModal}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="mx-auto max-w-3xl rounded-lg bg-white dark:bg-gray-800 p-6 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <Dialog.Title className="text-xl font-semibold">
                  {selectedTemplate.name} Template
                </Dialog.Title>
                <button 
                  onClick={closeModal}
                  className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="relative h-96 w-full mb-4">
                {/* This would be replaced with actual template preview */}
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                  <p className="text-xl font-medium">{selectedTemplate.name} Template Preview</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <p className="text-gray-600 dark:text-gray-300">
                  ATS-friendly and optimized for {selectedTemplate.name.toLowerCase()} positions.
                </p>
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  <Download size={18} className="mr-2" />
                  Use This Template
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      )}
    </div>
  );
}
