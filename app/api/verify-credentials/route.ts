// app/api/verify-credentials/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { canvasUrl, apiToken } = await request.json();

  try {
    const cleanUrl = canvasUrl.replace(/^(https?:\/\/)/, "").replace(/\/+$/, "");
    const response = await fetch(`https://${cleanUrl}/api/v1/users/self`, {
      headers: { Authorization: `Bearer ${apiToken}` },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Set HTTP-only cookies for credentials
    const nextResponse = NextResponse.json({ success: true });
    nextResponse.cookies.set('canvasUrl', cleanUrl, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 1 day
    });
    nextResponse.cookies.set('apiToken', apiToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24,
    });

    return nextResponse;
  } catch (error) {
    return NextResponse.json({ error: 'Connection failed' }, { status: 500 });
  }
}