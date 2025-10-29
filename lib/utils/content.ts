import { readFileSync } from 'fs';
import { join } from 'path';
import { Resume, Campaign } from '@/lib/types';

export function getResume(): Resume {
  const filePath = join(process.cwd(), 'content', 'resume.json');
  const fileContents = readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

export function getCampaigns(): Campaign[] {
  const filePath = join(process.cwd(), 'content', 'campaigns.json');
  const fileContents = readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

