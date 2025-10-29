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
    const filePath = join(process.cwd(), 'content', 'social-links.json');
    const fileContents = readFileSync(filePath, 'utf8');
    const socialLinks = JSON.parse(fileContents);
    return NextResponse.json(socialLinks);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load social links' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const socialLinks = await request.json();
    const filePath = join(process.cwd(), 'content', 'social-links.json');
    writeFileSync(filePath, JSON.stringify(socialLinks, null, 2), 'utf8');
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update social links' }, { status: 500 });
  }
}

