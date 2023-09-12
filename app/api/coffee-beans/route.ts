import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';

import { CoffeeBeanResponse } from '@/types/CoffeeBean';

export async function GET() {
  const res: CoffeeBeanResponse = {
    coffeeBeans: [
      {
        id: randomUUID(),
        name: 'あ',
        quantity: 100,
      },
      {
        id: randomUUID(),
        name: 'い',
        quantity: 100,
      },
      {
        id: randomUUID(),
        name: 'う',
        quantity: 100,
      },
      {
        id: randomUUID(),
        name: 'え',
        quantity: 100,
      },
    ],
  };
  return NextResponse.json(res);
}

export async function POST() {
  return new NextResponse(null, { status: 204 });
}
