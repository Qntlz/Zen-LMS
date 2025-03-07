// app/api/assignments/route.ts
import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const courseId = searchParams.get('courseId');

  // Read credentials from cookies
  const { cookies } = request;
  const canvasUrl = cookies.get('canvasUrl')?.value;
  const apiToken = cookies.get('apiToken')?.value;

  if (!canvasUrl || !apiToken || !courseId) {
    return NextResponse.json(
      { error: 'Missing parameters' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `https://${canvasUrl}/api/v1/courses/${courseId}/assignments`,
      {
        headers: { Authorization: `Bearer ${apiToken}` },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch assignments' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Connection failed' },
      { status: 500 }
    );
  }
}