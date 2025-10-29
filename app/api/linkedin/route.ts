import { NextResponse } from 'next/server';
import { fetchLinkedInPosts } from '@/lib/api/linkedin';
import { getLinkedInCredentials } from '@/lib/utils/api-credentials';

export const revalidate = 3600; // Revalidate every hour

export async function GET() {
  const { accessToken, personId } = getLinkedInCredentials();

  if (!accessToken || !personId) {
    return NextResponse.json(
      { error: 'LinkedIn credentials not configured. Please configure them in the admin panel.' },
      { status: 500 }
    );
  }

  try {
    const posts = await fetchLinkedInPosts(accessToken, personId);
    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error fetching LinkedIn posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch LinkedIn posts' },
      { status: 500 }
    );
  }
}

