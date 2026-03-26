import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { EventType, PhotoType } from '@prisma/client';
import { EventDetails, CropData } from '@/types';

interface PhotoData {
  file?: File;
  preview?: string;
  cropData?: CropData;
  uploaded?: boolean;
  fileId?: string; // Temporary file ID from server
}

interface BuilderState {
  // Current step
  currentStep: number;

  // Step 1: Event Type
  eventType: EventType | null;

  // Step 2: Photos
  photos: Map<PhotoType, PhotoData>;

  // Step 3: Theme
  selectedThemeId: string | null;

  // Step 4: Event Details
  eventDetails: Partial<EventDetails>;

  // Step 5: Config
  musicEnabled: boolean;
  animationSpeed: 'slow' | 'normal' | 'fast';

  // Actions
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  canProceed: (step: number) => boolean;

  // Event Type Actions
  setEventType: (type: EventType) => void;

  // Photo Actions
  setPhoto: (type: PhotoType, data: Partial<PhotoData>) => void;
  removePhoto: (type: PhotoType) => void;
  getPhoto: (type: PhotoType) => PhotoData | undefined;
  hasRequiredPhotos: () => boolean;

  // Theme Actions
  setTheme: (themeId: string) => void;

  // Event Details Actions
  setEventDetails: (details: Partial<EventDetails>) => void;
  updateEventDetail: <K extends keyof EventDetails>(key: K, value: EventDetails[K]) => void;

  // Config Actions
  setMusicEnabled: (enabled: boolean) => void;
  setAnimationSpeed: (speed: 'slow' | 'normal' | 'fast') => void;

  // Reset
  reset: () => void;

  // Get data for API submission
  getSubmissionData: () => any;
}

const initialEventDetails: Partial<EventDetails> = {
  hostName: '',
  coHostName: '',
  eventDate: null,
  eventTime: '7:00 PM',
  venue: '',
  venueAddress: '',
  mapLink: '',
  rsvpWhatsApp: '',
  contactEmail: '',
  customMessage: '',
};

export const useBuilderStore = create<BuilderState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentStep: 1,
      eventType: null,
      photos: new Map(),
      selectedThemeId: null,
      eventDetails: initialEventDetails,
      musicEnabled: true,
      animationSpeed: 'normal',

      // Step Navigation
      setStep: (step) => set({ currentStep: step }),

      nextStep: () => {
        const { currentStep } = get();
        if (currentStep < 5) {
          set({ currentStep: currentStep + 1 });
        }
      },

      prevStep: () => {
        const { currentStep } = get();
        if (currentStep > 1) {
          set({ currentStep: currentStep - 1 });
        }
      },

      canProceed: (step) => {
        const state = get();
        switch (step) {
          case 1:
            return state.eventType !== null;
          case 2:
            return state.hasRequiredPhotos();
          case 3:
            return state.selectedThemeId !== null;
          case 4:
            return (
              !!state.eventDetails.hostName &&
              !!state.eventDetails.eventDate &&
              !!state.eventDetails.venue
            );
          case 5:
            return true;
          default:
            return false;
        }
      },

      // Event Type
      setEventType: (type) => set({ eventType: type }),

      // Photos
      setPhoto: (type, data) => {
        const { photos } = get();
        const existing = photos.get(type) || {};
        const updated = new Map(photos);
        updated.set(type, { ...existing, ...data });
        set({ photos: updated });
      },

      removePhoto: (type) => {
        const { photos } = get();
        const updated = new Map(photos);
        updated.delete(type);
        set({ photos: updated });
      },

      getPhoto: (type) => {
        return get().photos.get(type);
      },

      hasRequiredPhotos: () => {
        const { eventType, photos } = get();
        if (!eventType) return false;

        // At minimum, we need at least one photo uploaded
        if (photos.size === 0) return false;

        // Check if at least one photo has a file or fileId
        const hasAtLeastOne = Array.from(photos.values()).some(
          (photo) => photo.file || photo.fileId
        );

        return hasAtLeastOne;
      },

      // Theme
      setTheme: (themeId) => set({ selectedThemeId: themeId }),

      // Event Details
      setEventDetails: (details) =>
        set((state) => ({
          eventDetails: { ...state.eventDetails, ...details },
        })),

      updateEventDetail: (key, value) =>
        set((state) => ({
          eventDetails: { ...state.eventDetails, [key]: value },
        })),

      // Config
      setMusicEnabled: (enabled) => set({ musicEnabled: enabled }),
      setAnimationSpeed: (speed) => set({ animationSpeed: speed }),

      // Reset
      reset: () =>
        set({
          currentStep: 1,
          eventType: null,
          photos: new Map(),
          selectedThemeId: null,
          eventDetails: initialEventDetails,
          musicEnabled: true,
          animationSpeed: 'normal',
        }),

      // Get submission data
      getSubmissionData: () => {
        const state = get();
        return {
          eventType: state.eventType,
          ...state.eventDetails,
          themeId: state.selectedThemeId,
          photos: Array.from(state.photos.entries()).map(([type, data]) => ({
            type,
            fileId: data.fileId,
          })),
          musicEnabled: state.musicEnabled,
          animationSpeed: state.animationSpeed,
        };
      },
    }),
    {
      name: 'invite-builder-storage',
      partialize: (state) => ({
        // Only persist specific fields (not files/previews)
        currentStep: state.currentStep,
        eventType: state.eventType,
        selectedThemeId: state.selectedThemeId,
        eventDetails: state.eventDetails,
        musicEnabled: state.musicEnabled,
        animationSpeed: state.animationSpeed,
        // Don't persist photos Map directly
      }),
    }
  )
);
