import { Metadata } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://readsilk.com'

export const metadata: Metadata = {
  title: 'Pricing - Silk Romance Stories',
  description: 'Choose your perfect plan. Start with 3 free credits, then subscribe for unlimited AI-generated romance stories tailored to your preferences.',
  openGraph: {
    title: 'Pricing - Silk Romance Stories',
    description: 'Choose your perfect plan. Start with 3 free credits, then subscribe for unlimited AI-generated romance stories.',
    url: `${baseUrl}/pricing`,
    siteName: 'Silk',
    images: [
      {
        url: `${baseUrl}/images/genre-tropes/romantasy_enemies-to-lovers.png`,
        width: 1200,
        height: 630,
        alt: 'Silk - Romance Story Subscriptions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pricing - Silk Romance Stories',
    description: 'Choose your perfect plan. Start with 3 free credits, then subscribe for unlimited AI-generated romance stories.',
    images: [`${baseUrl}/images/genre-tropes/romantasy_enemies-to-lovers.png`],
  },
}

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
