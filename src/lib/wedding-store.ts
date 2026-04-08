'use client';

import { WeddingData } from '@/types/wedding';

const STORAGE_KEY = 'wedding_invitation_data';

export const defaultWeddingData: WeddingData = {
  groomName: 'Mridul',
  brideName: 'Vijaya',
  groomFatherName: 'Pankaj Jaiman',
  brideFatherName: 'Sanjay Pandey',
  initials: 'M & V',
  weddingDate: '2026-04-20',
  mainVenue: 'Dayal Garden, Viratnagar',
  mainVenueAddress: 'Dayal Garden, Viratnagar | Stay: Tiger Paradise, Viratnagar',
  invitationMessage:
    'Together with their families, we joyfully invite you to celebrate the union of',
  events: [
    {
      id: '1',
      name: 'Ganesh Nimantran',
      venue: 'Ghar — 148-B Swarnpuri Kanak Vrindavan, Sirsi Road, Jaipur',
      date: '2026-04-08',
      time: 'Pratah Kal',
      icon: '🙏',
    },
    {
      id: '2',
      name: 'Haldi & Mehndi Rasam',
      venue: 'Ghar — 148-B Swarnpuri Kanak Vrindavan, Sirsi Road, Jaipur',
      date: '2026-04-17',
      time: 'Pratah Kal',
      icon: '🌼',
    },
    {
      id: '3',
      name: 'Lagn Tika',
      venue: 'Chanda Paradise Garden, Panchyawala, Sirsi Road, Jaipur',
      date: '2026-04-18',
      time: '12:00 PM',
      icon: '🪔',
    },
    {
      id: '4',
      name: 'Mahila Sangeet',
      venue: 'Chanda Paradise Garden, Panchyawala, Sirsi Road, Jaipur',
      date: '2026-04-18',
      time: '3:00 PM',
      icon: '🎵',
    },
    {
      id: '5',
      name: 'Pratibhoj',
      venue: 'Chanda Paradise Garden, Panchyawala, Sirsi Road, Jaipur',
      date: '2026-04-18',
      time: '7:00 PM',
      icon: '🍽️',
    },
    {
      id: '6',
      name: 'Ghudchadi',
      venue: 'Ghar — 148-B Swarnpuri Kanak Vrindavan, Sirsi Road, Jaipur',
      date: '2026-04-20',
      time: '12:00 PM',
      icon: '🐴',
    },
    {
      id: '7',
      name: 'PaniGrahan Sanskar',
      venue: 'Dayal Garden, Viratnagar',
      date: '2026-04-20',
      time: 'Shubh Lagnananusar',
      icon: '💍',
    },
  ],
  familyMembers: [
    { id: '1', name: 'Pankaj Jaiman', relation: 'Father', side: 'groom' },
    { id: '2', name: 'Suman Jaiman', relation: 'Mother', side: 'groom' },
    { id: '3', name: 'Sanjay Pandey', relation: 'Father', side: 'bride' },
    { id: '4', name: 'Shushma Pandey', relation: 'Mother', side: 'bride' },
  ],
  photos: ['/photos/wedding-photo.jpeg'],
  homeAddress: '148-B Swarnpuri Kanak Vrindavan, Sirsi Road, Jaipur',
  musicEnabled: true,
  musicUrl: '/audio/mangalye.mp3',
};

export function getWeddingData(): WeddingData {
  if (typeof window === 'undefined') return defaultWeddingData;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultWeddingData;
    const parsed = JSON.parse(stored) as Partial<WeddingData>;
    return {
      ...defaultWeddingData,
      ...parsed,
      // Always use code defaults for these — never override from localStorage
      events: defaultWeddingData.events,
      familyMembers: defaultWeddingData.familyMembers,
      musicEnabled: parsed.musicEnabled ?? defaultWeddingData.musicEnabled,
      musicUrl: parsed.musicUrl || defaultWeddingData.musicUrl,
      photos: parsed.photos?.length ? parsed.photos : defaultWeddingData.photos,
    };
  } catch {
    return defaultWeddingData;
  }
}

export function saveWeddingData(data: WeddingData): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function clearWeddingData(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

export async function compressImage(file: File, maxWidth = 800): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.75));
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
}
