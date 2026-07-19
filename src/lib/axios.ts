import axios, { type AxiosError, type AxiosInstance } from 'axios'
import { env } from '@/config/env'
import type { ApiError } from '@/types'

/**
 * Single axios instance for the whole app.
 * The real (Spring Boot) service layer imports this; UI code never does.
 */
export const httpClient: AxiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
})

httpClient.interceptors.request.use((config) => {
  // Placeholder for future auth: attach a bearer token when the backend exists.
  // const token = useAuthStore.getState().token
  // if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

httpClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<Partial<ApiError>>) => {
    const normalized: ApiError = {
      status: error.response?.status ?? 0,
      message:
        error.response?.data?.message ??
        error.message ??
        'Unexpected network error. Please try again.',
      path: error.response?.data?.path,
      timestamp: error.response?.data?.timestamp,
    }
    return Promise.reject(normalized)
  },
)
