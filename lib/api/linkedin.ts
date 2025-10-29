interface LinkedInActivity {
  id: string;
  created: {
    time: number;
  };
  specificContent: {
    'com.linkedin.ugc.ShareContent': {
      shareCommentary: {
        text: string;
      };
      shareMediaCategory: string;
    };
  };
  'resharedActivity'?: string;
}

interface LinkedInResponse {
  elements: LinkedInActivity[];
}

export async function fetchLinkedInPosts(
  accessToken: string,
  personId: string
): Promise<any[]> {
  try {
    const response = await fetch(
      `https://api.linkedin.com/v2/ugcPosts?q=authors&authors=List(${personId})&count=10`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'X-Restli-Protocol-Version': '2.0.0',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch LinkedIn posts');
    }

    const data: LinkedInResponse = await response.json();

    return (
      data.elements?.map((post) => {
        const shareContent =
          post.specificContent?.['com.linkedin.ugc.ShareContent'];
        const text = shareContent?.shareCommentary?.text || '';

        return {
          id: post.id,
          platform: 'linkedin' as const,
          text,
          url: `https://www.linkedin.com/feed/update/${post.id}`,
          createdAt: new Date(post.created.time).toISOString(),
        };
      }) || []
    );
  } catch (error) {
    console.error('Error fetching LinkedIn posts:', error);
    return [];
  }
}

