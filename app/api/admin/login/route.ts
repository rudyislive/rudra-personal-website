import { NextResponse } from 'next/server';
import crypto from 'crypto';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'; // Default mock password
const ADMIN_EMAIL = 'rudra.balam@gmail.com';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    // For now, accept the mock password or the one from env
    if (!password || (password !== ADMIN_PASSWORD && password !== 'admin123')) {
      return NextResponse.json(
        { success: false, error: 'Invalid password' },
        { status: 401 }
      );
    }

    const token = crypto.randomBytes(32).toString('hex');
    const response = NextResponse.json({ success: true, token, email: ADMIN_EMAIL });
    
    // Set cookie with token
    response.cookies.set('adminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    );
  }
}


