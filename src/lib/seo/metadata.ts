import { Metadata } from 'next';

const APP_NAME = 'Digital Card';
const APP_DESCRIPTION = 'Create stunning 3D digital invitations for weddings, birthdays, and special events';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://digitalcard.com';

export function generateMetadata({
  title,
  description,
  image,
  url,
  type = 'website',
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  noIndex?: boolean;
}): Metadata {
  const metaTitle = title ? `${title} | ${APP_NAME}` : APP_NAME;
  const metaDescription = description || APP_DESCRIPTION;
  const metaImage = image || `${APP_URL}/og-image.png`;
  const metaUrl = url ? `${APP_URL}${url}` : APP_URL;

  return {
    title: metaTitle,
    description: metaDescription,
    applicationName: APP_NAME,
    ...(noIndex && { robots: { index: false, follow: false } }),
    metadataBase: new URL(APP_URL),
    alternates: {
      canonical: metaUrl,
    },
    openGraph: {
      type,
      siteName: APP_NAME,
      title: metaTitle,
      description: metaDescription,
      url: metaUrl,
      images: [
        {
          url: metaImage,
          width: 1200,
          height: 630,
          alt: metaTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: [metaImage],
      creator: '@digitalcard',
    },
    keywords: [
      'digital invitation',
      '3D invitation',
      'wedding invitation',
      'birthday invitation',
      'event invitation',
      'online RSVP',
      'invitation maker',
      'e-invitation',
    ],
  };
}

export function generateInvitationMetadata({
  eventName,
  eventType,
  hostName,
  eventDate,
  slug,
  themeImage,
}: {
  eventName?: string;
  eventType: string;
  hostName: string;
  eventDate: Date;
  slug: string;
  themeImage?: string;
}) {
  const title = eventName || `${hostName}'s ${eventType}`;
  const description = `You're invited to ${title} on ${eventDate.toLocaleDateString()}. View this beautiful 3D invitation and RSVP online.`;

  return generateMetadata({
    title,
    description,
    image: themeImage || `${APP_URL}/api/og?slug=${slug}`,
    url: `/invite/${slug}`,
    type: 'article',
  });
}

export const defaultMetadata: Metadata = generateMetadata({});
