import type { Paginated } from '@/types'
import { httpClient } from '@/lib/axios'
import type { Brand, BrandCategory, BrandQuery, BrandService } from './brand.types'

/**
 * Real implementation against the future Spring Boot API.
 * Endpoints are declared now; when the backend is live, set VITE_USE_MOCK=false
 * and this implementation is used with zero changes to hooks or UI.
 */
export const brandHttpService: BrandService = {
  async getBrands(query: BrandQuery = {}): Promise<Paginated<Brand>> {
    const { data } = await httpClient.get<Paginated<Brand>>('/brands', { params: query })
    return data
  },

  async getBrandBySlug(slug: string): Promise<Brand> {
    const { data } = await httpClient.get<Brand>(`/brands/${slug}`)
    return data
  },

  async getBrandById(id: string): Promise<Brand> {
    const { data } = await httpClient.get<Brand>(`/brands/id/${id}`)
    return data
  },

  async getFeaturedBrands(): Promise<Brand[]> {
    const { data } = await httpClient.get<Brand[]>('/brands/featured')
    return data
  },

  async getCategories(): Promise<BrandCategory[]> {
    const { data } = await httpClient.get<BrandCategory[]>('/categories')
    return data
  },

  async compareBrands(slugs: string[]): Promise<Brand[]> {
    const { data } = await httpClient.get<Brand[]>('/brands/compare', {
      params: { slugs: slugs.join(',') },
    })
    return data
  },

  async searchBrands(query: string): Promise<Brand[]> {
    const { data } = await httpClient.get<Brand[]>('/brands/search', {
      params: { q: query },
    })
    return data
  },

  async getSimilarBrands(slug: string, limit = 4): Promise<Brand[]> {
    const { data } = await httpClient.get<Brand[]>(`/brands/${slug}/similar`, {
      params: { limit },
    })
    return data
  },
}
