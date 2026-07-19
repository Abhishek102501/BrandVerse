export const paths = {
  home: '/',
  brands: '/brands',
  brandDetail: '/brands/:slug',
  categories: '/categories',
  compare: '/compare',
  favorites: '/favorites',
  profile: '/profile',
  settings: '/settings',
  admin: '/admin',
  login: '/login',
  register: '/register',
  notFound: '*',
} as const

export const brandDetailPath = (slug: string) => `/brands/${slug}`