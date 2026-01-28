import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://readsilk.com'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/dashboard/',
          '/my-stories/',
          '/library/',
          '/profile/',
          '/generate/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
