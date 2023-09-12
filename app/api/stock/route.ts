import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';

import { StockResponse } from '@/types/Stock';

export async function GET() {
  const res: StockResponse = {
    stocks: [
      {
        id: randomUUID(),
        name: 'レモネード',
        quantity: 100,
      },
      {
        id: randomUUID(),
        name: 'カルピス',
        quantity: 100,
      },
      {
        id: randomUUID(),
        name: 'パンケーキ',
        quantity: 100,
      },
      {
        id: randomUUID(),
        name: 'パン',
        quantity: 100,
      },
    ],
  };
  return NextResponse.json(res);
}

export async function POST() {
  return new NextResponse(null, { status: 204 });
}
