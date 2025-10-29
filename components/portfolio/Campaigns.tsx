'use client';

import { Campaign } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { formatDate } from '@/lib/utils/date';
import Link from 'next/link';

interface CampaignsProps {
  campaigns: Campaign[];
}

export function Campaigns({ campaigns }: CampaignsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {campaigns.map((campaign, index) => (
        <Card key={campaign.id} delay={index * 0.1}>
          <h3 className="text-xl font-bold mb-2 text-zinc-900 dark:text-zinc-50">
            {campaign.title}
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 mb-4 line-clamp-3">
            {campaign.description}
          </p>
          <div className="mb-4">
            <p className="text-sm font-semibold mb-2 text-zinc-900 dark:text-zinc-50">
              Results:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
              {campaign.results.map((result, i) => (
                <li key={i}>{result}</li>
              ))}
            </ul>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-500 mb-3">
            {formatDate(campaign.date)}
          </p>
          <Link
            href={`/portfolio/${campaign.id}`}
            className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 hover:underline text-sm font-medium inline-block"
          >
            View Details →
          </Link>
        </Card>
      ))}
    </div>
  );
}

