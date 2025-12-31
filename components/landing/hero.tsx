import { Button } from '@/components/ui/button'

interface HeroProps {
  title: string
  subtitle: string
  ctaText?: string
  ctaLink?: string
}

export function Hero({ title, subtitle, ctaText = 'Get Started', ctaLink = '/signup' }: HeroProps) {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              {title}
            </h1>
            <p className="mx-auto max-w-[700px] text-slate-500 md:text-xl">
              {subtitle}
            </p>
          </div>
          <div className="space-x-4">
            <Button asChild size="lg">
              <a href={ctaLink}>{ctaText}</a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="#features">Learn More</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
