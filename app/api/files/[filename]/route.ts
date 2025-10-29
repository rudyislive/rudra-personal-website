import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { unlink } from 'fs/promises';
import { join } from 'path';

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('adminToken');
  return !!token;
}

export async function DELETE(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get('filename');

    if (!fileName) {
      return NextResponse.json({ error: 'Filename required' }, { status: 400 });
    }

    const filePath = join(process.cwd(), 'public', 'uploads', fileName);
    await unlink(filePath);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 });
  }
}

