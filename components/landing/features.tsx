import { ReactNode } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface Feature {
  icon: ReactNode
  title: string
  description: string
}

interface FeaturesProps {
  title?: string
  subtitle?: string
  features: Feature[]
}

export function Features({ title = 'Features', subtitle, features }: FeaturesProps) {
  return (
    <section id="features" className="w-full py-20 md:py-32 lg:py-40 bg-gradient-to-b from-white via-pink-50/30 to-white">
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
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="group cursor-default border-rose-100/50">
              <CardHeader className="space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
