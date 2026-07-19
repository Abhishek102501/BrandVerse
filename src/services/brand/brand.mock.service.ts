import type { Paginated } from '@/types'
import type { Brand, BrandCategory, BrandQuery, BrandService } from './brand.types'
import { mockBrands, mockCategories } from './mock-data'

/** Simulate realistic network latency so loading states are exercised. */
const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms))

function applyQuery(brands: Brand[], query: BrandQuery): Brand[] {
  let result = [...brands]

  if (query.search) {
    const term = query.search.trim().toLowerCase()
    result = result.filter(
      (b) =>
        b.name.toLowerCase().includes(term) ||
        b.description.toLowerCase().includes(term) ||
        b.tags.some((tag) => tag.toLowerCase().includes(term)),
    )
  }

  if (query.category) {
    result = result.filter((b) => b.category === query.category)
  }

  if (query.minRating !== undefined) {
    result = result.filter((b) => b.rating >= query.minRating!)
  }

  if (query.minSustainability !== undefined) {
    result = result.filter((b) => b.sustainabilityScore >= query.minSustainability!)
  }

  if (query.maxPrice) {
    const priceOrder = { budget: 1, mid: 2, premium: 3, luxury: 4 }
    const maxOrder = priceOrder[query.maxPrice]
    result = result.filter((b) => priceOrder[b.priceRange] <= maxOrder)
  }

  switch (query.sort) {
    case 'popularity':
      result.sort((a, b) => b.popularity - a.popularity)
      break
    case 'trust':
      result.sort((a, b) => b.trustScore - a.trustScore)
      break
    case 'sustainability':
      result.sort((a, b) => b.sustainabilityScore - a.sustainabilityScore)
      break
    case 'rating':
    default:
      result.sort((a, b) => b.rating - a.rating)
  }

  return result
}

export const brandMockService: BrandService = {
  async getBrands(query: BrandQuery = {}): Promise<Paginated<Brand>> {
    await delay()
    const page = query.page ?? 1
    const pageSize = query.pageSize ?? 12
    const filtered = applyQuery(mockBrands, query)
    const start = (page - 1) * pageSize
    const items = filtered.slice(start, start + pageSize)

    return {
      items,
      page,
      pageSize,
      total: filtered.length,
      totalPages: Math.max(1, Math.ceil(filtered.length / pageSize)),
    }
  },

  async getBrandBySlug(slug: string): Promise<Brand> {
    await delay(250)
    const brand = mockBrands.find((b) => b.slug === slug)
    if (!brand) {
      throw { status: 404, message: `Brand "${slug}" was not found.` }
    }
    return brand
  },

  async getBrandById(id: string): Promise<Brand> {
    await delay(250)
    const brand = mockBrands.find((b) => b.id === id)
    if (!brand) {
      throw { status: 404, message: `Brand with ID "${id}" was not found.` }
    }
    return brand
  },

  async getFeaturedBrands(): Promise<Brand[]> {
    await delay(250)
    return mockBrands.filter((b) => b.featured)
  },

  async getCategories(): Promise<BrandCategory[]> {
    await delay(200)
    return mockCategories
  },

  async compareBrands(slugs: string[]): Promise<Brand[]> {
    await delay(300)
    return slugs
      .map((slug) => mockBrands.find((b) => b.slug === slug))
      .filter((b): b is Brand => Boolean(b))
  },

  async searchBrands(query: string): Promise<Brand[]> {
    await delay(300)
    const term = query.trim().toLowerCase()
    return mockBrands.filter(
      (b) =>
        b.name.toLowerCase().includes(term) ||
        b.description.toLowerCase().includes(term) ||
        b.tags.some((tag) => tag.toLowerCase().includes(term)) ||
        b.country.toLowerCase().includes(term),
    )
  },

  async getSimilarBrands(slug: string, limit = 4): Promise<Brand[]> {
    await delay(250)
    const brand = mockBrands.find((b) => b.slug === slug)
    if (!brand) {
      return []
    }
    // Similar by: same category, similar rating, not the brand itself
    return mockBrands
      .filter(
        (b) =>
          b.slug !== slug &&
          (b.category === brand.category || Math.abs(b.rating - brand.rating) < 0.5),
      )
      .sort((a, b) => {
        const aScore =
          (a.category === brand.category ? 1 : 0) +
          (1 - Math.abs(a.rating - brand.rating) / 5)
        const bScore =
          (b.category === brand.category ? 1 : 0) +
          (1 - Math.abs(b.rating - brand.rating) / 5)
        return bScore - aScore
      })
      .slice(0, limit)
  },
}
