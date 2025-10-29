import { NextResponse } from 'next/server';
import { fetchTwitterPosts } from '@/lib/api/twitter';
import { getTwitterCredentials } from '@/lib/utils/api-credentials';

export const revalidate = 3600; // Revalidate every hour

export async function GET() {
  const { username, bearerToken } = getTwitterCredentials();

  if (!username || !bearerToken) {
    return NextResponse.json(
      { error: 'Twitter credentials not configured. Please configure them in the admin panel.' },
      { status: 500 }
    );
  }

  try {
    const posts = await fetchTwitterPosts(username, bearerToken);
    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error fetching Twitter posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Twitter posts' },
      { status: 500 }
    );
  }
}

