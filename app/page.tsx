import { Navbar } from '@/components/landing/navbar'
import { Hero } from '@/components/landing/hero'
import { Features } from '@/components/landing/features'
import { Pricing } from '@/components/landing/pricing'
import { Footer } from '@/components/landing/footer'
import { Heart, Sparkles, Mail } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        logo="YourApp"
        links={[
          { href: '/stories', label: 'Stories' },
          { href: '#features', label: 'Features' },
          { href: '#pricing', label: 'Pricing' },
        ]}
      />

      <main className="flex-1">
        <Hero
          title="Welcome to Your SaaS"
          subtitle="A modern starter template with authentication, payments, and beautiful components ready to customize for your next project."
          ctaText="Get Started"
          ctaLink="/signup"
        />

        <Features
          title="Everything you need"
          subtitle="Built with modern tools and ready to customize for your use case"
          features={[
            {
              icon: <Heart className="h-10 w-10 text-red-500" />,
              title: 'Easy to Use',
              description: 'Simple, intuitive interface that works right out of the box'
            },
            {
              icon: <Sparkles className="h-10 w-10 text-yellow-500" />,
              title: 'Powerful Features',
              description: 'Everything you need to build and scale your SaaS'
            },
            {
              icon: <Mail className="h-10 w-10 text-blue-500" />,
              title: 'Stay Connected',
              description: 'Keep your users engaged with built-in email functionality'
            }
          ]}
        />

        <div id="pricing">
          <Pricing
            title="Simple Pricing"
            subtitle="Choose the plan that works for you"
            tiers={[
              {
                name: 'Starter',
                price: '$9',
                description: 'Perfect for trying out',
                features: [
                  'Feature 1',
                  'Feature 2',
                  'Feature 3',
                  'Email support'
                ],
                cta: 'Get Started',
                ctaLink: '/signup'
              },
              {
                name: 'Pro',
                price: '$29',
                description: 'For serious users',
                features: [
                  'All Starter features',
                  'Feature 4',
                  'Feature 5',
                  'Priority support'
                ],
                cta: 'Get Started',
                ctaLink: '/signup',
                popular: true
              }
            ]}
          />
        </div>
      </main>

      <Footer
        logo="YourApp"
        description="A modern SaaS starter template"
        sections={[
          {
            title: 'Product',
            links: [
              { label: 'Features', href: '#features' },
              { label: 'Pricing', href: '#pricing' }
            ]
          },
          {
            title: 'Company',
            links: [
              { label: 'About', href: '/about' },
              { label: 'Contact', href: '/contact' }
            ]
          },
          {
            title: 'Legal',
            links: [
              { label: 'Privacy', href: '/privacy' },
              { label: 'Terms', href: '/terms' }
            ]
          }
        ]}
      />
    </div>
  )
}
