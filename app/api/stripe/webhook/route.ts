import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe, getTierFromPriceId, TIER_CREDITS } from '@/lib/stripe'
import { prisma } from '@/lib/db'
import {
  notifyAdminPaymentFailed,
  notifyAdminError,
  notifyAdminSubscriptionCancelled,
  sendSubscriptionConfirmationEmail,
  sendCreditsRenewedEmail,
  sendSubscriptionCancelledEmail,
} from '@/lib/email'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  console.log('Webhook event received:', event.type)

  try {
    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdate(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break

      case 'invoice.payment_succeeded':
        await handleInvoicePayment(event.data.object as Stripe.Invoice)
        break

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)

    // Notify admin of webhook error
    if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 'your-resend-api-key-here') {
      try {
        await notifyAdminError({
          context: `Stripe Webhook: ${event.type}`,
          error: error instanceof Error ? error.message : String(error),
        })
      } catch (notifyError) {
        console.error('Failed to notify admin of webhook error:', notifyError)
      }
    }

    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

// Handle successful checkout (one-time credit purchase or initial subscription)
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId
  if (!userId) {
    console.error('No userId in checkout session metadata')
    return
  }

  console.log('Checkout completed for user:', userId, 'Mode:', session.mode)

  // Handle one-time credit purchase
  if (session.mode === 'payment') {
    await prisma.user.update({
      where: { id: userId },
      data: { credits: { increment: 1 } },
    })

    await prisma.creditTransaction.create({
      data: {
        userId,
        amount: 1,
        type: 'PURCHASE',
        description: 'One-time story credit purchase',
      },
    })

    console.log('Added 1 credit for one-time purchase:', userId)
  }

  // Subscriptions are handled by subscription.created event
}

// Handle subscription creation or update
async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string
  const priceId = subscription.items.data[0]?.price.id

  if (!priceId) {
    console.error('No price ID in subscription')
    return
  }

  // Determine tier from price ID
  const tier = getTierFromPriceId(priceId)
  if (!tier) {
    console.error('Unknown price ID:', priceId)
    return
  }

  const monthlyCredits = TIER_CREDITS[tier]
  // @ts-ignore - Stripe types are incorrect
  const periodEndTimestamp: number = subscription.current_period_end || Math.floor(Date.now() / 1000)
  const periodEnd = new Date(periodEndTimestamp * 1000)
  const nextResetDate = new Date(periodEnd)

  console.log('Subscription update:', { tier, monthlyCredits, customerId })

  // Find user by Stripe customer ID
  const user = await prisma.user.findUnique({
    where: { stripeCustomerId: customerId },
  })

  if (!user) {
    console.error('No user found for Stripe customer:', customerId)
    return
  }

  // Check if this is a new subscription or upgrade/downgrade
  const isNewSubscription = !user.stripeSubscriptionId || user.stripeSubscriptionId !== subscription.id

  // Update user subscription info
  await prisma.user.update({
    where: { id: user.id },
    data: {
      stripeSubscriptionId: subscription.id,
      stripePriceId: priceId,
      stripeCurrentPeriodEnd: periodEnd,
      subscriptionTier: tier,
      monthlyCredits,
      creditsResetAt: nextResetDate,
      // For new subscriptions or upgrades, grant credits immediately
      ...(isNewSubscription && { credits: { increment: monthlyCredits } }),
    },
  })

  // Log subscription transaction
  await prisma.subscriptionHistory.create({
    data: {
      userId: user.id,
      tier,
      amount: subscription.items.data[0].price.unit_amount || 0,
    },
  })

  // Grant credits for new subscription
  if (isNewSubscription && monthlyCredits > 0) {
    await prisma.creditTransaction.create({
      data: {
        userId: user.id,
        amount: monthlyCredits,
        type: 'SUBSCRIPTION',
        description: `${tier} subscription credits granted`,
      },
    })

    console.log(`Granted ${monthlyCredits} credits for ${tier} subscription:`, user.id)

    // Send subscription confirmation email
    if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 'your-resend-api-key-here') {
      try {
        await sendSubscriptionConfirmationEmail({
          to: user.email,
          userName: user.name || 'Reader',
          tier,
          credits: monthlyCredits,
        })
        console.log(`Subscription confirmation email sent to ${user.email}`)
      } catch (emailError) {
        console.error('Failed to send subscription confirmation email:', emailError)
      }
    }
  }
}

