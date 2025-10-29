'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiSave, FiArrowLeft, FiCheck, FiX } from 'react-icons/fi';

interface ApiCredentials {
  twitter: {
    username: string;
    bearerToken: string;
  };
  linkedin: {
    accessToken: string;
    personId: string;
  };
}

export default function ApiCredentialsPage() {
  const router = useRouter();
  const [credentials, setCredentials] = useState<ApiCredentials>({
    twitter: { username: '', bearerToken: '' },
    linkedin: { accessToken: '', personId: '' },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [testResults, setTestResults] = useState<any>({});

  useEffect(() => {
    fetch('/api/admin/api-credentials', {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          router.push('/admin');
        } else {
          // Only set username/personId if credentials exist, let user enter tokens
          setCredentials({
            twitter: {
              username: data.credentials?.twitter?.username || '',
              bearerToken: '', // Always empty for security
            },
            linkedin: {
              accessToken: '', // Always empty for security
              personId: data.credentials?.linkedin?.personId || '',
            },
          });
          setLoading(false);
        }
      })
      .catch(() => {
        router.push('/admin');
      });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    const response = await fetch('/api/admin/api-credentials', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (response.ok) {
      setMessage(data.message || 'API credentials saved successfully!');
      setTestResults(data.testResults || {});
      // Clear token fields after successful save for security
      setCredentials({
        ...credentials,
        twitter: { ...credentials.twitter, bearerToken: '' },
        linkedin: { ...credentials.linkedin, accessToken: '' },
      });
      setTimeout(() => setMessage(''), 5000);
    } else {
      setMessage(data.error || 'Failed to save API credentials');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="text-zinc-600 dark:text-zinc-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <FiArrowLeft className="text-2xl text-zinc-700 dark:text-zinc-300" />
          </button>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            API Credentials Configuration
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Twitter/X API Section */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                X (Twitter) API
              </h2>
              {testResults.twitter && (
                <div className="flex items-center gap-2">
                  {testResults.twitter === 'valid' ? (
                    <>
                      <FiCheck className="text-green-500" />
                      <span className="text-sm text-green-600 dark:text-green-400">Valid</span>
                    </>
                  ) : (
                    <>
                      <FiX className="text-red-500" />
                      <span className="text-sm text-red-600 dark:text-red-400">Invalid</span>
                    </>
                  )}
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Twitter Username (without @)
                </label>
                <input
                  type="text"
                  value={credentials.twitter.username}
                  onChange={(e) =>
                    setCredentials({
                      ...credentials,
                      twitter: { ...credentials.twitter, username: e.target.value },
                    })
                  }
                  placeholder="your_username"
                  className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg dark:bg-zinc-800 dark:text-white focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Bearer Token
                </label>
                <input
                  type="password"
                  value={credentials.twitter.bearerToken}
                  onChange={(e) =>
                    setCredentials({
                      ...credentials,
                      twitter: { ...credentials.twitter, bearerToken: e.target.value },
                    })
                  }
                  placeholder={credentials.twitter.username ? "Enter new token or leave empty to keep existing" : "AAAAAAAAAAAAAAAAAAAAA..."}
                  className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg dark:bg-zinc-800 dark:text-white focus:ring-2 focus:ring-purple-500"
                />
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
                  Get your Bearer Token from{' '}
                  <a
                    href="https://developer.twitter.com/en/portal/dashboard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 dark:text-purple-400 hover:underline"
                  >
                    Twitter Developer Portal
                  </a>
                  . Leave empty to keep existing token.
                </p>
              </div>
            </div>
          </div>

          {/* LinkedIn API Section */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                LinkedIn API
              </h2>
              {testResults.linkedin && (
                <div className="flex items-center gap-2">
                  {testResults.linkedin === 'valid' ? (
                    <>
                      <FiCheck className="text-green-500" />
                      <span className="text-sm text-green-600 dark:text-green-400">Valid</span>
                    </>
                  ) : (
                    <>
                      <FiX className="text-red-500" />
                      <span className="text-sm text-red-600 dark:text-red-400">Invalid</span>
                    </>
                  )}
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Access Token
                </label>
                <input
                  type="password"
                  value={credentials.linkedin.accessToken}
                  onChange={(e) =>
                    setCredentials({
                      ...credentials,
                      linkedin: { ...credentials.linkedin, accessToken: e.target.value },
                    })
                  }
                  placeholder={credentials.linkedin.personId ? "Enter new token or leave empty to keep existing" : "AQT..."}
                  className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg dark:bg-zinc-800 dark:text-white focus:ring-2 focus:ring-purple-500"
                />
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
                  Get your Access Token from{' '}
                  <a
                    href="https://www.linkedin.com/developers/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 dark:text-purple-400 hover:underline"
                  >
                    LinkedIn Developers Portal
                  </a>
                  . Leave empty to keep existing token.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Person ID (LinkedIn Profile ID)
                </label>
                <input
                  type="text"
                  value={credentials.linkedin.personId}
                  onChange={(e) =>
                    setCredentials({
                      ...credentials,
                      linkedin: { ...credentials.linkedin, personId: e.target.value },
                    })
                  }
                  placeholder="urn:li:person:..."
                  className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg dark:bg-zinc-800 dark:text-white focus:ring-2 focus:ring-purple-500"
                />
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
                  Your LinkedIn Person ID (URN format)
                </p>
              </div>
            </div>
          </div>

          {message && (
            <div
              className={`p-4 rounded-lg ${
                message.includes('success') || message.includes('saved')
                  ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                  : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300'
              }`}
            >
              {message}
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 font-medium transition-colors"
            >
              <FiSave /> {saving ? 'Saving...' : 'Save Credentials'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin/dashboard')}
              className="px-6 py-3 bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>

        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <h3 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">Need Help?</h3>
          <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
            <li>• Twitter API: Create an app at{' '}
              <a href="https://developer.twitter.com/" target="_blank" rel="noopener noreferrer" className="underline">developer.twitter.com</a>
            </li>
            <li>• LinkedIn API: Create an app at{' '}
              <a href="https://www.linkedin.com/developers/" target="_blank" rel="noopener noreferrer" className="underline">linkedin.com/developers</a>
            </li>
            <li>• Credentials are stored securely in <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">content/api-credentials.json</code></li>
            <li>• Social feeds update every hour automatically</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

