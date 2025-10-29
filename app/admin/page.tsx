'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // Cookie is set automatically by server, but also store in localStorage as backup
          if (data.token) {
            localStorage.setItem('adminToken', data.token);
          }
          router.push('/admin/dashboard');
        } else {
          setError(data.error || 'Invalid password');
        }
      })
      .catch(() => setError('Login failed. Please try again.'));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-zinc-900 dark:to-zinc-950">
      <div className="bg-white dark:bg-zinc-800 p-8 rounded-lg shadow-xl max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
          Admin Panel
        </h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-zinc-700 dark:text-white"
              required
            />
          </div>
          {error && (
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          )}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 px-4 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors font-medium"
          >
            Login
          </button>
        </form>
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-xs text-blue-700 dark:text-blue-300 text-center">
            <strong>Default Password:</strong> admin123
          </p>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 text-center">
            Set ADMIN_PASSWORD in .env.local to change it
          </p>
        </div>
        <div className="mt-4 text-center">
          <a href="/admin/password-reset" className="text-sm text-purple-600 dark:text-purple-400 hover:underline">
            Forgot password?
          </a>
        </div>
      </div>
    </div>
  );
}

