import { NextResponse } from 'next/server'
import { stripe, STRIPE_PRICES } from '@/lib/stripe'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const testAll = searchParams.get('all') === 'true'

  try {
    // Test 1: Retrieve account
    const account = await stripe.accounts.retrieve()

    // Test 2: Create a test customer
    const customer = await stripe.customers.create({
      email: 'test@example.com',
      metadata: { test: 'true' }
    })

    const results: Record<string, any> = {
      accountId: account.id,
      prices: {}
    }

    // Test all prices if requested
    const pricesToTest = testAll
      ? [
          { name: 'STARTER', price: STRIPE_PRICES.STARTER, mode: 'subscription' as const },
          { name: 'PLUS', price: STRIPE_PRICES.PLUS, mode: 'subscription' as const },
          { name: 'UNLIMITED', price: STRIPE_PRICES.UNLIMITED, mode: 'subscription' as const },
          { name: 'CREDIT', price: STRIPE_PRICES.CREDIT, mode: 'payment' as const },
        ]
      : [{ name: 'STARTER', price: STRIPE_PRICES.STARTER, mode: 'subscription' as const }]

    for (const { name, price, mode } of pricesToTest) {
      try {
        const session = await stripe.checkout.sessions.create({
          customer: customer.id,
          mode,
          payment_method_types: ['card'],
          line_items: [{ price, quantity: 1 }],
          success_url: 'https://www.readsilk.com/dashboard?success=true',
          cancel_url: 'https://www.readsilk.com/pricing?canceled=true',
        })
        results.prices[name] = { success: true, priceId: price, sessionCreated: true }
      } catch (err: any) {
        results.prices[name] = { success: false, priceId: price, error: err?.message }
      }
    }

    // Clean up test customer
    await stripe.customers.del(customer.id)

    const allPassed = Object.values(results.prices).every((p: any) => p.success)

    return NextResponse.json({
      success: allPassed,
      ...results,
      message: allPassed ? 'All Stripe tests passed' : 'Some tests failed'
    })
  } catch (error: any) {
    console.error('Stripe test error:', error)
    return NextResponse.json({
      success: false,
      error: error?.message || 'Unknown error',
      type: error?.type || 'unknown',
      code: error?.code || 'unknown',
    }, { status: 500 })
  }
}
