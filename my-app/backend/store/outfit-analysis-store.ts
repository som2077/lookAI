import { create } from "zustand";

interface OutfitAnalysisState {
  isAnalyzing: boolean;
  isDone: boolean;
  imageUri: string | null;
  progress: number;
  startAnalysis: (imageUri: string) => void;
  clearAnalysis: () => void;
}

let _interval: ReturnType<typeof setInterval> | null = null;
let _doneTimeout: ReturnType<typeof setTimeout> | null = null;

const TICK_MS = 150;
const DURATION_MS = 9000;
const INCREMENT = 100 / (DURATION_MS / TICK_MS);

export const useOutfitAnalysisStore = create<OutfitAnalysisState>((set, get) => ({
  isAnalyzing: false,
  isDone: false,
  imageUri: null,
  progress: 0,

  startAnalysis: (imageUri: string) => {
    if (_interval) { clearInterval(_interval); _interval = null; }
    if (_doneTimeout) { clearTimeout(_doneTimeout); _doneTimeout = null; }

    set({ isAnalyzing: true, isDone: false, imageUri, progress: 0 });

    _interval = setInterval(() => {
      const current = get().progress;
      const next = Math.min(current + INCREMENT, 100);

      if (next >= 100) {
        clearInterval(_interval!);
        _interval = null;
        set({ progress: 100, isDone: true, isAnalyzing: false });

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
    if (_interval) { clearInterval(_interval); _interval = null; }
    if (_doneTimeout) { clearTimeout(_doneTimeout); _doneTimeout = null; }
    set({ isAnalyzing: false, isDone: false, imageUri: null, progress: 0 });
  },
}));
