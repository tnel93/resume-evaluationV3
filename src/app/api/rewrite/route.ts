import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
// In production, use environment variables for the API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key-for-development',
});

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

export async function POST(request: NextRequest) {
  try {
    // Get the request body
    const body = await request.json();
    const { resumeText, targetAudience, jobDescription } = body;
    
    if (!resumeText) {
      return NextResponse.json({ error: 'No resume text provided' }, { status: 400 });
    }
    
    if (!targetAudience) {
      return NextResponse.json({ error: 'No target audience provided' }, { status: 400 });
    }
    
    // Check if we're in development mode (no API key)
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'dummy-key-for-development') {
      // Return mock data for development
      return NextResponse.json({ 
        success: true, 
        data: getMockResumeData()
      });
    }
    
    // Prepare the prompt for OpenAI
    const prompt = `
    You are ResumeGPT, a hybrid of:
    • Lisa Rangel's recruiter-backwards strategy,
    • ResumeGo's collaborative writer craftsmanship, and
    • Rezi's data-driven ATS science.
    
    NORTH-STAR SPEC (must hold true for every draft):
    1. Target reader: ${targetAudience}
    2. Time-to-decision: skimmable → shortlist in ≤ 30 seconds
    3. Parsing constraint: 100% Conforms to standard ATS parse
    4. Value thesis: open with ONE sentence summarizing brand & ROI
    5. Proof style: every bullet = Verb + Metric + Business-Impact
    6. Layout guardrails: single page, 11 pt Helvetica/Arial, no tables/text boxes
    7. Success metric: ≥ 80% recruiter-sim shortlist score
    
    Here is the resume text to optimize:
    ${resumeText}
    
    ${jobDescription ? `Here is the job description to target:\n${jobDescription}` : ''}
    
    Please analyze this resume and rewrite it according to the North-Star specifications.
    Return your response as a JSON object with the following structure:
    {
      "value_thesis": "One sentence summarizing brand & ROI",
      "summary": "Professional summary paragraph",
      "core_competencies": ["Skill 1", "Skill 2", ...],
      "experience": [
        {
          "title": "Job Title",
          "company": "Company Name",
          "location": "Location",
          "dates": "Start Date - End Date",
          "bullets": ["Achievement 1", "Achievement 2", ...]
        },
        ...
      ],
      "education": ["Education 1", "Education 2", ...],
      "certifications": ["Certification 1", "Certification 2", ...],
      "technical_skills": ["Skill Category: Skills", ...],
      "awards": ["Award 1", "Award 2", ...],
      "volunteer": ["Volunteer Experience 1", ...]
    }
    `;
    
    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        { role: "system", content: "You are ResumeGPT, an expert resume writer." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });
    
    // Parse the response
    const responseContent = completion.choices[0].message.content;
    if (!responseContent) {
      throw new Error('Empty response from OpenAI');
    }
    
    const resumeData = JSON.parse(responseContent) as ResumeData;
    
    // Return the optimized resume data
    return NextResponse.json({ 
      success: true, 
      data: resumeData
    });
    
  } catch (error) {
    console.error('Error processing resume rewrite:', error);
    return NextResponse.json({ 
      error: 'Failed to process resume rewrite',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Function to get mock resume data for development
function getMockResumeData(): ResumeData {
  return {
    value_thesis: "Innovative software engineer with 5+ years experience delivering high-impact solutions that increase efficiency by 30%+",
    summary: "Results-driven software engineer with expertise in full-stack development, cloud architecture, and agile methodologies. Proven track record of delivering scalable applications that drive business growth and operational efficiency.",
    core_competencies: [
      "Full-Stack Development",
      "Cloud Architecture",
      "Agile Project Management",
      "Performance Optimization",
      "CI/CD Implementation"
    ],
    experience: [
      {
        title: "Senior Software Engineer",
        company: "TechCorp Inc.",
        location: "San Francisco, CA",
        dates: "Jan 2022 - Present",
        bullets: [
          "Architect and implement microservices architecture reducing system latency by 40% and increasing throughput by 25%",
          "Lead team of 5 engineers to deliver critical features on time, resulting in 15% increase in customer satisfaction",
          "Optimize database queries reducing load times by 60% and improving overall application performance"
        ]
      },
      {
        title: "Software Developer",
        company: "InnovateSoft",
        location: "Austin, TX",
        dates: "Mar 2019 - Dec 2021",
        bullets: [
          "Developed RESTful APIs supporting 1M+ daily requests with 99.9% uptime",
          "Implemented automated testing framework reducing bug rate by 35% and deployment time by 45%",
          "Collaborated with product team to launch 3 major features generating $2M in additional revenue"
        ]
      }
    ],
    education: [
      "M.S. Computer Science, Stanford University, 2019",
      "B.S. Computer Engineering, University of Texas, 2017"
    ],
    certifications: [
      "AWS Certified Solutions Architect",
      "Google Cloud Professional Developer",
      "Certified Scrum Master"
    ],
    technical_skills: [
      "Languages: JavaScript, TypeScript, Python, Java",
      "Frameworks: React, Node.js, Express, Django",
      "Cloud: AWS, GCP, Azure",
      "Tools: Docker, Kubernetes, Jenkins, Git"
    ],
    awards: [
      "Innovation Award, TechCorp Inc., 2023",
      "Hackathon Winner, Developer Conference, 2021"
    ],
    volunteer: [
      "Code Mentor, CoderDojo, 2020-Present",
      "Technical Advisor, Local STEM Program, 2019-2021"
    ]
  };
}
