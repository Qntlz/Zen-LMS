// app/api/auth/route.ts
import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { cookies } = request;
  const canvasUrl = cookies.get('canvasUrl')?.value;
  const apiToken = cookies.get('apiToken')?.value;

  if (!canvasUrl || !apiToken) {
    return NextResponse.json(
      { error: 'Credentials not found' },
      { status: 401 }
    );
  }

  return NextResponse.json({ canvasUrl, apiToken });
}
