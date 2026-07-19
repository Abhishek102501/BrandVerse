import type { BrandQuery } from '@/services/brand'

/** Central registry of TanStack Query keys for the brands feature. */
export const brandKeys = {
  all: ['brands'] as const,
  lists: () => [...brandKeys.all, 'list'] as const,
  list: (query: BrandQuery | undefined) => [...brandKeys.lists(), query ?? {}] as const,
  featured: () => [...brandKeys.all, 'featured'] as const,
  details: () => [...brandKeys.all, 'detail'] as const,
  detail: (slug: string) => [...brandKeys.details(), slug] as const,
  byId: (id: string) => [...brandKeys.all, 'by-id', id] as const,
  compare: (slugs: string[]) => [...brandKeys.all, 'compare', ...slugs] as const,
  search: (query: string) => [...brandKeys.all, 'search', query] as const,
  similar: (slug: string, limit?: number) => [...brandKeys.all, 'similar', slug, limit] as const,
  trending: (limit?: number) => [...brandKeys.all, 'trending', limit] as const,
  editorPicks: (limit?: number) => [...brandKeys.all, 'editor-picks', limit] as const,
  categories: ['categories'] as const,
}
