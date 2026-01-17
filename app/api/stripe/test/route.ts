import { NextResponse } from 'next/server'
import { stripe, STRIPE_PRICES } from '@/lib/stripe'

export async function GET() {
  try {
    // Test 1: Retrieve account
    const account = await stripe.accounts.retrieve()

    // Test 2: Try to create a test customer
    const customer = await stripe.customers.create({
      email: 'test@example.com',
      metadata: { test: 'true' }
    })

    // Test 3: Try to create a checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: STRIPE_PRICES.STARTER,
          quantity: 1,
        },
      ],
      success_url: 'https://www.readsilk.com/dashboard?success=true',
      cancel_url: 'https://www.readsilk.com/pricing?canceled=true',
    })

    // Clean up test customer
    await stripe.customers.del(customer.id)

    return NextResponse.json({
      success: true,
      accountId: account.id,
      sessionUrl: session.url,
      priceUsed: STRIPE_PRICES.STARTER,
      message: 'All Stripe tests passed'
    })
  } catch (error: any) {
    console.error('Stripe test error:', error)
    return NextResponse.json({
      success: false,
      error: error?.message || 'Unknown error',
      type: error?.type || 'unknown',
      code: error?.code || 'unknown',
      statusCode: error?.statusCode,
      priceEnv: STRIPE_PRICES.STARTER
    }, { status: 500 })
  }
}
