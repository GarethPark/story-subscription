import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'

interface HeroProps {
  title: string
  subtitle: string
  ctaText?: string
  ctaLink?: string
  secondaryCtaText?: string
  secondaryCtaLink?: string
}

export function Hero({
  title,
  subtitle,
  ctaText = 'Get Started',
  ctaLink = '/signup',
  secondaryCtaText,
  secondaryCtaLink
}: HeroProps) {
  return (
    <section className="relative w-full py-20 md:py-32 lg:py-40 xl:py-48 overflow-hidden">
      {/* Elegant gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-amber-50 to-rose-50" />

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-rose-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-violet-200/30 rounded-full blur-3xl" />

      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center space-y-8 text-center">
          <div className="space-y-6 max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-rose-200/50 shadow-sm">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-medium text-gray-700">AI-Powered Romance Stories</span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl font-['Playfair_Display'] text-gray-900 leading-tight">
              {title}
            </h1>

            <p className="mx-auto max-w-[800px] text-gray-600 text-lg md:text-xl lg:text-2xl leading-relaxed">
              {subtitle}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button asChild size="lg" className="text-base">
              <a href={ctaLink}>{ctaText}</a>
            </Button>

            {secondaryCtaText && secondaryCtaLink && (
              <Button asChild variant="outline" size="lg" className="text-base">
                <a href={secondaryCtaLink}>{secondaryCtaText}</a>
              </Button>
            )}
          </div>

          {/* Trust indicator */}
          <div className="pt-8 flex items-center gap-2 text-sm text-gray-600">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className="w-5 h-5 text-amber-400 fill-current"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
            <span className="font-medium">Loved by romance readers worldwide</span>
          </div>
        </div>
      </div>
    </section>
  )
}
