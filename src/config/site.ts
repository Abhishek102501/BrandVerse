import { paths } from '@/app/router/paths'

/** Static, presentational metadata about the product. No data-fetching here. */
export const siteConfig = {
  name: 'BrandVerse',
  tagline: 'Discover fashion brands worth following.',
  description:
    'A discovery platform for clothing brands — ranked by ratings, reviews, popularity, sustainability and trust.',
  url: 'https://brandverse.example',
  social: {
    twitter: 'https://twitter.com',
    instagram: 'https://instagram.com',
    github: 'https://github.com',
  },
} as const

export interface NavItem {
  label: string
  to: string
}

/** Primary navigation shown in the navbar and mobile menu. */
export const mainNav: NavItem[] = [
  { label: 'Home', to: paths.home },
  { label: 'Brands', to: paths.brands },
  { label: 'Categories', to: paths.categories },
  { label: 'Compare', to: paths.compare },
]

export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: 'Discover',
    items: [
      { label: 'All brands', to: paths.brands },
      { label: 'Categories', to: paths.categories },
      { label: 'Compare', to: paths.compare },
      { label: 'Favorites', to: paths.favorites },
    ],
  },
]
