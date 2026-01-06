import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, Sparkles } from 'lucide-react'

interface PricingTier {
  name: string
  price: string
  period?: string
  description: string
  features: string[]
  cta: string
  ctaLink: string
  popular?: boolean
}

interface PricingProps {
  title?: string
  subtitle?: string
  tiers: PricingTier[]
}

export function Pricing({ title = 'Pricing', subtitle, tiers }: PricingProps) {
  return (
    <section className="w-full py-20 md:py-32 lg:py-40 bg-gradient-to-b from-white via-amber-50/20 to-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-6 text-center mb-16">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl font-['Playfair_Display'] text-gray-900">
              {title}
            </h2>
            {subtitle && (
              <p className="max-w-[800px] text-gray-600 text-lg md:text-xl leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3 items-start">
          {tiers.map((tier, index) => (
            <Card
              key={index}
              className={`relative ${
                tier.popular
                  ? 'border-rose-700 border-2 shadow-2xl scale-105 md:scale-110'
                  : 'border-rose-100/50'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-rose-700 to-violet-600 text-white px-6 py-1.5 rounded-full text-sm font-semibold shadow-lg flex items-center gap-1">
                  <Sparkles className="h-4 w-4" />
                  Most Popular
                </div>
              )}
              <CardHeader className="space-y-3 pt-8">
                <CardTitle className="text-2xl">{tier.name}</CardTitle>
                <CardDescription className="text-base">{tier.description}</CardDescription>
                <div className="pt-4">
                  <span className="text-5xl font-bold font-['Playfair_Display'] text-gray-900">{tier.price}</span>
                  {tier.period && <span className="text-gray-500 ml-1">{tier.period}</span>}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="h-5 w-5 mr-3 text-rose-700 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700 leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  asChild
                  className="w-full"
                  variant={tier.popular ? 'default' : 'outline'}
                  size="lg"
                >
                  <a href={tier.ctaLink}>{tier.cta}</a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
