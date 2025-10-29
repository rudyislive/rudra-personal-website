import { NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { cookies } from 'next/headers';

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
    const filePath = join(process.cwd(), 'content', 'campaigns.json');
    const fileContents = readFileSync(filePath, 'utf8');
    const campaigns = JSON.parse(fileContents);
    return NextResponse.json(campaigns);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load campaigns' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const campaigns = await request.json();
    const filePath = join(process.cwd(), 'content', 'campaigns.json');
    writeFileSync(filePath, JSON.stringify(campaigns, null, 2), 'utf8');
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update campaigns' }, { status: 500 });
  }
}

