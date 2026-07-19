/**
 * Typed access to build-time environment variables.
 * Keep all `import.meta.env` reads in this file so the rest of the app
 * depends on a small, well-typed surface instead of raw env strings.
 */
export const env = {
  appName: import.meta.env.VITE_APP_NAME ?? 'BrandVerse',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '/api',
  /** When true, the app resolves data from the in-memory mock services. */
  useMock: (import.meta.env.VITE_USE_MOCK ?? 'true') === 'true',
  isDev: import.meta.env.DEV,
} as const

export type Env = typeof env
