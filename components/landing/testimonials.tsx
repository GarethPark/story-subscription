import { Heart, Sparkles } from 'lucide-react'

interface Testimonial {
  id: string
  name: string
  quote: string
  impact?: string
}

interface TestimonialsProps {
  title?: string
  subtitle?: string
  testimonials: Testimonial[]
}

export function Testimonials({ title, subtitle, testimonials }: TestimonialsProps) {
  if (testimonials.length === 0) return null

  return (
    <section className="py-24 bg-gradient-to-b from-gray-950 via-gray-900 to-black relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-950/10 via-transparent to-violet-950/10" />
      <div className="absolute top-20 right-20 w-72 h-72 bg-rose-600/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        {(title || subtitle) && (
          <div className="text-center mb-16 px-4">
            {title && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-4">
                <Heart className="h-8 w-8 text-rose-500 fill-rose-500 flex-shrink-0" />
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-rose-400 via-pink-300 to-violet-400 bg-clip-text text-transparent font-['Playfair_Display']">
                  {title}
                </h2>
              </div>
            )}
            {subtitle && (
              <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-rose-600/20 to-violet-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100" />
              <div className="relative bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-rose-900/30 rounded-2xl p-8 hover:border-rose-700/50 transition-all duration-300 h-full flex flex-col">
                {/* Quote Icon */}
                <Sparkles className="h-6 w-6 text-rose-500 mb-4" />

                {/* Quote */}
                <blockquote className="text-gray-200 leading-relaxed mb-6 flex-1">
                  "{testimonial.quote}"
                </blockquote>

                {/* Impact Statement */}
                {testimonial.impact && (
                  <p className="text-rose-400 text-sm font-medium mb-4 italic">
                    {testimonial.impact}
                  </p>
                )}

                {/* Attribution */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-700">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-600 to-violet-600 flex items-center justify-center text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{testimonial.name}</p>
                    <p className="text-xs text-gray-500">Silk Stories Reader</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <p className="text-gray-400 mb-6">
            Join thousands of readers experiencing romance in a whole new way
          </p>
          <a
            href="/signup"
            className="inline-block px-8 py-4 bg-gradient-to-r from-rose-700 to-violet-700 hover:from-rose-600 hover:to-violet-600 text-white rounded-lg font-bold shadow-lg transition-all hover:shadow-rose-900/50 hover:scale-105"
          >
            Start Reading Free
          </a>
        </div>
      </div>
    </section>
  )
}
