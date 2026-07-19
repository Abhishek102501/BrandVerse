import { env } from '@/config/env'
import type { BrandService } from './brand.types'
import { brandMockService } from './brand.mock.service'
import { brandHttpService } from './brand.http.service'

/**
 * The single place the app resolves its data source.
 * Flip VITE_USE_MOCK in .env to switch — nothing else needs to change.
 */
export const brandService: BrandService = env.useMock ? brandMockService : brandHttpService

export type { Brand, BrandCategory, BrandQuery, BrandSort, PriceRange } from './brand.types'
