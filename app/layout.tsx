import type { Metadata } from 'next';

import { Providers } from './providers';

export const metadata: Metadata = {
  title: {
    template: '%s | OrderLink',
    default: 'OrderLink',
  },
  description: 'OrderLink powered by LOGOS Systems',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
