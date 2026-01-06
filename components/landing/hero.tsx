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
    <section className="relative w-full py-24 md:py-32 lg:py-40 overflow-hidden">
      {/* Elegant gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50/50 via-white to-amber-50/30" />

      {/* Subtle decorative elements */}
      <div className="absolute top-1/4 left-20 w-64 h-64 bg-rose-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-20 w-80 h-80 bg-violet-200/15 rounded-full blur-3xl" />

      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center space-y-10 text-center max-w-5xl mx-auto">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full border border-rose-200/50 shadow-sm">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-semibold text-gray-700">AI-Powered Romance</span>
            </div>

            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl font-['Playfair_Display'] text-gray-900 leading-[1.1]">
              {title}
            </h1>

            <p className="mx-auto max-w-[700px] text-gray-600 text-xl md:text-2xl leading-relaxed font-light">
              {subtitle}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Button asChild size="lg" className="text-base px-8">
              <a href={ctaLink}>{ctaText}</a>
            </Button>

            {secondaryCtaText && secondaryCtaLink && (
              <Button asChild variant="secondary" size="lg" className="text-base px-8">
                <a href={secondaryCtaLink}>{secondaryCtaText}</a>
              </Button>
            )}
          </div>

          {/* Trust indicator */}
          <div className="pt-6 flex flex-col sm:flex-row items-center gap-3 text-sm text-gray-500">
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
            <span className="font-medium">Loved by readers worldwide</span>
          </div>
        </div>
      </div>
    </section>
  )
}
