'use client';

import { useEffect, useState } from 'react';
import { SocialPost } from '@/lib/types';

export function useSocialPosts() {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const [twitterRes, linkedinRes] = await Promise.allSettled([
          fetch('/api/twitter'),
          fetch('/api/linkedin'),
        ]);

        const allPosts: SocialPost[] = [];

        if (twitterRes.status === 'fulfilled' && twitterRes.value.ok) {
          const twitterData = await twitterRes.value.json();
          allPosts.push(...(twitterData.posts || []));
        }

        if (linkedinRes.status === 'fulfilled' && linkedinRes.value.ok) {
          const linkedinData = await linkedinRes.value.json();
          allPosts.push(...(linkedinData.posts || []));
        }

        // Sort by date, newest first
        allPosts.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setPosts(allPosts);
      } catch (err) {
        setError('Failed to load social posts');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  return { posts, loading, error };
}

