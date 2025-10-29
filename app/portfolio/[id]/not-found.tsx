import Link from 'next/link';
import { Navigation } from '@/components/ui/Navigation';

export default function NotFound() {
  return (
    <>
      <Navigation />
      <main className="pt-16 min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-6xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-zinc-700 dark:text-zinc-300 mb-4">
            Portfolio Project Not Found
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-8">
            The portfolio project you're looking for doesn't exist or has been removed.
          </p>
          <Link
            href="/#portfolio"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg transition-colors font-medium"
          >
            ← Back to Portfolio
          </Link>
        </div>
      </main>
    </>
  );
}

