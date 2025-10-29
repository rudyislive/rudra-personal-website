'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiEdit3, FiUpload, FiFileText, FiLink, FiLogOut, FiSettings } from 'react-icons/fi';

export default function AdminDashboard() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/check', {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setAuthenticated(true);
        } else {
          router.push('/admin');
        }
      })
      .catch(() => router.push('/admin'))
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { 
      method: 'POST',
      credentials: 'include',
    });
    localStorage.removeItem('adminToken');
    router.push('/admin');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="text-zinc-600 dark:text-zinc-400">Loading...</div>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <FiLogOut /> Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AdminCard
            title="Resume Content"
            description="Edit your resume information"
            icon={FiEdit3}
            href="/admin/resume"
            color="from-purple-600 to-indigo-600"
          />
          <AdminCard
            title="Campaigns"
            description="Add and edit marketing campaigns"
            icon={FiFileText}
            href="/admin/campaigns"
            color="from-blue-600 to-cyan-600"
          />
          <AdminCard
            title="Social Links"
            description="Update social media profile links"
            icon={FiLink}
            href="/admin/social"
            color="from-pink-600 to-rose-600"
          />
          <AdminCard
            title="File Upload"
            description="Upload PDF, Word documents, and images"
            icon={FiUpload}
            href="/admin/upload"
            color="from-green-600 to-emerald-600"
          />
          <AdminCard
            title="API Credentials"
            description="Configure X (Twitter) and LinkedIn API settings"
            icon={FiSettings}
            href="/admin/api"
            color="from-orange-600 to-amber-600"
          />
        </div>

        <div className="mt-8 bg-white dark:bg-zinc-900 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Quick Tips</h2>
          <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
            <li>• Upload a file named <code className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">resume.pdf</code> to replace auto-generated PDF</li>
            <li>• All content changes are saved immediately to JSON files</li>
            <li>• Refresh the main website to see your changes</li>
            <li>• Files are stored in <code className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">public/uploads/</code> directory</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function AdminCard({
  title,
  description,
  icon: Icon,
  href,
  color,
}: {
  title: string;
  description: string;
  icon: any;
  href: string;
  color: string;
}) {
  return (
    <Link href={href}>
      <div className={`bg-gradient-to-r ${color} p-6 rounded-lg text-white hover:scale-105 transition-transform shadow-lg cursor-pointer`}>
        <Icon className="text-4xl mb-4" />
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-white/90 text-sm">{description}</p>
      </div>
    </Link>
  );
}

