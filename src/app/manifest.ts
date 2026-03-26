import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Wedding Invitation',
    short_name: 'Wed Invite',
    description: 'A premium animated digital wedding invitation',
    start_url: '/',
    display: 'standalone',
    background_color: '#FFF8E7',
    theme_color: '#D4AF37',
    orientation: 'portrait-primary',
    categories: ['lifestyle', 'social'],
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable any',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable any',
      },
    ],
  };
}
