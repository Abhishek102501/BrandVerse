import { useQuery } from '@tanstack/react-query'
import { brandService, type BrandQuery } from '@/services/brand'
import { brandKeys } from './query-keys'

/**
 * Data hooks for the brands feature. UI components consume these and never
 * touch axios or the service layer directly, keeping them backend-agnostic.
 */
export function useBrands(query?: BrandQuery) {
  return useQuery({
    queryKey: brandKeys.list(query),
    queryFn: () => brandService.getBrands(query),
  })
}

export function useBrand(slug: string) {
  return useQuery({
    queryKey: brandKeys.detail(slug),
    queryFn: () => brandService.getBrandBySlug(slug),
    enabled: Boolean(slug),
  })
}

export function useBrandById(id: string) {
  return useQuery({
    queryKey: [...brandKeys.all, 'by-id', id],
    queryFn: () => brandService.getBrandById(id),
    enabled: Boolean(id),
  })
}

export function useFeaturedBrands() {
  return useQuery({
    queryKey: brandKeys.featured(),
    queryFn: () => brandService.getFeaturedBrands(),
  })
}

export function useCategories() {
  return useQuery({
    queryKey: brandKeys.categories,
    queryFn: () => brandService.getCategories(),
  })
}

/** Trending brands: highest popularity in the last period */
export function useTrendingBrands(limit = 6) {
  return useQuery({
    queryKey: [...brandKeys.all, 'trending', limit],
    queryFn: async () => {
      const { items } = await brandService.getBrands({ sort: 'popularity', pageSize: limit })
      return items
    },
  })
}

/** Editor picks: brands tagged with the editor pick marker */
export function useEditorPicks(limit = 5) {
  return useQuery({
    queryKey: [...brandKeys.all, 'editor-picks', limit],
    queryFn: async () => {
      const { items } = await brandService.getBrands({ pageSize: 50 })
      return items.filter((b) => b.tags.includes('__editor_pick__')).slice(0, limit)
    },
  })
}

/** Search brands by query */
export function useSearchBrands(query: string) {
  return useQuery({
    queryKey: [...brandKeys.all, 'search', query],
    queryFn: () => brandService.searchBrands(query),
    enabled: Boolean(query.trim()),
  })
}

/** Get brands similar to the given slug */
export function useSimilarBrands(slug: string, limit = 4) {
  return useQuery({
    queryKey: [...brandKeys.all, 'similar', slug, limit],
    queryFn: () => brandService.getSimilarBrands(slug, limit),
    enabled: Boolean(slug),
  })
}

/** Compare multiple brands by slug */
export function useCompareBrands(slugs: string[]) {
  return useQuery({
    queryKey: brandKeys.compare(slugs),
    queryFn: () => brandService.compareBrands(slugs),
    enabled: Boolean(slugs.length > 0),
  })
}