// Handle subscription cancellation
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string

  console.log('Subscription deleted for customer:', customerId)

  // Get user before updating to send cancellation email
  const user = await prisma.user.findUnique({
    where: { stripeCustomerId: customerId },
  })

  await prisma.user.updateMany({
    where: { stripeCustomerId: customerId },
    data: {
      stripeSubscriptionId: null,
      stripePriceId: null,
      stripeCurrentPeriodEnd: null,
      subscriptionTier: 'FREE',
      monthlyCredits: 0,
      creditsResetAt: null,
      // Note: We keep existing credits - they don't expire when subscription ends
    },
  })

  console.log('User downgraded to FREE tier')

  // Send subscription cancelled email and notify admin
  if (user && process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 'your-resend-api-key-here') {
    try {
      await sendSubscriptionCancelledEmail({
        to: user.email,
        userName: user.name || 'Reader',
        remainingCredits: user.credits,
      })
      console.log(`Subscription cancelled email sent to ${user.email}`)
    } catch (emailError) {
      console.error('Failed to send subscription cancelled email:', emailError)
    }

    // Notify admin of cancellation
    try {
      await notifyAdminSubscriptionCancelled({
        userName: user.name || 'Anonymous',
        userEmail: user.email,
        tier: user.subscriptionTier,
      })
    } catch (notifyError) {
      console.error('Failed to notify admin of cancellation:', notifyError)
    }
  }
}

// Handle successful recurring payment (monthly renewal)
async function handleInvoicePayment(invoice: Stripe.Invoice) {
  // @ts-ignore - Stripe types are incorrect
  const subscriptionId: string | null = invoice.subscription

  if (!subscriptionId) {
    // This is a one-time payment, already handled in checkout.session.completed
    return
  }

  console.log('Invoice payment succeeded for subscription:', subscriptionId)

  // Find user by subscription ID
  const user = await prisma.user.findFirst({
    where: { stripeSubscriptionId: subscriptionId },
  })

  if (!user) {
    console.error('No user found for subscription:', subscriptionId)
    return
  }

  // Check if this is a renewal (not the first payment)
  // @ts-ignore - Stripe types are incorrect
  const isRenewal = invoice.billing_reason === 'subscription_cycle'

  if (isRenewal && user.monthlyCredits > 0) {
    // Reset credits for the new billing period
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
    // @ts-ignore - Stripe types are incorrect
    const periodEndTimestamp: number = subscription.current_period_end || Math.floor(Date.now() / 1000)
    const nextResetDate = new Date(periodEndTimestamp * 1000)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        credits: user.monthlyCredits, // Reset to monthly allocation
        creditsResetAt: nextResetDate,
        stripeCurrentPeriodEnd: nextResetDate,
      },
    })

    await prisma.creditTransaction.create({
      data: {
        userId: user.id,
        amount: user.monthlyCredits,
        type: 'SUBSCRIPTION',
        description: 'Monthly credits reset',
      },
    })

    console.log(`Reset ${user.monthlyCredits} credits for renewal:`, user.id)

    // Send credits renewed email
    if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 'your-resend-api-key-here') {
      try {
        await sendCreditsRenewedEmail({
          to: user.email,
          userName: user.name || 'Reader',
          credits: user.monthlyCredits,
          tier: user.subscriptionTier,
        })
        console.log(`Credits renewed email sent to ${user.email}`)
      } catch (emailError) {
        console.error('Failed to send credits renewed email:', emailError)
      }
    }
  }

  // Record payment in history
  await prisma.subscriptionHistory.create({
    data: {
      userId: user.id,
      tier: user.subscriptionTier,
      stripeInvoiceId: invoice.id,
      amount: invoice.amount_paid,
    },
  })
}

// Handle failed payment
async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string

  console.error('Payment failed for customer:', customerId)

  // Get customer email from Stripe
  try {
    const customer = await stripe.customers.retrieve(customerId)
    if (customer && !customer.deleted) {
      const customerEmail = customer.email || 'unknown'

      // Notify admin of failed payment
      if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 'your-resend-api-key-here') {
        await notifyAdminPaymentFailed({
          customerEmail,
          amount: invoice.amount_due,
        })
      }
    }
  } catch (error) {
    console.error('Failed to notify admin of payment failure:', error)
  }
}
