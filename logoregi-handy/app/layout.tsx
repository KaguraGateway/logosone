import './ipadmini.reset.css';

import type { Metadata } from 'next';

import { Providers } from './providers';

export const metadata: Metadata = {
  title: {
    template: '%s | OrderLink Handy',
    default: 'OrderLink Handy',
  },
  description: 'OrderLink Handy powered by LOGOS Systems',
  applicationName: 'Handy',
  appleWebApp: {
    title: 'Handy',
    statusBarStyle: 'black-translucent',
  },
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
