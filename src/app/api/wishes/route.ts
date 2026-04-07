import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Seed wishes always returned
const SEED_WISHES = [
  { id: 's1', name: 'Pankaj Jaiman', message: 'Beta bahut bahut badhaai ho! Hamesha khush raho 💐', emoji: '💐', createdAt: '2026-04-08T09:00:00Z' },
  { id: 's2', name: 'Sanjay Pandey', message: 'Dono ka jeevan mangalmay ho, yahi hamaari dua hai 🙏', emoji: '🙏', createdAt: '2026-04-08T09:05:00Z' },
  { id: 's3', name: 'Suman Jaiman', message: 'Mridul aur Vijaya ko pyar bhare aashirvaad ❤️', emoji: '❤️', createdAt: '2026-04-08T09:10:00Z' },
  { id: 's4', name: 'Shushma Pandey', message: 'Yeh milan hamare parivaar ka sabse sundar pal hai 🌸', emoji: '🌸', createdAt: '2026-04-08T09:15:00Z' },
  { id: 's5', name: 'Ek Shubhchintak', message: 'Congratulations! May your love story be eternal ✨', emoji: '✨', createdAt: '2026-04-08T10:00:00Z' },
];

async function getPrisma() {
  try {
    const { prisma } = await import('@/lib/db');
    return prisma;
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const prisma = await getPrisma();
    if (!prisma) return NextResponse.json(SEED_WISHES);

    const wishes = await prisma.wish.findMany({ orderBy: { createdAt: 'asc' } });
    const userWishes = wishes.map((w) => ({
      id: w.id,
      name: w.name,
      message: w.message,
      emoji: w.emoji,
      createdAt: w.createdAt.toISOString(),
    }));

    const userIds = new Set(userWishes.map((w) => w.id));
    return NextResponse.json([
      ...SEED_WISHES.filter((s) => !userIds.has(s.id)),
      ...userWishes,
    ]);
  } catch {
    return NextResponse.json(SEED_WISHES);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = String(body.name ?? '').trim().slice(0, 50);
    const message = String(body.message ?? '').trim().slice(0, 300);
    const emoji = String(body.emoji ?? '❤️').trim();

    if (!name || !message) {
      return NextResponse.json({ error: 'Name and message required' }, { status: 400 });
    }

    const prisma = await getPrisma();
    if (!prisma) {
      // Fallback: return a fake saved wish (Vercel with no DB)
      return NextResponse.json({ id: `f_${Date.now()}`, name, message, emoji, createdAt: new Date().toISOString() });
    }

    const wish = await prisma.wish.create({ data: { name, message, emoji } });
    return NextResponse.json({
      id: wish.id,
      name: wish.name,
      message: wish.message,
      emoji: wish.emoji,
      createdAt: wish.createdAt.toISOString(),
    });
  } catch {
    return NextResponse.json({ error: 'Failed to save wish' }, { status: 500 });
  }
}
