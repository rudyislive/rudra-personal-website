'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SocialLinks } from '@/lib/types/social';
import { FiSave, FiArrowLeft } from 'react-icons/fi';

export default function EditSocialLinks() {
  const router = useRouter();
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
        // Load social links data
        return fetch('/api/content/social', {
          credentials: 'include',
        });
      })
      .then((res) => res?.json())
      .then((data) => {
        if (data && !data.error) {
          setSocialLinks(data);
        } else {
          router.push('/admin');
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
    setSaving(true);
    setMessage('');

    const response = await fetch('/api/content/social', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(socialLinks),
    });

    if (response.ok) {
      setMessage('Social links updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage('Failed to update social links');
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const platforms = [
    { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/your-profile' },
    { key: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/your-profile' },
    { key: 'twitter', label: 'Twitter/X', placeholder: 'https://twitter.com/your-profile' },
    { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/your-profile' },
    { key: 'github', label: 'GitHub', placeholder: 'https://github.com/your-profile' },
    { key: 'reddit', label: 'Reddit', placeholder: 'https://reddit.com/user/your-profile' },
    { key: 'coinmarketcap', label: 'CoinMarketCap', placeholder: 'https://coinmarketcap.com/community/profile/your-profile' },
    { key: 'threads', label: 'Threads', placeholder: 'https://threads.net/@your-profile' },
  ];

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
          <h1 className="text-3xl font-bold">Edit Social Links</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 rounded-lg p-6 shadow-lg space-y-4">
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
            Enter your social media profile URLs. Leave empty if you don't have that profile.
          </p>

          {platforms.map((platform) => (
            <div key={platform.key}>
              <label className="block text-sm font-medium mb-2">{platform.label}</label>
              <input
                type="url"
                value={(socialLinks as any)[platform.key] || ''}
                onChange={(e) =>
                  setSocialLinks({ ...socialLinks, [platform.key]: e.target.value })
                }
                placeholder={platform.placeholder}
                className="w-full px-4 py-2 border rounded-lg dark:bg-zinc-800"
              />
            </div>
          ))}

          {message && (
            <div
              className={`p-4 rounded-lg ${
                message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}
            >
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

