import './globals.css';

import type { Metadata } from 'next';
import { Noto_Sans_JP } from 'next/font/google';

import Providers from './providers';

const notoJp = Noto_Sans_JP({
  subsets: ['latin', 'latin-ext'],
});

export const metadata: Metadata = {
  title: {
    template: '%s | LogoREGI Admin',
    default: 'LogoREGI Admin',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={notoJp.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
