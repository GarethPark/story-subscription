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
    <section className="relative w-full min-h-[95vh] flex items-center overflow-hidden bg-black">
      {/* Sophisticated couple - James Bond aesthetic */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=1920&h=1080&fit=crop&q=80"
          alt="Romance"
          className="w-full h-full object-cover opacity-80"
        />
        {/* Dark, mysterious overlays - couple visible in shadows */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/45 to-black/65" />
        <div className="absolute inset-0 bg-gradient-to-br from-red-950/20 via-transparent to-purple-950/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
      </div>

      {/* Dangerous, sultry lighting */}
      <div className="absolute top-1/4 right-1/3 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/3 w-[700px] h-[700px] bg-purple-900/15 rounded-full blur-3xl" />

      <div className="container px-4 md:px-6 relative z-10 py-28 md:py-36">
        <div className="flex flex-col items-center space-y-12 text-center max-w-6xl mx-auto">
          <div className="space-y-9">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-red-950/50 backdrop-blur-md rounded-full border border-red-800/60 shadow-2xl">
              <Sparkles className="h-4 w-4 text-red-400" />
              <span className="text-sm font-black text-red-100 tracking-widest uppercase">Forbidden. Passionate. Yours.</span>
            </div>

            <h1 className="text-6xl font-black tracking-tight sm:text-7xl md:text-8xl lg:text-[10rem] font-['Playfair_Display'] text-white leading-[0.95] drop-shadow-[0_0_30px_rgba(0,0,0,0.9)]">
              {title}
            </h1>

            <p className="mx-auto max-w-[800px] text-gray-200 text-2xl md:text-4xl leading-relaxed font-light drop-shadow-2xl italic tracking-wide">
              {subtitle}
            </p>

            <p className="mx-auto max-w-[700px] text-red-200/80 text-lg md:text-xl leading-relaxed font-light drop-shadow-xl">
              Dangerously addictive stories. Unforgettable characters. Unputdownable romance.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 pt-8">
            <Button asChild size="lg" className="text-xl px-14 py-8 font-black shadow-[0_0_40px_rgba(190,24,93,0.6)] hover:shadow-[0_0_60px_rgba(190,24,93,0.8)] hover:scale-110 transition-all duration-300 bg-gradient-to-r from-red-700 via-rose-700 to-red-700 border-2 border-red-500/50">
              <a href={ctaLink}>{ctaText}</a>
            </Button>

            {secondaryCtaText && secondaryCtaLink && (
              <Button asChild variant="secondary" size="lg" className="text-xl px-14 py-8 font-black bg-white/10 backdrop-blur-md hover:bg-white/20 hover:scale-110 shadow-2xl border-2 border-white/40 transition-all duration-300 text-white">
                <a href={secondaryCtaLink}>{secondaryCtaText}</a>
              </Button>
            )}
          </div>

          {/* Seductive trust indicator */}
          <div className="pt-12 flex flex-col sm:flex-row items-center gap-4 text-base">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className="w-7 h-7 text-red-500 fill-current drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
            <span className="font-bold text-gray-200 drop-shadow-lg text-xl tracking-wide">Trusted by romance readers craving more</span>
          </div>
        </div>
      </div>
    </section>
  )
}
