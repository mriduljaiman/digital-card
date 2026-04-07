import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Hostinger backend — stores all wishes in SQLite
const BACKEND = 'http://89.116.34.21/api/wishes';

const SEED_WISHES = [
  { id: 's1', name: 'Pankaj Jaiman', message: 'Beta bahut bahut badhaai ho! Hamesha khush raho 💐', emoji: '💐', createdAt: '2026-04-08T09:00:00Z' },
  { id: 's2', name: 'Sanjay Pandey', message: 'Dono ka jeevan mangalmay ho, yahi hamaari dua hai 🙏', emoji: '🙏', createdAt: '2026-04-08T09:05:00Z' },
  { id: 's3', name: 'Suman Jaiman', message: 'Mridul aur Vijaya ko pyar bhare aashirvaad ❤️', emoji: '❤️', createdAt: '2026-04-08T09:10:00Z' },
  { id: 's4', name: 'Shushma Pandey', message: 'Yeh milan hamare parivaar ka sabse sundar pal hai 🌸', emoji: '🌸', createdAt: '2026-04-08T09:15:00Z' },
  { id: 's5', name: 'Ek Shubhchintak', message: 'Congratulations! May your love story be eternal ✨', emoji: '✨', createdAt: '2026-04-08T10:00:00Z' },
];

export async function GET() {
  try {
    const res = await fetch(BACKEND, { next: { revalidate: 0 } });
    if (res.ok) return NextResponse.json(await res.json());
  } catch {}
  return NextResponse.json(SEED_WISHES);
}

export async function POST(req: NextRequest) {
  let name = '', message = '', emoji = '❤️';
  try {
    const body = await req.json();
    name = String(body.name ?? '').trim().slice(0, 50);
    message = String(body.message ?? '').trim().slice(0, 300);
    emoji = String(body.emoji ?? '❤️').trim();

    if (!name || !message) {
      return NextResponse.json({ error: 'Name and message required' }, { status: 400 });
    }

    const res = await fetch(BACKEND, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, message, emoji }),
    });
    if (res.ok) return NextResponse.json(await res.json());
  } catch {}

  return NextResponse.json({ id: `f_${Date.now()}`, name, message, emoji, createdAt: new Date().toISOString() });
}
