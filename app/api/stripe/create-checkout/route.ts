import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth/session'
import { stripe, STRIPE_PRICES } from '@/lib/stripe'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { priceId, mode = 'subscription' } = await request.json()

    // Log for debugging
    console.log('Checkout request - priceId:', priceId)
    console.log('Valid prices from env:', STRIPE_PRICES)

    // Validate price ID - check if it starts with price_ (basic validation)
    if (!priceId || !priceId.startsWith('price_')) {
      return NextResponse.json({ error: 'Invalid price ID format' }, { status: 400 })
    }

    // Get or create Stripe customer
    let customerId = user.stripeCustomerId

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name || undefined,
        metadata: {
          userId: user.id,
        },
      })
      customerId = customer.id

      // Save customer ID to database
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId },
      })
    }

    // Determine mode based on price ID or mode parameter
    // Credit pack price ID for one-time payments
    const creditPriceId = process.env.STRIPE_PRICE_CREDIT || 'price_1SqJ3FKjruuOoDVKX8WUvc76'
    const isOneTime = priceId === creditPriceId || mode === 'payment'
    const sessionMode = isOneTime ? 'payment' : 'subscription'

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: sessionMode,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
      metadata: {
        userId: user.id,
      },
      allow_promotion_codes: true, // Allow discount codes
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
