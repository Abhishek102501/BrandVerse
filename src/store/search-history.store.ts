import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SearchHistoryState {
  history: string[]
  add: (query: string) => void
  remove: (query: string) => void
  clear: () => void
}

/** Track search history for quick access */
export const useSearchHistoryStore = create<SearchHistoryState>()(
  persist(
    (set) => ({
      history: [],
      add: (query) =>
        set((state) => ({
          history: [query, ...state.history.filter((h) => h !== query)].slice(0, 10),
        })),
      remove: (query) =>
        set((state) => ({
          history: state.history.filter((h) => h !== query),
        })),
      clear: () => set({ history: [] }),
    }),
    { name: 'brandverse-search-history' },
  ),
)
