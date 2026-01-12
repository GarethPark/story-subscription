'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Crown, Loader2, Settings } from 'lucide-react'
import Link from 'next/link'

interface SubscriptionCardProps {
  tier: string
  monthlyCredits: number
  creditsResetAt: Date | null
  stripeCustomerId: string | null
}

export function SubscriptionCard({
  tier,
  monthlyCredits,
  creditsResetAt,
  stripeCustomerId,
}: SubscriptionCardProps) {
  const [isLoading, setIsLoading] = useState(false)

  const getTierInfo = (tier: string) => {
    switch (tier) {
      case 'STARTER':
        return { name: 'Starter', color: 'from-purple-600 to-purple-800', price: '$6.99/mo' }
      case 'PLUS':
        return { name: 'Plus', color: 'from-rose-600 to-rose-800', price: '$11.99/mo' }
      case 'UNLIMITED':
        return { name: 'Unlimited', color: 'from-violet-600 to-violet-800', price: '$19.99/mo' }
      default:
        return { name: 'Free', color: 'from-gray-600 to-gray-800', price: '$0/mo' }
    }
  }

  const tierInfo = getTierInfo(tier)

  const handleManageSubscription = async () => {
    try {
      setIsLoading(true)

      const response = await fetch('/api/stripe/create-portal', {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to open billing portal')
      }

      // Redirect to Stripe customer portal
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Portal error:', error)
      alert(error instanceof Error ? error.message : 'Failed to open billing portal')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-rose-700/30 bg-gradient-to-br from-rose-950/50 via-gray-900/50 to-violet-950/30 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-['Playfair_Display'] text-white">
          <Crown className="h-6 w-6 text-rose-400" />
          Subscription
        </CardTitle>
        <CardDescription className="text-base text-gray-400">
          Your membership plan
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Tier Badge */}
          <div className="flex items-center justify-between">
            <Badge className={`bg-gradient-to-r ${tierInfo.color} text-white text-lg px-4 py-2`}>
              {tierInfo.name}
            </Badge>
            <span className="text-lg font-semibold text-white">{tierInfo.price}</span>
          </div>

          {/* Monthly Credits */}
          {tier !== 'FREE' && (
            <div className="bg-gray-800/50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Monthly Credits:</span>
                <span className="text-white font-semibold">
                  {tier === 'UNLIMITED' ? 'Unlimited (2/day)' : `${monthlyCredits} credits`}
                </span>
              </div>

              {creditsResetAt && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Next Reset:</span>
                  <span className="text-white">
                    {new Date(creditsResetAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col gap-2">
            {tier === 'FREE' ? (
              <Button
                className="w-full bg-gradient-to-r from-rose-700 to-violet-700 hover:from-rose-600 hover:to-violet-600"
                asChild
              >
                <Link href="/pricing">Upgrade to Premium</Link>
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="w-full border-rose-700/30 hover:bg-rose-950/30"
                  onClick={handleManageSubscription}
                  disabled={!stripeCustomerId || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <Settings className="mr-2 h-4 w-4" />
                      Manage Subscription
                    </>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  className="w-full text-gray-400 hover:text-white"
                  asChild
                >
                  <Link href="/pricing">Change Plan</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
