import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ViewedBrand {
  id: string
  viewedAt: number
}

interface RecentlyViewedState {
  viewed: ViewedBrand[]
  addViewed: (id: string) => void
  getRecent: (limit?: number) => ViewedBrand[]
  clear: () => void
}

/** Track recently viewed brands, persisted to localStorage */
export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set, get) => ({
      viewed: [],
      addViewed: (id) =>
        set((state) => ({
          viewed: [
            { id, viewedAt: Date.now() },
            ...state.viewed.filter((v) => v.id !== id),
          ].slice(0, 20),
        })),
      getRecent: (limit = 5) => get().viewed.slice(0, limit),
      clear: () => set({ viewed: [] }),
    }),
    { name: 'brandverse-recently-viewed' },
  ),
)
