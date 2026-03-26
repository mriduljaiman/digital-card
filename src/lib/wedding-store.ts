'use client';

import { WeddingData } from '@/types/wedding';

const STORAGE_KEY = 'wedding_invitation_data';

export const defaultWeddingData: WeddingData = {
  groomName: 'Mihir',
  brideName: 'Varsha',
  groomFatherName: 'Shri Ramesh Sharma',
  brideFatherName: 'Shri Suresh Verma',
  initials: 'M & V',
  weddingDate: '2025-02-14',
  mainVenue: 'The Grand Palace',
  mainVenueAddress: 'Sector 21, Noida, Uttar Pradesh',
  invitationMessage:
    'Together with their families, we joyfully invite you to celebrate the union of',
  events: [
    {
      id: '1',
      name: 'Ladies Sangeet',
      venue: 'The Grand Palace, Hall A',
      date: '2025-02-12',
      time: '6:00 PM',
      icon: '🎵',
    },
    {
      id: '2',
      name: 'Haldi',
      venue: 'The Grand Palace, Garden',
      date: '2025-02-13',
      time: '8:00 AM',
      icon: '🌼',
    },
    {
      id: '3',
      name: 'Mehndi',
      venue: 'The Grand Palace, Hall B',
      date: '2025-02-13',
      time: '3:00 PM',
      icon: '🌸',
    },
    {
      id: '4',
      name: 'Lagan',
      venue: 'The Grand Palace, Main Hall',
      date: '2025-02-14',
      time: '10:00 AM',
      icon: '💍',
    },
    {
      id: '5',
      name: 'Wedding',
      venue: 'The Grand Palace, Main Hall',
      date: '2025-02-14',
      time: '11:00 AM',
      icon: '💒',
    },
    {
      id: '6',
      name: 'Phere',
      venue: 'The Grand Palace, Main Hall',
      date: '2025-02-14',
      time: '12:00 PM',
      icon: '🔥',
    },
    {
      id: '7',
      name: 'Nikasi',
      venue: 'The Grand Palace',
      date: '2025-02-14',
      time: '4:00 PM',
      icon: '🎊',
    },
  ],
  familyMembers: [
    { id: '1', name: 'Shri Ramesh Sharma', relation: 'Father', side: 'groom' },
    { id: '2', name: 'Smt. Sunita Sharma', relation: 'Mother', side: 'groom' },
    { id: '3', name: 'Rahul Sharma', relation: 'Brother', side: 'groom' },
    { id: '4', name: 'Shri Suresh Verma', relation: 'Father', side: 'bride' },
    { id: '5', name: 'Smt. Priya Verma', relation: 'Mother', side: 'bride' },
    { id: '6', name: 'Pooja Verma', relation: 'Sister', side: 'bride' },
  ],
  photos: [],
  musicEnabled: false,
};

export function getWeddingData(): WeddingData {
  if (typeof window === 'undefined') return defaultWeddingData;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultWeddingData;
    const parsed = JSON.parse(stored) as Partial<WeddingData>;
    return { ...defaultWeddingData, ...parsed };
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
