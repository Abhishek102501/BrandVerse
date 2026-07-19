import { httpClient } from '@/lib/axios'
import type { Brand } from '@/services/brand/brand.types'

export interface AdminBrandPayload {
  name: string
  slug: string
  logoUrl: string
  description: string
  category: string
  country: string
  websiteUrl: string
  rating: number
  reviewsCount: number
  popularity: number
  sustainabilityScore: number
  trustScore: number
  priceRange: string
  tags: string[]
  featured: boolean
}

export const adminService = {
  async createBrand(payload: AdminBrandPayload): Promise<Brand> {
    const { data } = await httpClient.post<Brand>('/admin/brands', payload)
    return data
  },

  async updateBrand(id: string, payload: AdminBrandPayload): Promise<Brand> {
    const { data } = await httpClient.put<Brand>(`/admin/brands/${id}`, payload)
    return data
  },

  async deleteBrand(id: string): Promise<void> {
    await httpClient.delete(`/admin/brands/${id}`)
  },
}