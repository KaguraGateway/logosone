import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'OrderLink',
    short_name: 'OrderLink',
    icons: [
      {
        src: '/icon-128x128.png',
        sizes: '128x128',
        type: 'image/png',
      },
      {
        src: '/icon-256x256.png',
        sizes: '256x256',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    theme_color: '#EDF2F7',
    background_color: '#EDF2F7',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
  };
}
