'use client';

import { Resume } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { FaDownload } from 'react-icons/fa';
import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ResumeSectionProps {
  resume: Resume;
}

export function ResumeSection({ resume }: ResumeSectionProps) {
  const resumeRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadResume = async () => {
    // Check if there's an uploaded resume.pdf first
    try {
      const response = await fetch('/uploads/resume.pdf', { method: 'HEAD' });
      if (response.ok) {
        window.open('/uploads/resume.pdf', '_blank');
        return;
      }
    } catch {
      // Continue to generate PDF if no uploaded file
    }

    if (!resumeRef.current) return;

    setIsGenerating(true);
    try {
      // Hide the download button temporarily
      const downloadBtn = resumeRef.current.querySelector('[data-download-btn]') as HTMLElement;
      if (downloadBtn) {
        downloadBtn.style.display = 'none';
      }

      // Capture the resume card as canvas
      const canvas = await html2canvas(resumeRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      // Show the download button again
      if (downloadBtn) {
        downloadBtn.style.display = '';
      }

      const imgData = canvas.toDataURL('image/png');
      
      // Calculate PDF dimensions
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const pdfWidth = 210; // A4 width in mm
      const pdfHeight = (imgHeight * pdfWidth) / imgWidth;
      
      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // If content is taller than one page, split it
      let heightLeft = pdfHeight;
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= 297; // A4 height in mm
      
      while (heightLeft > 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= 297;
      }
      
      // Save the PDF
      pdf.save(`${resume.name.replace(/\s+/g, '-')}-Resume.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="mb-8">
        <div ref={resumeRef}>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2 text-zinc-900 dark:text-zinc-50">
              {resume.name}
            </h2>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-4">
              {resume.title}
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-zinc-600 dark:text-zinc-400 mb-4">
              <a href={`mailto:${resume.email}`} className="hover:text-purple-600 dark:hover:text-purple-400">
                {resume.email}
              </a>
              {resume.phone && <span>{resume.phone}</span>}
              {resume.location && <span>{resume.location}</span>}
            </div>
            <button
              data-download-btn
              onClick={handleDownloadResume}
              disabled={isGenerating}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg transition-colors font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaDownload /> {isGenerating ? 'Generating PDF...' : 'Download Resume'}
            </button>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-3 text-zinc-900 dark:text-zinc-50">
              Summary
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400">{resume.summary}</p>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-zinc-50">
              Experience
            </h3>
            <div className="space-y-6">
              {resume.experience.map((exp, index) => (
                <div key={index} className="border-l-2 border-purple-500 pl-4">
                  <h4 className="font-semibold text-lg text-zinc-900 dark:text-zinc-50">
                    {exp.position}
                  </h4>
                  <p className="text-zinc-600 dark:text-zinc-400 mb-2">
                    {exp.company} • {exp.startDate} - {exp.endDate || 'Present'}
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {exp.description.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-zinc-50">
              Education
            </h3>
            <div className="space-y-4">
              {resume.education.map((edu, index) => (
                <div key={index}>
                  <h4 className="font-semibold text-lg text-zinc-900 dark:text-zinc-50">
                    {edu.degree} in {edu.field}
                  </h4>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    {edu.institution} • {edu.startDate} - {edu.endDate || 'Present'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-zinc-50">
              Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {resume.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm border border-purple-200 dark:border-purple-800"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
