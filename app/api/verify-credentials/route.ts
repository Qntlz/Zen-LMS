import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { canvasUrl, apiToken } = await request.json();

  try {
    // Attempt to verify if the credentials are correct
    const response = await fetch(`https://${canvasUrl}/api/v1/users/self`, {
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
    });

    // If credentials are invalid return error
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // If credentials are correct return success
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Connection failed' },
      { status: 500 }
    );
  }
}