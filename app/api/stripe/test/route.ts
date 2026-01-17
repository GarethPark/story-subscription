import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export async function GET() {
  try {
    // Simple test - just retrieve the Stripe account to verify connection
    const account = await stripe.accounts.retrieve()

    return NextResponse.json({
      success: true,
      accountId: account.id,
      message: 'Stripe connection successful'
    })
  } catch (error: any) {
    console.error('Stripe test error:', error)
    return NextResponse.json({
      success: false,
      error: error?.message || 'Unknown error',
      type: error?.type || 'unknown',
      code: error?.code || 'unknown',
      statusCode: error?.statusCode
    }, { status: 500 })
  }
}
