import fs from 'fs';
import path from 'path';

const credentialsPath = path.join(process.cwd(), 'content', 'api-credentials.json');

export interface ApiCredentials {
  twitter: {
    username: string;
    bearerToken: string;
  };
  linkedin: {
    accessToken: string;
    personId: string;
  };
}

export function getApiCredentials(): ApiCredentials {
  try {
    const fileContent = fs.readFileSync(credentialsPath, 'utf-8');
    return JSON.parse(fileContent);
  } catch {
    // Return empty credentials if file doesn't exist
    return {
      twitter: { username: '', bearerToken: '' },
      linkedin: { accessToken: '', personId: '' },
    };
  }
}

export function getTwitterCredentials() {
  const creds = getApiCredentials();
  // Fallback to env vars if not in file
  return {
    username: creds.twitter.username || process.env.TWITTER_USERNAME || '',
    bearerToken: creds.twitter.bearerToken || process.env.TWITTER_BEARER_TOKEN || '',
  };
}

export function getLinkedInCredentials() {
  const creds = getApiCredentials();
  // Fallback to env vars if not in file
  return {
    accessToken: creds.linkedin.accessToken || process.env.LINKEDIN_ACCESS_TOKEN || '',
    personId: creds.linkedin.personId || process.env.LINKEDIN_PERSON_ID || '',
  };
}

