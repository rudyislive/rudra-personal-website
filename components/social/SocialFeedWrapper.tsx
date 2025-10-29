'use client';

import { SocialFeed } from '@/components/social/SocialFeed';
import { useSocialPosts } from '@/lib/hooks/useSocialPosts';

export function SocialFeedWrapper() {
  const { posts, loading } = useSocialPosts();

  if (loading) {
    return (
      <div className="text-center text-zinc-600 dark:text-zinc-400">
        Loading posts...
      </div>
    );
  }

  return <SocialFeed posts={posts} />;
}

