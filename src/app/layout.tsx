import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Cinzel, Great_Vibes } from 'next/font/google';
import { SessionProvider } from '@/components/auth/session-provider';
import ServiceWorkerRegister from '@/components/invitation/ServiceWorkerRegister';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
});

const greatVibes = Great_Vibes({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-script',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Mridul & Vijaya — Wedding Invitation',
  description: 'You are cordially invited to celebrate the wedding of Mridul & Vijaya',
  // manifest.ts handles the manifest link automatically — do NOT set manifest here
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'M & V Wedding',
  },
  openGraph: {
    title: 'Mridul & Vijaya Wedding Invitation 💍',
    description: 'You are cordially invited to our wedding celebration.',
    type: 'website',
    url: 'https://mridulvijaya.vercel.app',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#D4AF37',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" translate="no">
      <head>
        <meta name="google" content="notranslate" />
      </head>
      <body
        className={`${playfair.variable} ${cinzel.variable} ${greatVibes.variable} antialiased`}
        style={{ fontFamily: 'var(--font-playfair), serif' }}
      >
        <ServiceWorkerRegister />
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
