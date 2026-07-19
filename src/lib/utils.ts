import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge conditional class names and de-duplicate conflicting Tailwind classes.
 * Used by every UI primitive so callers can safely override styles.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/** Format a 0–5 rating to one decimal place (e.g. 4 -> "4.0"). */
export function formatRating(rating: number): string {
  return rating.toFixed(1)
}

/** Format large counts compactly (e.g. 12500 -> "12.5k"). */
export function formatCount(value: number): string {
  return Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(value)
}
