import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { readdir, stat, unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

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
    const publicDir = join(process.cwd(), 'public', 'uploads');
    if (!existsSync(publicDir)) {
      return NextResponse.json({ files: [] });
    }
    
    const files = await readdir(publicDir).catch(() => []);
    
    const fileList = await Promise.all(
      files.map(async (file) => {
        const filePath = join(publicDir, file);
        const stats = await stat(filePath);
        return {
          name: file,
          size: stats.size,
          type: getFileType(file),
          url: `/uploads/${file}`,
        };
      })
    );

    return NextResponse.json({ files: fileList });
  } catch (error) {
    return NextResponse.json({ files: [] });
  }
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

function getFileType(filename: string): string {
  const ext = filename.toLowerCase().split('.').pop();
  if (ext === 'pdf') return 'application/pdf';
  if (ext === 'doc' || ext === 'docx') return 'application/msword';
  if (['png', 'jpg', 'jpeg'].includes(ext || '')) return `image/${ext}`;
  return 'application/octet-stream';
}

