import type { Paginated } from '@/types'

export type PriceRange = 'budget' | 'mid' | 'premium' | 'luxury'
export type BrandSort = 'rating' | 'popularity' | 'trust' | 'sustainability'

export interface Brand {
  id: string
  name: string
  slug: string
  logoUrl: string
  description: string
  category: string
  country: string
  websiteUrl: string
  /** 0–5 */
  rating: number
  reviewsCount: number
  /** 0–100 */
  popularity: number
  /** 0–100 */
  sustainabilityScore: number
  /** 0–100 */
  trustScore: number
  priceRange: PriceRange
  tags: string[]
  featured: boolean
}

export interface BrandCategory {
  id: string
  name: string
  slug: string
  description: string
  brandCount: number
}

export interface BrandQuery {
  search?: string
  category?: string
  sort?: BrandSort
  page?: number
  pageSize?: number
  minRating?: number
  maxPrice?: PriceRange
  minSustainability?: number
}

/**
 * The contract every brand data source must satisfy.
 * `BrandMockService` implements it today; `BrandHttpService` implements it
 * against Spring Boot later. Consumers depend on this interface only.
 */
export interface BrandService {
  getBrands(query?: BrandQuery): Promise<Paginated<Brand>>
  getBrandBySlug(slug: string): Promise<Brand>
  getBrandById(id: string): Promise<Brand>
  getFeaturedBrands(): Promise<Brand[]>
  getCategories(): Promise<BrandCategory[]>
  compareBrands(slugs: string[]): Promise<Brand[]>
  searchBrands(query: string): Promise<Brand[]>
  getSimilarBrands(slug: string, limit?: number): Promise<Brand[]>
}
