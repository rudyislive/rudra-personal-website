'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiUpload, FiArrowLeft, FiFile, FiTrash2, FiDownload } from 'react-icons/fi';

interface UploadedFile {
  name: string;
  type: string;
  size: number;
  url: string;
}

export default function FileUpload() {
  const router = useRouter();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

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
        // Load files
        fetchFiles();
      })
      .catch(() => {
        router.push('/admin');
      });
  }, [router]);

  const fetchFiles = async () => {
    try {
      const response = await fetch('/api/files', {
        credentials: 'include',
      });
      if (response.status === 401) {
        router.push('/admin');
        return;
      }
      const data = await response.json();
      if (data.files) {
        setFiles(data.files);
      }
    } catch (error) {
      console.error('Error fetching files:', error);
      router.push('/admin');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/png',
      'image/jpeg',
      'image/jpg',
    ];

    if (!validTypes.includes(file.type)) {
      setMessage('Invalid file type. Please upload PDF, Word document, or images.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setUploading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/files/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('File uploaded successfully!');
        fetchFiles();
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(data.error || 'Failed to upload file');
      }
    } catch (error) {
      setMessage('Failed to upload file');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (fileName: string) => {
    if (!confirm(`Are you sure you want to delete ${fileName}?`)) return;

    try {
      const response = await fetch(`/api/files?filename=${encodeURIComponent(fileName)}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        setMessage('File deleted successfully!');
        fetchFiles();
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Failed to delete file');
      }
    } catch (error) {
      setMessage('Failed to delete file');
    }
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('word') || type.includes('document')) return '📝';
    if (type.includes('image')) return '🖼️';
    return '📎';
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
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
          <h1 className="text-3xl font-bold">File Upload</h1>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 shadow-lg space-y-6">
          {/* Upload Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Upload New File</h2>
            <div className="border-2 border-dashed border-purple-300 dark:border-purple-700 rounded-lg p-8 text-center">
              <input
                type="file"
                id="file-upload"
                onChange={handleFileUpload}
                disabled={uploading}
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                className="hidden"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center gap-4"
              >
                <FiUpload className="text-4xl text-purple-600 dark:text-purple-400" />
                <div>
                  <span className="text-purple-600 dark:text-purple-400 font-medium">
                    Click to upload
                  </span>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
                    PDF, Word documents, or Images (PNG, JPG)
                  </p>
                </div>
              </label>
            </div>
            {uploading && (
              <p className="text-center text-zinc-600 dark:text-zinc-400 mt-4">
                Uploading...
              </p>
            )}
          </div>

          {/* Message */}
          {message && (
            <div
              className={`p-4 rounded-lg ${
                message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}
            >
              {message}
            </div>
          )}

          {/* Uploaded Files */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Uploaded Files</h2>
            {files.length === 0 ? (
              <p className="text-zinc-600 dark:text-zinc-400 text-center py-8">
                No files uploaded yet
              </p>
            ) : (
              <div className="space-y-2">
                {files.map((file) => (
                  <div
                    key={file.name}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{getFileIcon(file.type)}</span>
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                          {(file.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg"
                      >
                        <FiDownload />
                      </a>
                      <button
                        onClick={() => handleDelete(file.name)}
                        className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 rounded-lg"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">About Resume PDF</h3>
            <p className="text-sm text-zinc-700 dark:text-zinc-300">
              If you upload a file named <code className="bg-white dark:bg-zinc-800 px-2 py-1 rounded">resume.pdf</code> in the public
              folder, it will be used instead of the auto-generated PDF. Otherwise, the website
              automatically generates a PDF from your resume content.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

