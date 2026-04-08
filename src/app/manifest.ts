import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Mridul & Vijaya Wedding',
    short_name: 'Wed Invite',
    description: 'You are cordially invited to the wedding of Mridul & Vijaya',
    start_url: '/',
    display: 'standalone',
    background_color: '#FFF8E7',
    theme_color: '#D4AF37',
    orientation: 'portrait-primary',
    categories: ['lifestyle'],
    icons: [
      { src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
