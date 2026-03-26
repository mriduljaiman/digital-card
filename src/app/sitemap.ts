import { MetadataRoute } from 'next';
import { prisma } from '@/lib/db';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://digitalcard.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/features`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/templates`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
  ];

  // Get published invitations (only include public ones)
  const invitations = await prisma.invitation.findMany({
    where: {
      isPublished: true,
      isActive: true,
    },
    select: {
      slug: true,
      updatedAt: true,
    },
    take: 1000, // Limit for performance
  });

  const invitationPages = invitations.map((inv) => ({
    url: `${BASE_URL}/invite/${inv.slug}`,
    lastModified: inv.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Get active themes
  const themes = await prisma.theme.findMany({
    where: { isActive: true },
    select: {
      slug: true,
      updatedAt: true,
    },
  });

  const themePages = themes.map((theme) => ({
    url: `${BASE_URL}/templates/${theme.slug}`,
    lastModified: theme.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...invitationPages, ...themePages];
}
