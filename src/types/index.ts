/** Shared API envelope helpers, framework-agnostic. */

export interface ApiError {
  status: number
  message: string
  path?: string
  timestamp?: string
}

export interface Paginated<T> {
  items: T[]
  page: number
  pageSize: number
  total: number
  totalPages: number
}
