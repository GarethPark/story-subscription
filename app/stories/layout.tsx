import { Metadata } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://readsilk.com'

export const metadata: Metadata = {
  title: 'Browse Stories - Silk Romance',
  description: 'Explore our curated collection of AI-generated romance stories. Contemporary, Dark Romance, Romantasy, and more. Find your next irresistible read.',
  openGraph: {
    title: 'Browse Stories - Silk Romance',
    description: 'Explore our curated collection of AI-generated romance stories. Contemporary, Dark Romance, Romantasy, and more.',
    url: `${baseUrl}/stories`,
    siteName: 'Silk',
    images: [
      {
        url: `${baseUrl}/images/genre-tropes/dark-romance_forbidden-love.png`,
        width: 1200,
        height: 630,
        alt: 'Silk Romance Stories Collection',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Browse Stories - Silk Romance',
    description: 'Explore our curated collection of AI-generated romance stories. Contemporary, Dark Romance, Romantasy, and more.',
    images: [`${baseUrl}/images/genre-tropes/dark-romance_forbidden-love.png`],
  },
}

export default function StoriesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
