import { httpClient } from '@/lib/axios'

export interface AuthResponse {
  token: string
  id: string
  name: string
  email: string
  role: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
}

export interface LoginPayload {
  email: string
  password: string
}

export const authService = {
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const { data } = await httpClient.post<AuthResponse>(
      '/auth/register',
      payload
    )
    return data
  },

  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await httpClient.post<AuthResponse>(
      '/auth/login',
      payload
    )
    return data
  },
}