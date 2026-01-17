import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables')
}

// Trim the key to remove any accidental whitespace
const stripeSecretKey = process.env.STRIPE_SECRET_KEY.trim()

export const stripe = new Stripe(stripeSecretKey, {
  typescript: true,
  maxNetworkRetries: 3,
})

// Price ID mappings from environment (trimmed to remove any whitespace/newlines)
export const STRIPE_PRICES = {
  STARTER: process.env.STRIPE_PRICE_STARTER?.trim() || '',
  PLUS: process.env.STRIPE_PRICE_PLUS?.trim() || '',
  UNLIMITED: process.env.STRIPE_PRICE_UNLIMITED?.trim() || '',
  CREDIT: process.env.STRIPE_PRICE_CREDIT?.trim() || '',
} as const

// Credit allocations per tier
export const TIER_CREDITS = {
  FREE: 0,
  STARTER: 3,
  PLUS: 8,
  UNLIMITED: 999, // Effectively unlimited (checked daily)
} as const

// Pricing in USD
export const TIER_PRICES = {
  STARTER: 6.99,
  PLUS: 11.99,
  UNLIMITED: 19.99,
  CREDIT: 3.99,
} as const

// Map Stripe Price IDs to tier names
export function getTierFromPriceId(priceId: string): 'STARTER' | 'PLUS' | 'UNLIMITED' | null {
  if (priceId === STRIPE_PRICES.STARTER) return 'STARTER'
  if (priceId === STRIPE_PRICES.PLUS) return 'PLUS'
  if (priceId === STRIPE_PRICES.UNLIMITED) return 'UNLIMITED'
  return null
}
