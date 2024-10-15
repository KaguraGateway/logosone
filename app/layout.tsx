import './ipadmini.reset.css';

import type { Metadata } from 'next';

import { Providers } from './providers';

export const metadata: Metadata = {
  title: {
    template: '%s | LogoREGI Handy',
    default: 'LogoREGI Handy',
  },
  description: 'LogoREGI Handy powered by LOGOS Systems',
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
