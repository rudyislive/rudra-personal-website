'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { SocialPost } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { FaTwitter, FaLinkedin } from 'react-icons/fa';

interface SocialFeedProps {
  posts: SocialPost[];
}

export function SocialFeed({ posts }: SocialFeedProps) {
  const [filter, setFilter] = useState<'all' | 'twitter' | 'linkedin'>('all');

  const filteredPosts = posts.filter(
    (post) => filter === 'all' || post.platform === filter
  );

  return (
    <div>
      <div className="flex gap-4 mb-6 justify-center">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === 'all'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
              : 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('twitter')}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
            filter === 'twitter'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
              : 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300'
          }`}
        >
          <FaTwitter /> Twitter
        </button>
        <button
          onClick={() => setFilter('linkedin')}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
            filter === 'linkedin'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
              : 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300'
          }`}
        >
          <FaLinkedin /> LinkedIn
        </button>
      </div>

      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <Card>
            <p className="text-zinc-600 dark:text-zinc-400 text-center">
              No posts found. Make sure your API credentials are configured correctly.
            </p>
          </Card>
        ) : (
          filteredPosts.map((post, index) => (
            <Card key={post.id} delay={index * 0.05}>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {post.platform === 'twitter' ? (
                    <FaTwitter className="text-purple-500 text-2xl" />
                  ) : (
                    <FaLinkedin className="text-purple-600 text-2xl" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-zinc-700 dark:text-zinc-300 mb-2 whitespace-pre-wrap">
                    {post.text}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-500">
                    <span>
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                    {post.likes !== undefined && (
                      <span>❤️ {post.likes}</span>
                    )}
                    {post.retweets !== undefined && (
                      <span>🔄 {post.retweets}</span>
                    )}
                    {post.comments !== undefined && (
                      <span>💬 {post.comments}</span>
                    )}
                  </div>
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 hover:underline text-sm mt-2 inline-block"
                  >
                    View on {post.platform === 'twitter' ? 'Twitter' : 'LinkedIn'} →
                  </a>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

