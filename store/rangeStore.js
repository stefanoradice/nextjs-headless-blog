import { create } from 'zustand';

export const useRangeStore = create((set) => ({
  range: '30d',
  setRange: (r) => set({ range: r }),
  ranges: [
    { id: '7d', label: '7 giorni' },
    { id: '30d', label: '30 giorni' },
    { id: '90d', label: '90 giorni' },
  ],
}));
