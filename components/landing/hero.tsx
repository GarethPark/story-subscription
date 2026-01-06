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
    <section className="relative w-full min-h-[90vh] flex items-center overflow-hidden">
      {/* Sexy romantic background image with overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1515516969-d4008cc6241a?w=1920&h=1080&fit=crop&q=80"
          alt="Romance"
          className="w-full h-full object-cover"
        />
        {/* Dramatic gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-rose-900/70 to-violet-900/75" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </div>

      {/* Sultry light effects */}
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-rose-500/15 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 left-1/4 w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-3xl" />

      <div className="container px-4 md:px-6 relative z-10 py-24 md:py-32">
        <div className="flex flex-col items-center space-y-10 text-center max-w-5xl mx-auto">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-600/30 backdrop-blur-md rounded-full border border-rose-400/40 shadow-lg">
              <Sparkles className="h-4 w-4 text-rose-200" />
              <span className="text-sm font-bold text-white tracking-wide">YOUR DREAM ROMANCE</span>
            </div>

            <h1 className="text-6xl font-bold tracking-tight sm:text-7xl md:text-8xl lg:text-9xl font-['Playfair_Display'] text-white leading-[1.05] drop-shadow-2xl">
              {title}
            </h1>

            <p className="mx-auto max-w-[750px] text-rose-100 text-2xl md:text-3xl leading-relaxed font-light drop-shadow-xl italic">
              {subtitle}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-5 pt-6">
            <Button asChild size="lg" className="text-lg px-12 py-7 font-bold shadow-2xl hover:scale-105 transition-transform">
              <a href={ctaLink}>{ctaText}</a>
            </Button>

            {secondaryCtaText && secondaryCtaLink && (
              <Button asChild variant="secondary" size="lg" className="text-lg px-12 py-7 font-bold bg-white/95 backdrop-blur-sm hover:bg-white hover:scale-105 shadow-2xl border-2 border-white/60 transition-transform">
                <a href={secondaryCtaLink}>{secondaryCtaText}</a>
              </Button>
            )}
          </div>

          {/* Trust indicator */}
          <div className="pt-10 flex flex-col sm:flex-row items-center gap-4 text-base">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className="w-6 h-6 text-amber-400 fill-current drop-shadow-lg"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
            <span className="font-bold text-white drop-shadow-lg text-lg">Join thousands of satisfied readers</span>
          </div>
        </div>
      </div>
    </section>
  )
}
