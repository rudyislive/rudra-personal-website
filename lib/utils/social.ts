import { readFileSync } from 'fs';
import { join } from 'path';
import { SocialLinks } from '@/lib/types/social';

export function getSocialLinks(): SocialLinks {
  const filePath = join(process.cwd(), 'content', 'social-links.json');
  const fileContents = readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

