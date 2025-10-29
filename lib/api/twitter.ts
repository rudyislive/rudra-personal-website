interface TwitterResponse {
  data?: {
    id: string;
    text: string;
    created_at: string;
    public_metrics?: {
      like_count: number;
      retweet_count: number;
      reply_count: number;
    };
  }[];
  meta?: {
    result_count: number;
  };
}

export async function fetchTwitterPosts(
  username: string,
  bearerToken: string
): Promise<any[]> {
  try {
    // First, get user ID from username
    const userResponse = await fetch(
      `https://api.twitter.com/2/users/by/username/${username}`,
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      }
    );

    if (!userResponse.ok) {
      throw new Error('Failed to fetch user');
    }

    const userData = await userResponse.json();
    const userId = userData.data?.id;

    if (!userId) {
      throw new Error('User not found');
    }

    // Fetch user's tweets
    const tweetsResponse = await fetch(
      `https://api.twitter.com/2/users/${userId}/tweets?max_results=10&tweet.fields=created_at,public_metrics&exclude=retweets,replies`,
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      }
    );

    if (!tweetsResponse.ok) {
      throw new Error('Failed to fetch tweets');
    }

    const tweetsData: TwitterResponse = await tweetsResponse.json();

    return (
      tweetsData.data?.map((tweet) => ({
        id: tweet.id,
        platform: 'twitter' as const,
        text: tweet.text,
        url: `https://twitter.com/${username}/status/${tweet.id}`,
        createdAt: tweet.created_at,
        likes: tweet.public_metrics?.like_count || 0,
        retweets: tweet.public_metrics?.retweet_count || 0,
        comments: tweet.public_metrics?.reply_count || 0,
      })) || []
    );
  } catch (error) {
    console.error('Error fetching Twitter posts:', error);
    return [];
  }
}

