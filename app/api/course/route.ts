import { NextResponse, NextRequest } from 'next/server';

type Course = {
  id: number;
  name: string;
  description: string;
};

export async function GET(request: NextRequest) {
  // Read credentials from cookies
  const { cookies } = request;
  const canvasUrl = cookies.get('canvasUrl')?.value;
  const apiToken = cookies.get('apiToken')?.value;

  if (!canvasUrl || !apiToken) {
    return NextResponse.json(
      { error: 'Missing parameters' },
      { status: 400 }
    );
  }

  try {
    let url = `https://${canvasUrl}/api/v1/courses?include[]=term&enrollment_type=student&enrollment_state=active&per_page=100`;
    let allCourses = [] as Course[];

    while (url) {
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${apiToken}` },
      });

      if (!response.ok) {
        return NextResponse.json(
          { error: 'Failed to fetch courses' },
          { status: response.status }
        );
      }

      const data = await response.json();
      allCourses = allCourses.concat(data);

      // Check if there's a next page
      const linkHeader = response.headers.get('Link');
      const nextLink = linkHeader?.split(',').find(link => link.includes('rel="next"'));
      url = nextLink ? nextLink.split(';')[0].slice(1, -1) : '';
    }

    return NextResponse.json(allCourses);
  } catch (error) {
    return NextResponse.json(
      { error: 'Connection failed' },
      { status: 500 }
    );
  }
}