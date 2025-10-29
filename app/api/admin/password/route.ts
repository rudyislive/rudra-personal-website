import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

const ADMIN_EMAIL = 'rudra.balam@gmail.com';
const codesPath = path.join(process.cwd(), 'content', 'reset-codes.json');

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || ADMIN_EMAIL,
    pass: process.env.EMAIL_PASSWORD || '', // Gmail App Password
  },
});

function getStoredCodes() {
  try {
    if (fs.existsSync(codesPath)) {
      const content = fs.readFileSync(codesPath, 'utf-8');
      return JSON.parse(content);
    }
  } catch {
    // Ignore errors
  }
  return {};
}

function saveCode(email: string, code: string) {
  const codes = getStoredCodes();
  codes[email] = {
    code,
    expiresAt: Date.now() + 15 * 60 * 1000, // 15 minutes
  };
  
  const dir = path.dirname(codesPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(codesPath, JSON.stringify(codes, null, 2));
}

function verifyCode(email: string, code: string): boolean {
  const codes = getStoredCodes();
  const stored = codes[email];
  
  if (!stored) return false;
  if (stored.expiresAt < Date.now()) {
    delete codes[email];
    fs.writeFileSync(codesPath, JSON.stringify(codes, null, 2));
    return false;
  }
  
  return stored.code === code;
}

function deleteCode(email: string) {
  const codes = getStoredCodes();
  delete codes[email];
  fs.writeFileSync(codesPath, JSON.stringify(codes, null, 2));
}

export async function POST(request: Request) {
  try {
    const { action, email, newPassword, verificationCode } = await request.json();

    if (action === 'request_password_reset') {
      // Only allow reset for admin email
      if (email !== ADMIN_EMAIL) {
        return NextResponse.json(
          { error: 'Password reset only available for admin email' },
          { status: 403 }
        );
      }

      // Generate verification code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      saveCode(email, code);

      try {
        // Send verification email
        await transporter.sendMail({
          from: ADMIN_EMAIL,
          to: ADMIN_EMAIL,
          subject: 'Admin Panel Password Reset Verification',
          html: `
            <h2>Password Reset Request</h2>
            <p>Your verification code is: <strong>${code}</strong></p>
            <p>This code will expire in 15 minutes.</p>
            <p>Use this code to reset your admin panel password.</p>
            <p>If you didn't request this, please ignore this email.</p>
          `,
        });

        return NextResponse.json({
          success: true,
          message: 'Verification code sent to your email',
        });
      } catch (emailError) {
        console.error('Email error:', emailError);
        // Still return success with code in dev mode if EMAIL_PASSWORD not set
        if (process.env.NODE_ENV === 'development') {
          return NextResponse.json({
            success: true,
            message: 'Email not configured. Verification code: ' + code,
            code: code,
          });
        }
        return NextResponse.json(
          { error: 'Failed to send email. Make sure EMAIL_PASSWORD is set in .env.local' },
          { status: 500 }
        );
      }
    }

    if (action === 'reset_password') {
      // Verify email matches admin email
      if (email !== ADMIN_EMAIL) {
        return NextResponse.json(
          { error: 'Invalid email' },
          { status: 403 }
        );
      }

      // Verify code
      if (!verifyCode(email, verificationCode)) {
        return NextResponse.json(
          { error: 'Invalid or expired verification code' },
          { status: 400 }
        );
      }

      if (!newPassword || newPassword.length < 6) {
        return NextResponse.json(
          { error: 'Password must be at least 6 characters' },
          { status: 400 }
        );
      }

      // Delete used code
      deleteCode(email);

      // Return instruction to update .env.local
      return NextResponse.json({
        success: true,
        message: 'Password reset successful! Please update ADMIN_PASSWORD in .env.local',
        newPassword: newPassword, // Include in response for convenience
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

