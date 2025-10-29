'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Campaign } from '@/lib/types';
import { FiSave, FiArrowLeft, FiPlus, FiTrash2 } from 'react-icons/fi';
import { formatDate } from '@/lib/utils/date';

export default function EditCampaigns() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
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
        // Load campaigns data
        return fetch('/api/content/campaigns', {
          credentials: 'include',
        });
      })
      .then((res) => res?.json())
      .then((data) => {
        if (data && !data.error) {
          setCampaigns(data);
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

    const response = await fetch('/api/content/campaigns', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(campaigns),
    });

    if (response.ok) {
      setMessage('Campaigns updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage('Failed to update campaigns');
    }
    setSaving(false);
  };

  const addCampaign = () => {
    setCampaigns([
      ...campaigns,
      {
        id: `campaign-${Date.now()}`,
        title: '',
        description: '',
        results: [],
        date: new Date().toISOString().split('T')[0],
        link: '',
      },
    ]);
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
          <h1 className="text-3xl font-bold">Edit Campaigns</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {campaigns.map((campaign, idx) => (
            <div key={campaign.id} className="bg-white dark:bg-zinc-900 rounded-lg p-6 shadow-lg space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Campaign #{idx + 1}</h3>
                <button
                  type="button"
                  onClick={() => setCampaigns(campaigns.filter((_, i) => i !== idx))}
                  className="text-red-600 hover:text-red-700"
                >
                  <FiTrash2 />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={campaign.title}
                  onChange={(e) => {
                    const newCampaigns = [...campaigns];
                    newCampaigns[idx] = { ...campaign, title: e.target.value };
                    setCampaigns(newCampaigns);
                  }}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-zinc-800"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={campaign.description}
                  onChange={(e) => {
                    const newCampaigns = [...campaigns];
                    newCampaigns[idx] = { ...campaign, description: e.target.value };
                    setCampaigns(newCampaigns);
                  }}
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-zinc-800"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Results (one per line)</label>
                <textarea
                  value={campaign.results.join('\n')}
                  onChange={(e) => {
                    const newCampaigns = [...campaigns];
                    newCampaigns[idx] = {
                      ...campaign,
                      results: e.target.value.split('\n').filter((r) => r.trim()),
                    };
                    setCampaigns(newCampaigns);
                  }}
                  rows={4}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-zinc-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Date</label>
                  <input
                    type="date"
                    value={campaign.date}
                    onChange={(e) => {
                      const newCampaigns = [...campaigns];
                      newCampaigns[idx] = { ...campaign, date: e.target.value };
                      setCampaigns(newCampaigns);
                    }}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-zinc-800"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Link (optional)</label>
                  <input
                    type="url"
                    value={campaign.link || ''}
                    onChange={(e) => {
                      const newCampaigns = [...campaigns];
                      newCampaigns[idx] = { ...campaign, link: e.target.value };
                      setCampaigns(newCampaigns);
                    }}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-zinc-800"
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addCampaign}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-purple-300 dark:border-purple-700 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-950/30 text-purple-600 dark:text-purple-400"
          >
            <FiPlus /> Add New Campaign
          </button>

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

