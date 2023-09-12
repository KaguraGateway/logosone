import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    categories: [
      {
        id: 'a',
        name: 'コーヒ',
      },
      {
        id: 'b',
        name: 'ソフトドリンク',
      },
      {
        id: 'c',
        name: 'その他',
      },
    ],
  });
}

export async function POST() {
  //const reqBody = await request.json();

  return new NextResponse(null, { status: 204 });
}
