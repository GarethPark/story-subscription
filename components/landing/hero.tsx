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
    <section className="relative w-full min-h-[85vh] flex items-center overflow-hidden">
      {/* Romantic background image with overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=1920&h=1080&fit=crop&q=80"
          alt="Romantic atmosphere"
          className="w-full h-full object-cover"
        />
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-rose-900/70 via-rose-800/60 to-violet-900/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>

      {/* Decorative light elements */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-amber-300/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-rose-300/10 rounded-full blur-3xl" />

      <div className="container px-4 md:px-6 relative z-10 py-24 md:py-32">
        <div className="flex flex-col items-center space-y-10 text-center max-w-5xl mx-auto">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30 shadow-lg">
              <Sparkles className="h-4 w-4 text-amber-300" />
              <span className="text-sm font-semibold text-white">AI-Powered Romance</span>
            </div>

            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl font-['Playfair_Display'] text-white leading-[1.1] drop-shadow-2xl">
              {title}
            </h1>

            <p className="mx-auto max-w-[700px] text-rose-50 text-xl md:text-2xl leading-relaxed font-light drop-shadow-lg">
              {subtitle}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button asChild size="lg" className="text-base px-10 py-6 text-lg shadow-2xl">
              <a href={ctaLink}>{ctaText}</a>
            </Button>

            {secondaryCtaText && secondaryCtaLink && (
              <Button asChild variant="secondary" size="lg" className="text-base px-10 py-6 text-lg bg-white/90 backdrop-blur-sm hover:bg-white shadow-xl border-2 border-white/50">
                <a href={secondaryCtaLink}>{secondaryCtaText}</a>
              </Button>
            )}
          </div>

          {/* Trust indicator */}
          <div className="pt-8 flex flex-col sm:flex-row items-center gap-3 text-sm">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className="w-5 h-5 text-amber-300 fill-current drop-shadow-md"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
            <span className="font-semibold text-white drop-shadow-md">Loved by readers worldwide</span>
          </div>
        </div>
      </div>
    </section>
  )
}
