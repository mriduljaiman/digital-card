import { PrismaClient, EventType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create Wedding Themes
  const royalMandap = await prisma.theme.upsert({
    where: { slug: 'royal-mandap' },
    update: {},
    create: {
      name: 'Royal Mandap',
      slug: 'royal-mandap',
      description: 'Traditional Indian wedding with majestic golden mandap and royal aesthetics',
      category: EventType.WEDDING,
      sceneComponent: 'RoyalMandapScene',
      modelPath: '/models/wedding/mandap-royal.glb',
      texturePaths: JSON.stringify(['/textures/gold-gradient.jpg', '/textures/red-silk.jpg']),
      primaryColor: '#FFD700',
      secondaryColor: '#8B0000',
      accentColor: '#FFFFFF',
      particleConfig: JSON.stringify({
        type: 'rose-petals',
        count: 200,
        speed: 0.5,
        colors: ['#FF6B9D', '#FFD700'],
      }),
      defaultMusicUrl: '/audio/wedding-instrumental.mp3',
      thumbnail: '/themes/royal-mandap-preview.jpg',
      isPremium: false,
      sortOrder: 1,
    },
  });

  const modernWedding = await prisma.theme.upsert({
    where: { slug: 'modern-wedding' },
    update: {},
    create: {
      name: 'Modern Minimalist',
      slug: 'modern-wedding',
      description: 'Clean, contemporary wedding design with elegant simplicity',
      category: EventType.WEDDING,
      sceneComponent: 'ModernWeddingScene',
      modelPath: '/models/wedding/mandap-modern.glb',
      texturePaths: JSON.stringify(['/textures/marble-white.jpg']),
      primaryColor: '#FFFFFF',
      secondaryColor: '#2C3E50',
      accentColor: '#BDC3C7',
      particleConfig: JSON.stringify({
        type: 'sparkles',
        count: 100,
        speed: 0.3,
        colors: ['#FFFFFF', '#ECF0F1'],
      }),
      defaultMusicUrl: '/audio/modern-wedding.mp3',
      thumbnail: '/themes/modern-wedding-preview.jpg',
      isPremium: false,
      sortOrder: 2,
    },
  });

  const templeWedding = await prisma.theme.upsert({
    where: { slug: 'temple-3d' },
    update: {},
    create: {
      name: '3D Temple',
      slug: 'temple-3d',
      description: 'Sacred temple setting with traditional Indian architecture',
      category: EventType.WEDDING,
      sceneComponent: 'Temple3DScene',
      modelPath: '/models/wedding/temple-3d.glb',
      texturePaths: JSON.stringify(['/textures/stone-temple.jpg', '/textures/gold-ornaments.jpg']),
      primaryColor: '#FF6347',
      secondaryColor: '#8B4513',
      accentColor: '#FFD700',
      particleConfig: JSON.stringify({
        type: 'rose-petals',
        count: 150,
        speed: 0.4,
        colors: ['#FF6347', '#FFD700'],
      }),
      defaultMusicUrl: '/audio/temple-bells.mp3',
      thumbnail: '/themes/temple-3d-preview.jpg',
      isPremium: true,
      sortOrder: 3,
    },
  });

  // Create Birthday Themes
  const birthdayCake = await prisma.theme.upsert({
    where: { slug: 'birthday-celebration' },
    update: {},
    create: {
      name: 'Birthday Celebration',
      slug: 'birthday-celebration',
      description: 'Colorful birthday theme with cake and balloons',
      category: EventType.BIRTHDAY,
      sceneComponent: 'CakeCelebrationScene',
      modelPath: '/models/birthday/cake-minimal.glb',
      texturePaths: JSON.stringify(['/textures/confetti.jpg']),
      primaryColor: '#FF69B4',
      secondaryColor: '#FFD700',
      accentColor: '#87CEEB',
      particleConfig: JSON.stringify({
        type: 'confetti',
        count: 300,
        speed: 0.8,
        colors: ['#FF69B4', '#FFD700', '#87CEEB', '#98FB98'],
      }),
      defaultMusicUrl: '/audio/birthday-theme.mp3',
      thumbnail: '/themes/birthday-celebration-preview.jpg',
      isPremium: false,
      sortOrder: 1,
    },
  });

  const balloonParty = await prisma.theme.upsert({
    where: { slug: 'balloon-party' },
    update: {},
    create: {
      name: 'Balloon Party',
      slug: 'balloon-party',
      description: 'Fun balloon-themed birthday celebration',
      category: EventType.BIRTHDAY,
      sceneComponent: 'BalloonPartyScene',
      modelPath: '/models/birthday/balloons.glb',
      texturePaths: JSON.stringify(['/textures/party-bg.jpg']),
      primaryColor: '#FF1493',
      secondaryColor: '#00CED1',
      accentColor: '#FFD700',
      particleConfig: JSON.stringify({
        type: 'bubbles',
        count: 150,
        speed: 0.5,
        colors: ['#FF1493', '#00CED1', '#FFD700'],
      }),
      defaultMusicUrl: '/audio/party-music.mp3',
      thumbnail: '/themes/balloon-party-preview.jpg',
      isPremium: false,
      sortOrder: 2,
    },
  });

  // Create Engagement Theme
  const ringCeremony = await prisma.theme.upsert({
    where: { slug: 'ring-ceremony' },
    update: {},
    create: {
      name: 'Ring Ceremony',
      slug: 'ring-ceremony',
      description: 'Elegant engagement theme with rings and romantic ambiance',
      category: EventType.ENGAGEMENT,
      sceneComponent: 'RingCeremonyScene',
      modelPath: '/models/engagement/ring-scene.glb',
      texturePaths: JSON.stringify(['/textures/silk-fabric.jpg', '/textures/diamonds.jpg']),
      primaryColor: '#FFD700',
      secondaryColor: '#C0C0C0',
      accentColor: '#FF69B4',
      particleConfig: JSON.stringify({
        type: 'sparkles',
        count: 180,
        speed: 0.3,
        colors: ['#FFD700', '#C0C0C0', '#FFFFFF'],
      }),
      defaultMusicUrl: '/audio/romantic-instrumental.mp3',
      thumbnail: '/themes/ring-ceremony-preview.jpg',
      isPremium: false,
      sortOrder: 1,
    },
  });

  // Create Anniversary Theme
  const romanticAnniversary = await prisma.theme.upsert({
    where: { slug: 'romantic-anniversary' },
    update: {},
    create: {
      name: 'Romantic Anniversary',
      slug: 'romantic-anniversary',
      description: 'Romantic theme celebrating love and togetherness',
      category: EventType.ANNIVERSARY,
      sceneComponent: 'RomanticScene',
      modelPath: '/models/anniversary/romantic-scene.glb',
      texturePaths: JSON.stringify(['/textures/rose-petals.jpg', '/textures/candlelight.jpg']),
      primaryColor: '#FF1493',
      secondaryColor: '#8B008B',
      accentColor: '#FFD700',
      particleConfig: JSON.stringify({
        type: 'hearts',
        count: 100,
        speed: 0.4,
        colors: ['#FF1493', '#FFD700'],
      }),
      defaultMusicUrl: '/audio/anniversary-music.mp3',
      thumbnail: '/themes/romantic-anniversary-preview.jpg',
      isPremium: false,
      sortOrder: 1,
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log(`Created themes:`);
  console.log(`- Wedding: ${royalMandap.name}, ${modernWedding.name}, ${templeWedding.name}`);
  console.log(`- Birthday: ${birthdayCake.name}, ${balloonParty.name}`);
  console.log(`- Engagement: ${ringCeremony.name}`);
  console.log(`- Anniversary: ${romanticAnniversary.name}`);
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
