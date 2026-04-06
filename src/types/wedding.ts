export interface WeddingEvent {
  id: string;
  name: string;
  venue: string;
  date: string;
  time: string;
  icon: string;
  description?: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  side: 'groom' | 'bride';
}

export interface WeddingData {
  groomName: string;
  brideName: string;
  groomFatherName: string;
  brideFatherName: string;
  initials: string;
  weddingDate: string;
  mainVenue: string;
  mainVenueAddress: string;
  invitationMessage: string;
  events: WeddingEvent[];
  familyMembers: FamilyMember[];
  photos: string[];
  musicEnabled: boolean;
  musicUrl?: string;
  homeAddress: string;
}
