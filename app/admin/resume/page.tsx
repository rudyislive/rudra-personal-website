'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Resume } from '@/lib/types';
import { FiSave, FiArrowLeft, FiCpu, FiUpload as FiUploadIcon } from 'react-icons/fi';

export default function EditResume() {
  const router = useRouter();
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [aiBusy, setAiBusy] = useState(false);
  const [pdfName, setPdfName] = useState('');

  const handleAnalyzeWithAI = async () => {
    setAiBusy(true);
    setMessage('Analyzing resume with AI...');
    try {
      const res = await fetch('/api/admin/ai/analyze', { method: 'POST', credentials: 'include' });
      const data = await res.json();
      if (res.ok && data.proposedResume) {
        setResume(data.proposedResume);
        setMessage('AI suggestions applied. Review and Save Changes to persist.');
      } else {
        setMessage(data.error || 'Failed to analyze resume');
      }
    } catch {
      setMessage('Failed to analyze resume');
    } finally {
      setAiBusy(false);
    }
  };

  const handleImportLinkedInPdf = async (file: File) => {
    if (!file) return;
    setPdfName(file.name);
    setAiBusy(true);
    setMessage('Importing LinkedIn PDF...');
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/admin/ai/import-pdf', { method: 'POST', body: form, credentials: 'include' });
      const data = await res.json();
      if (res.ok && data.proposedResume) {
        setResume(data.proposedResume);
        setMessage('Parsed PDF applied. Review and Save Changes to persist.');
      } else {
        setMessage(data.error || 'Failed to import LinkedIn PDF');
      }
    } catch {
      setMessage('Failed to import LinkedIn PDF');
    } finally {
      setAiBusy(false);
    }
  };

  useEffect(() => {
    // Check authentication first
    fetch('/api/admin/check', {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.authenticated) {
          router.push('/admin');
          return;
        }
        // Load resume data
        return fetch('/api/content/resume', {
          credentials: 'include',
        });
      })
      .then((res) => res?.json())
      .then((data) => {
        if (data && !data.error) {
          setResume(data);
        }
        setLoading(false);
      })
      .catch(() => {
        router.push('/admin');
        setLoading(false);
      });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resume) return;

    setSaving(true);
    setMessage('');

    const response = await fetch('/api/content/resume', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(resume),
    });

    if (response.ok) {
      setMessage('Resume updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage('Failed to update resume');
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!resume) {
    return <div className="min-h-screen flex items-center justify-center">Failed to load resume</div>;
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg"
          >
            <FiArrowLeft className="text-2xl" />
          </button>
          <h1 className="text-3xl font-bold">Edit Resume</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 rounded-lg p-6 shadow-lg space-y-6">
          {/* AI Helpers */}
          <div className="flex flex-wrap gap-3 items-center justify-between bg-zinc-50 dark:bg-zinc-800 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleAnalyzeWithAI}
                disabled={aiBusy}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg disabled:opacity-50"
              >
                <FiCpu /> {aiBusy ? 'Working...' : 'Analyze with AI'}
              </button>
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-lg cursor-pointer">
                <FiUploadIcon /> Import LinkedIn PDF
                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleImportLinkedInPdf(f);
                  }}
                />
              </label>
            </div>
            {pdfName && <p className="text-xs text-zinc-500">Selected: {pdfName}</p>}
          </div>
          {/* Personal Info */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={resume.name}
                  onChange={(e) => setResume({ ...resume, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-zinc-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={resume.title}
                  onChange={(e) => setResume({ ...resume, title: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-zinc-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={resume.email}
                  onChange={(e) => setResume({ ...resume, email: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-zinc-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <input
                  type="text"
                  value={resume.phone || ''}
                  onChange={(e) => setResume({ ...resume, phone: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-zinc-800"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <input
                type="text"
                value={resume.location || ''}
                onChange={(e) => setResume({ ...resume, location: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg dark:bg-zinc-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Summary</label>
              <textarea
                value={resume.summary}
                onChange={(e) => setResume({ ...resume, summary: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border rounded-lg dark:bg-zinc-800"
                required
              />
            </div>
          </div>

          {/* Experience */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Experience</h2>
              <button
                type="button"
                onClick={() => setResume({
                  ...resume,
                  experience: [...resume.experience, { company: '', position: '', startDate: '', description: [] }],
                })}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Add Experience
              </button>
            </div>
            {resume.experience.map((exp, idx) => (
              <div key={idx} className="border rounded-lg p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Position</label>
                    <input
                      type="text"
                      value={exp.position}
                      onChange={(e) => {
                        const newExp = [...resume.experience];
                        newExp[idx] = { ...exp, position: e.target.value };
                        setResume({ ...resume, experience: newExp });
                      }}
                      className="w-full px-4 py-2 border rounded-lg dark:bg-zinc-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Company</label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => {
                        const newExp = [...resume.experience];
                        newExp[idx] = { ...exp, company: e.target.value };
                        setResume({ ...resume, experience: newExp });
                      }}
                      className="w-full px-4 py-2 border rounded-lg dark:bg-zinc-800"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Start Date</label>
                    <input
                      type="text"
                      value={exp.startDate}
                      onChange={(e) => {
                        const newExp = [...resume.experience];
                        newExp[idx] = { ...exp, startDate: e.target.value };
                        setResume({ ...resume, experience: newExp });
                      }}
                      className="w-full px-4 py-2 border rounded-lg dark:bg-zinc-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">End Date (leave empty if present)</label>
                    <input
                      type="text"
                      value={exp.endDate || ''}
                      onChange={(e) => {
                        const newExp = [...resume.experience];
                        newExp[idx] = { ...exp, endDate: e.target.value };
                        setResume({ ...resume, experience: newExp });
                      }}
                      className="w-full px-4 py-2 border rounded-lg dark:bg-zinc-800"
                      placeholder="Present"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description (one per line)</label>
                  <textarea
                    value={exp.description.join('\n')}
                    onChange={(e) => {
                      const newExp = [...resume.experience];
                      newExp[idx] = { ...exp, description: e.target.value.split('\n').filter(l => l.trim()) };
                      setResume({ ...resume, experience: newExp });
                    }}
                    rows={4}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-zinc-800"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newExp = resume.experience.filter((_, i) => i !== idx);
                    setResume({ ...resume, experience: newExp });
                  }}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Education */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Education</h2>
              <button
                type="button"
                onClick={() => setResume({
                  ...resume,
                  education: [...resume.education, { institution: '', degree: '', field: '', startDate: '' }],
                })}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Add Education
              </button>
            </div>
            {resume.education.map((edu, idx) => (
              <div key={idx} className="border rounded-lg p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Degree</label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => {
                        const newEdu = [...resume.education];
                        newEdu[idx] = { ...edu, degree: e.target.value };
                        setResume({ ...resume, education: newEdu });
                      }}
                      className="w-full px-4 py-2 border rounded-lg dark:bg-zinc-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Field</label>
                    <input
                      type="text"
                      value={edu.field}
                      onChange={(e) => {
                        const newEdu = [...resume.education];
                        newEdu[idx] = { ...edu, field: e.target.value };
                        setResume({ ...resume, education: newEdu });
                      }}
                      className="w-full px-4 py-2 border rounded-lg dark:bg-zinc-800"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Institution</label>
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => {
                      const newEdu = [...resume.education];
                      newEdu[idx] = { ...edu, institution: e.target.value };
                      setResume({ ...resume, education: newEdu });
                    }}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-zinc-800"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Start Date</label>
                    <input
                      type="text"
                      value={edu.startDate}
                      onChange={(e) => {
                        const newEdu = [...resume.education];
                        newEdu[idx] = { ...edu, startDate: e.target.value };
                        setResume({ ...resume, education: newEdu });
                      }}
                      className="w-full px-4 py-2 border rounded-lg dark:bg-zinc-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">End Date</label>
                    <input
                      type="text"
                      value={edu.endDate || ''}
                      onChange={(e) => {
                        const newEdu = [...resume.education];
                        newEdu[idx] = { ...edu, endDate: e.target.value };
                        setResume({ ...resume, education: newEdu });
                      }}
                      className="w-full px-4 py-2 border rounded-lg dark:bg-zinc-800"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newEdu = resume.education.filter((_, i) => i !== idx);
                    setResume({ ...resume, education: newEdu });
                  }}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Skills */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Skills</h2>
            <div>
              <label className="block text-sm font-medium mb-2">Skills (comma separated)</label>
              <input
                type="text"
                value={resume.skills.join(', ')}
                onChange={(e) => setResume({ ...resume, skills: e.target.value.split(',').map(s => s.trim()).filter(s => s) })}
                className="w-full px-4 py-2 border rounded-lg dark:bg-zinc-800"
              />
            </div>
          </div>

          {message && (
            <div className={`p-4 rounded-lg ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message}
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 font-medium"
            >
              <FiSave /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin/dashboard')}
              className="px-6 py-3 bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

