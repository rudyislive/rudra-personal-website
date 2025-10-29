import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';

const credentialsPath = path.join(process.cwd(), 'content', 'api-credentials.json');

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('adminToken');
  return !!token;
}

export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    if (!fs.existsSync(credentialsPath)) {
      return NextResponse.json({
        credentials: {
          twitter: { username: '', bearerToken: '' },
          linkedin: { accessToken: '', personId: '' },
        },
      });
    }

    const fileContent = fs.readFileSync(credentialsPath, 'utf-8');
    const credentials = JSON.parse(fileContent);
    
    // Return credentials but mask tokens for display
    return NextResponse.json({ 
      credentials: {
        twitter: {
          username: credentials.twitter?.username || '',
          bearerToken: credentials.twitter?.bearerToken ? '***' : '',
        },
        linkedin: {
          accessToken: credentials.linkedin?.accessToken ? '***' : '',
          personId: credentials.linkedin?.personId || '',
        },
      },
      hasCredentials: {
        twitter: !!(credentials.twitter?.username && credentials.twitter?.bearerToken),
        linkedin: !!(credentials.linkedin?.accessToken && credentials.linkedin?.personId),
      },
    });
  } catch (error) {
    // Return empty credentials if file doesn't exist or is invalid
    return NextResponse.json({
      credentials: {
        twitter: { username: '', bearerToken: '' },
        linkedin: { accessToken: '', personId: '' },
      },
      hasCredentials: {
        twitter: false,
        linkedin: false,
      },
    });
  }
}

export async function PUT(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    // Validate structure
    if (!body.twitter || !body.linkedin) {
      return NextResponse.json(
        { error: 'Invalid credentials structure' },
        { status: 400 }
      );
    }

    // Load existing credentials to preserve tokens if not updated
    let existingCredentials = {
      twitter: { username: '', bearerToken: '' },
      linkedin: { accessToken: '', personId: '' },
    };
    
    if (fs.existsSync(credentialsPath)) {
      try {
        const existingContent = fs.readFileSync(credentialsPath, 'utf-8');
        existingCredentials = JSON.parse(existingContent);
      } catch {
        // Ignore if file is invalid
      }
    }

    // Save credentials (preserve tokens if not provided)
    const credentials = {
      twitter: {
        username: body.twitter.username || existingCredentials.twitter.username || '',
        bearerToken: body.twitter.bearerToken && body.twitter.bearerToken !== '***' 
          ? body.twitter.bearerToken 
          : existingCredentials.twitter.bearerToken || '',
      },
      linkedin: {
        accessToken: body.linkedin.accessToken && body.linkedin.accessToken !== '***'
          ? body.linkedin.accessToken
          : existingCredentials.linkedin.accessToken || '',
        personId: body.linkedin.personId || existingCredentials.linkedin.personId || '',
      },
    };

    // Ensure directory exists
    const dir = path.dirname(credentialsPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(credentialsPath, JSON.stringify(credentials, null, 2));

    // Test credentials if provided
    const testResults: any = {};
    
    if (credentials.twitter.username && credentials.twitter.bearerToken) {
      try {
        const testRes = await fetch(
          `https://api.twitter.com/2/users/by/username/${credentials.twitter.username}`,
          {
            headers: {
              Authorization: `Bearer ${credentials.twitter.bearerToken}`,
            },
          }
        );
        testResults.twitter = testRes.ok ? 'valid' : 'invalid';
      } catch {
        testResults.twitter = 'error';
      }
    }

    return NextResponse.json({
      success: true,
      message: 'API credentials saved successfully',
      testResults,
    });
  } catch (error) {
    console.error('Error saving credentials:', error);
    return NextResponse.json(
      { error: 'Failed to save credentials' },
      { status: 500 }
    );
  }
}

