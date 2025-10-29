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
    const filePath = join(process.cwd(), 'content', 'resume.json');
    const fileContents = readFileSync(filePath, 'utf8');
    const resume = JSON.parse(fileContents);
    return NextResponse.json(resume);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load resume' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const resume = await request.json();
    const filePath = join(process.cwd(), 'content', 'resume.json');
    writeFileSync(filePath, JSON.stringify(resume, null, 2), 'utf8');
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update resume' }, { status: 500 });
  }
}

