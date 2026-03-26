export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  mood: 'romantic' | 'joyful' | 'elegant' | 'peaceful' | 'energetic' | 'traditional';
  duration: number; // in seconds
  path: string;
  preview?: string; // Short preview URL
  eventTypes: string[];
  isPremium?: boolean;
}

// Pre-defined music library
// Note: In production, these would be actual licensed music files
export const MUSIC_LIBRARY: MusicTrack[] = [
  // Wedding Music
  {
    id: 'wedding-romantic-1',
    title: 'Forever Yours',
    artist: 'Wedding Music Collection',
    mood: 'romantic',
    duration: 180,
    path: '/music/wedding-romantic-1.mp3',
    eventTypes: ['wedding', 'engagement', 'anniversary'],
    isPremium: false,
  },
  {
    id: 'wedding-elegant-1',
    title: 'Royal Celebration',
    artist: 'Wedding Music Collection',
    mood: 'elegant',
    duration: 210,
    path: '/music/wedding-elegant-1.mp3',
    eventTypes: ['wedding'],
    isPremium: false,
  },
  {
    id: 'wedding-traditional-1',
    title: 'Sacred Vows',
    artist: 'Traditional Wedding',
    mood: 'traditional',
    duration: 240,
    path: '/music/wedding-traditional-1.mp3',
    eventTypes: ['wedding'],
    isPremium: true,
  },

  // Birthday Music
  {
    id: 'birthday-joyful-1',
    title: 'Happy Celebration',
    artist: 'Party Music',
    mood: 'joyful',
    duration: 150,
    path: '/music/birthday-joyful-1.mp3',
    eventTypes: ['birthday', 'baby-shower'],
    isPremium: false,
  },
  {
    id: 'birthday-energetic-1',
    title: 'Party Time',
    artist: 'Celebration Beats',
    mood: 'energetic',
    duration: 160,
    path: '/music/birthday-energetic-1.mp3',
    eventTypes: ['birthday'],
    isPremium: false,
  },

  // Engagement Music
  {
    id: 'engagement-romantic-1',
    title: 'Love Story',
    artist: 'Romantic Collection',
    mood: 'romantic',
    duration: 200,
    path: '/music/engagement-romantic-1.mp3',
    eventTypes: ['engagement', 'anniversary'],
    isPremium: false,
  },
  {
    id: 'engagement-peaceful-1',
    title: 'Together Forever',
    artist: 'Romantic Collection',
    mood: 'peaceful',
    duration: 195,
    path: '/music/engagement-peaceful-1.mp3',
    eventTypes: ['engagement', 'wedding'],
    isPremium: true,
  },

  // Anniversary Music
  {
    id: 'anniversary-romantic-1',
    title: 'Years of Love',
    artist: 'Anniversary Special',
    mood: 'romantic',
    duration: 220,
    path: '/music/anniversary-romantic-1.mp3',
    eventTypes: ['anniversary', 'wedding'],
    isPremium: false,
  },
  {
    id: 'anniversary-elegant-1',
    title: 'Timeless Romance',
    artist: 'Anniversary Special',
    mood: 'elegant',
    duration: 205,
    path: '/music/anniversary-elegant-1.mp3',
    eventTypes: ['anniversary'],
    isPremium: true,
  },

  // Baby Shower Music
  {
    id: 'babyshower-peaceful-1',
    title: 'Sweet Dreams',
    artist: 'Baby Music',
    mood: 'peaceful',
    duration: 180,
    path: '/music/babyshower-peaceful-1.mp3',
    eventTypes: ['baby-shower'],
    isPremium: false,
  },
  {
    id: 'babyshower-joyful-1',
    title: 'Bundle of Joy',
    artist: 'Baby Music',
    mood: 'joyful',
    duration: 170,
    path: '/music/babyshower-joyful-1.mp3',
    eventTypes: ['baby-shower'],
    isPremium: false,
  },
];

// Filter music by event type
export function getMusicByEventType(eventType: string, userPlan: 'FREE' | 'PRO' | 'PREMIUM' = 'FREE') {
  let tracks = MUSIC_LIBRARY.filter((track) =>
    track.eventTypes.includes(eventType.toLowerCase())
  );

  // Filter out premium tracks for free users
  if (userPlan === 'FREE') {
    tracks = tracks.filter((track) => !track.isPremium);
  }

  return tracks;
}

// Filter music by mood
export function getMusicByMood(mood: MusicTrack['mood'], userPlan: 'FREE' | 'PRO' | 'PREMIUM' = 'FREE') {
  let tracks = MUSIC_LIBRARY.filter((track) => track.mood === mood);

  if (userPlan === 'FREE') {
    tracks = tracks.filter((track) => !track.isPremium);
  }

  return tracks;
}

// Get all available moods
export function getAvailableMoods(): MusicTrack['mood'][] {
  return Array.from(new Set(MUSIC_LIBRARY.map((track) => track.mood)));
}

// Format duration to mm:ss
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}
