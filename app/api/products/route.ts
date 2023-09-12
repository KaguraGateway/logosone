import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    products: [
      {
        name: 'ハレノヒブレンド',
        type: 'coffee',
        category: 'コーヒー',
        isNowSales: true,
        coffeeBrews: [
          {
            name: 'ネル',
            amount: 500,
            beanQuantityGrams: 40,
          },
          {
            name: 'サイフォン',
            amount: 500,
            beanQuantityGrams: 40,
          },
          {
            name: 'ペーパー',
            amount: 500,
            beanQuantityGrams: 40,
          },
        ],
      },
      {
        name: 'ハレノヒブレンド',
        type: 'coffee',
        category: 'コーヒー',
        isNowSales: true,
        coffeeBrews: [
          {
            name: 'ネル',
            amount: 500,
            beanQuantityGrams: 40,
          },
          {
            name: 'サイフォン',
            amount: 500,
            beanQuantityGrams: 40,
          },
          {
            name: 'ペーパー',
            amount: 500,
            beanQuantityGrams: 40,
          },
        ],
      },
      {
        name: 'ハレノヒブレンド',
        type: 'coffee',
        category: 'コーヒー',
        isNowSales: false,
        coffeeBrews: [
          {
            name: 'ネル',
            amount: 500,
            beanQuantityGrams: 40,
          },
          {
            name: 'サイフォン',
            amount: 500,
            beanQuantityGrams: 40,
          },
          {
            name: 'ペーパー',
            amount: 500,
            beanQuantityGrams: 40,
          },
        ],
      },
      {
        name: 'レモネード',
        amount: 100,
        type: 'other',
        category: 'ドリンク',
        isNowSales: true,
      },
      {
        name: 'カルピス',
        amount: 100,
        type: 'other',
        category: 'ドリンク',
        isNowSales: true,
      },
    ],
  });
}

export async function POST() {
  return new NextResponse(null, { status: 204 });
}
