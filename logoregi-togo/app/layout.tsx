import './ipadmini.reset.css';

import type { Metadata } from 'next';

import { Providers } from './providers';

export const metadata: Metadata = {
  title: {
    template: '%s | LogoREGI ToGo',
    default: 'LogoREGI ToGo',
  },
  description: 'LogoREGI Togo powered by LOGOS Systems',
  applicationName: 'ToGo',
  appleWebApp: {
    title: 'ToGo',
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
