'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Check, Sparkles, Zap, Infinity } from 'lucide-react'
import { CheckoutButton } from '@/components/stripe/checkout-button'
import Link from 'next/link'

export default function PricingPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user)
      })
      .finally(() => setLoading(false))
  }, [])

  const tiers = [
    {
      name: 'Starter',
      price: '$6.99',
      period: '/month',
      description: 'Perfect for occasional custom stories',
      icon: <Sparkles className="h-6 w-6 text-purple-500" />,
      features: [
        '3 custom story credits per month',
        'Full character customization',
        '6,000-8,000 word stories',
        'Priority generation queue',
        'Unlimited curated story reading',
      ],
      priceId: (process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER || 'price_1SqJ2NKjruuOoDVK5jj67hu0').trim(),
      popular: false,
    },
    {
      name: 'Plus',
      price: '$11.99',
      period: '/month',
      description: 'For avid readers who want their perfect stories',
      icon: <Zap className="h-6 w-6 text-rose-500" />,
      features: [
        '8 custom story credits per month',
        'Everything in Starter',
        'Extended stories (8,000-10,000 words)',
        'Early access to new features',
        'Same price as Kindle Unlimited!',
      ],
      priceId: (process.env.NEXT_PUBLIC_STRIPE_PRICE_PLUS || 'price_1SqJ2cKjruuOoDVKYwtkPmcG').trim(),
      popular: true,
    },
    {
      name: 'Unlimited',
      price: '$19.99',
      period: '/month',
      description: "For true romantics who can't get enough",
      icon: <Infinity className="h-6 w-6 text-violet-500" />,
      features: [
        'Unlimited custom stories',
        'Fair use: 2 stories per day',
        'Everything in Plus',
        'VIP support',
        'Beta features early access',
      ],
      priceId: (process.env.NEXT_PUBLIC_STRIPE_PRICE_UNLIMITED || 'price_1SqJ2sKjruuOoDVKn12a7VZ2').trim(),
      popular: false,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Header */}
      <div className="border-b border-rose-900/30 bg-gray-900/95 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-6">
          <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white">
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-white mt-4 font-['Playfair_Display']">
            Choose Your Romance Journey
          </h1>
          <p className="text-gray-400 mt-2">
            Start free, upgrade anytime for custom stories
          </p>
        </div>
      </div>

      {/* Current Plan Banner */}
      {user && user.subscriptionTier !== 'FREE' && (
        <div className="container mx-auto px-4 py-4">
          <Card className="bg-gradient-to-r from-rose-900/20 to-violet-900/20 border-rose-700/30 p-4">
            <p className="text-white">
              <span className="font-semibold">Current Plan:</span> {user.subscriptionTier}
              {user.credits > 0 && (
                <span className="ml-4 text-gray-300">
                  {user.credits} {user.credits === 1 ? 'credit' : 'credits'} remaining
                </span>
              )}
            </p>
          </Card>
        </div>
      )}

      {/* Pricing Cards */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {tiers.map((tier) => (
            <Card
              key={tier.name}
              className={`relative overflow-hidden ${
                tier.popular
                  ? 'border-2 border-rose-500 bg-gradient-to-b from-gray-900 to-gray-800'
                  : 'bg-gray-900/50 border-gray-800'
              }`}
            >
              {tier.popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-rose-600 to-violet-600 text-white px-4 py-1 text-sm font-semibold">
                  Most Popular
                </div>
              )}

              <div className="p-6">
                {/* Icon & Title */}
                <div className="flex items-center gap-3 mb-4">
                  {tier.icon}
                  <div>
                    <h3 className="text-2xl font-bold text-white font-['Playfair_Display']">
                      {tier.name}
                    </h3>
                    <p className="text-sm text-gray-400">{tier.description}</p>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <span className="text-5xl font-bold text-white">{tier.price}</span>
                  <span className="text-gray-400">{tier.period}</span>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-6">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-300">
                      <Check className="h-5 w-5 text-rose-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                {loading ? (
                  <div className="w-full py-3 bg-gray-800 rounded-lg text-center text-gray-400">
                    Loading...
                  </div>
                ) : !user ? (
                  <Link
                    href="/signup"
                    className="block w-full py-3 bg-gradient-to-r from-rose-700 to-violet-700 hover:from-rose-600 hover:to-violet-600 text-white rounded-lg font-semibold text-center transition-all"
                  >
                    Sign Up to Subscribe
                  </Link>
                ) : user.subscriptionTier === tier.name.toUpperCase() ? (
                  <div className="w-full py-3 bg-gray-800 rounded-lg text-center text-gray-400">
                    Current Plan
                  </div>
                ) : (
                  <CheckoutButton
                    priceId={tier.priceId}
                    label={user.subscriptionTier === 'FREE' ? 'Subscribe' : 'Change Plan'}
                    variant={tier.popular ? 'default' : 'outline'}
                    className={
                      tier.popular
                        ? 'w-full bg-gradient-to-r from-rose-700 to-violet-700 hover:from-rose-600 hover:to-violet-600'
                        : 'w-full'
                    }
                  />
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* One-time Credit Purchase */}
        <div className="mt-12 max-w-2xl mx-auto">
          <Card className="bg-gray-900/50 border-gray-800 p-6 text-left">
            <h3 className="text-xl font-bold text-white mb-2 font-['Playfair_Display']">
              Need Extra Credits?
            </h3>
            <p className="text-gray-400 mb-4 max-w-prose">
              Purchase individual story credits for $3.99 each. Credits never expire.
            </p>
            {!user ? (
              <Link
                href="/signup"
                className="inline-block px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-semibold transition-all"
              >
                Sign Up to Purchase
              </Link>
            ) : (
              <CheckoutButton
                priceId={
                  (process.env.NEXT_PUBLIC_STRIPE_PRICE_CREDIT || 'price_1SqJ3FKjruuOoDVKX8WUvc76').trim()
                }
                label="Buy 1 Credit - $3.99"
                variant="outline"
              />
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
