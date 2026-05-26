import { create } from "zustand";

export interface LastOutfit {
  imageUri: string;
  time: string;
}

interface OutfitAnalysisState {
  isAnalyzing: boolean;
  isDone: boolean;
  imageUri: string | null;
  progress: number;
  lastOutfits: LastOutfit[];
  startAnalysis: (imageUri: string) => void;
  clearAnalysis: () => void;
  removeOutfit: (index: number) => void;
  clearAllOutfits: () => void;
}

let _interval: ReturnType<typeof setInterval> | null = null;
let _doneTimeout: ReturnType<typeof setTimeout> | null = null;

const TICK_MS = 150;
const DURATION_MS = 9000;
const INCREMENT = 100 / (DURATION_MS / TICK_MS);

function formatTime(): string {
  const now = new Date();
  const h = now.getHours() % 12 || 12;
  const m = now.getMinutes().toString().padStart(2, "0");
  const ampm = now.getHours() >= 12 ? "PM" : "AM";
  return `${h}:${m}${ampm}`;
}

export const useOutfitAnalysisStore = create<OutfitAnalysisState>(
  (set, get) => ({
    isAnalyzing: false,
    isDone: false,
    imageUri: null,
    progress: 0,
    lastOutfits: [],

    startAnalysis: (imageUri: string) => {
      if (_interval) {
        clearInterval(_interval);
        _interval = null;
      }
      if (_doneTimeout) {
        clearTimeout(_doneTimeout);
        _doneTimeout = null;
      }

      set({ isAnalyzing: true, isDone: false, imageUri, progress: 0 });

      _interval = setInterval(() => {
        const current = get().progress;
        const next = Math.min(current + INCREMENT, 100);

        if (next >= 100) {
          clearInterval(_interval!);
          _interval = null;
          const uri = get().imageUri!;
          set({
            progress: 100,
            isDone: true,
            isAnalyzing: false,
            lastOutfits: [
              ...get().lastOutfits,
              { imageUri: uri, time: formatTime() },
            ],
          });

          _doneTimeout = setTimeout(() => {
            set({ isDone: false, imageUri: null, progress: 0 });
            _doneTimeout = null;
          }, 4000);
        } else {
          set({ progress: next });
        }
      }, TICK_MS);
    },

    clearAnalysis: () => {
      if (_interval) {
        clearInterval(_interval);
        _interval = null;
      }
      if (_doneTimeout) {
        clearTimeout(_doneTimeout);
        _doneTimeout = null;
      }
      set({ isAnalyzing: false, isDone: false, imageUri: null, progress: 0 });
    },

    removeOutfit: (index: number) =>
      set({ lastOutfits: get().lastOutfits.filter((_, i) => i !== index) }),

    clearAllOutfits: () => set({ lastOutfits: [] }),
  }),
);
