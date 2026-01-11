# Stripe Payment Integration - Implementation Plan

## Overview
Implement 3-tier subscription model with Stripe for Silk Stories

**Pricing Tiers:**
- Free: $0 - Unlimited curated reading, 0 custom credits
- Starter: $6.99/month - 3 custom story credits/month
- Plus: $11.99/month - 8 custom story credits/month
- Unlimited: $19.99/month - Unlimited custom stories (fair use: 2/day)
- Add-on Credits: $3.99 per story

---

## Phase 1: Database & Schema Updates

### 1.1 Update Prisma Schema
**File:** `prisma/schema.prisma`

Add to User model:
```prisma
model User {
  // ... existing fields

  // Subscription fields
  stripeCustomerId       String?   @unique
  stripeSubscriptionId   String?   @unique
  stripePriceId          String?
  stripeCurrentPeriodEnd DateTime?
  subscriptionTier       SubscriptionTier @default(FREE)
  monthlyCredits         Int       @default(0)  // Credits allocated per month
  creditsResetAt         DateTime? // When monthly credits reset
}

enum SubscriptionTier {
  FREE
  STARTER
  PLUS
  UNLIMITED
}
```

Add Subscription history model:
```prisma
model SubscriptionHistory {
  id              String   @id @default(cuid())
  userId          String
  tier            SubscriptionTier
  stripeInvoiceId String?
  amount          Int      // in cents
  createdAt       DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}
```

Add Credit transaction model:
```prisma
model CreditTransaction {
  id              String   @id @default(cuid())
  userId          String
  amount          Int      // positive = added, negative = used
  type            CreditTransactionType
  description     String?
  storyId         String?
  createdAt       DateTime @default(now())

  user  User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  story Story? @relation(fields: [storyId], references: [id], onDelete: SetNull)

  @@index([userId])
}

enum CreditTransactionType {
  PURCHASE        // One-time credit purchase
  SUBSCRIPTION    // Monthly subscription credits
  SIGNUP_BONUS    // Initial signup credits
  ADMIN_GRANT     // Admin manually added credits
  STORY_GENERATION // Credit used for story
  REFUND          // Credit refunded
}
```

**Commands:**
```bash
npx prisma db push
npx prisma generate
```

---

## Phase 2: Stripe Account Setup

### 2.1 Create Stripe Account
1. Go to https://stripe.com
2. Sign up with business email (garethpark@yahoo.com)
3. Complete business profile
4. Enable Test Mode

### 2.2 Create Products & Prices in Stripe Dashboard

**Product 1: Starter Subscription**
- Name: "Silk Stories - Starter"
- Description: "3 custom story credits per month"
- Price: $6.99/month recurring
- Copy Price ID (e.g., `price_xxxxx`)

**Product 2: Plus Subscription**
- Name: "Silk Stories - Plus"
- Description: "8 custom story credits per month"
- Price: $11.99/month recurring
- Mark as "Popular" in metadata
- Copy Price ID

**Product 3: Unlimited Subscription**
- Name: "Silk Stories - Unlimited"
- Description: "Unlimited custom stories (fair use: 2/day)"
- Price: $19.99/month recurring
- Copy Price ID

**Product 4: Story Credit (One-time)**
- Name: "Story Credit"
- Description: "One custom story generation credit"
- Price: $3.99 one-time payment
- Copy Price ID

### 2.3 Get API Keys
1. Developers → API Keys
2. Copy "Publishable key" (starts with `pk_test_`)
3. Copy "Secret key" (starts with `sk_test_`)
4. Save to `.env.local`:
```env
STRIPE_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx (get this in Phase 4)

# Stripe Price IDs
STRIPE_PRICE_STARTER=price_xxxxx
STRIPE_PRICE_PLUS=price_xxxxx
STRIPE_PRICE_UNLIMITED=price_xxxxx
STRIPE_PRICE_CREDIT=price_xxxxx
```

---

## Phase 3: Core Stripe Integration

### 3.1 Install Dependencies
```bash
npm install stripe @stripe/stripe-js
```

### 3.2 Create Stripe Client
**File:** `lib/stripe.ts`
```typescript
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
})

// Price ID mappings
export const STRIPE_PRICES = {
  STARTER: process.env.STRIPE_PRICE_STARTER!,
  PLUS: process.env.STRIPE_PRICE_PLUS!,
  UNLIMITED: process.env.STRIPE_PRICE_UNLIMITED!,
  CREDIT: process.env.STRIPE_PRICE_CREDIT!,
} as const

// Credit allocations per tier
export const TIER_CREDITS = {
  FREE: 0,
  STARTER: 3,
  PLUS: 8,
  UNLIMITED: 999, // Effectively unlimited
} as const

export const TIER_PRICES = {
  STARTER: 6.99,
  PLUS: 11.99,
  UNLIMITED: 19.99,
  CREDIT: 3.99,
} as const
```

### 3.3 Create Checkout Session API
**File:** `app/api/stripe/create-checkout/route.ts`
```typescript
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

    // Get or create Stripe customer
    let customerId = user.stripeCustomerId
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { userId: user.id },
      })
      customerId = customer.id

      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId },
      })
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode,
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      metadata: { userId: user.id },
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
```

### 3.4 Create Customer Portal API
**File:** `app/api/stripe/create-portal/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth/session'
import { stripe } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user?.stripeCustomerId) {
      return NextResponse.json({ error: 'No subscription found' }, { status: 400 })
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Portal error:', error)
    return NextResponse.json(
      { error: 'Failed to create portal session' },
      { status: 500 }
    )
  }
}
```

---

## Phase 4: Webhook Handler

### 4.1 Create Webhook Endpoint
**File:** `app/api/stripe/webhook/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe, STRIPE_PRICES, TIER_CREDITS } from '@/lib/stripe'
import { prisma } from '@/lib/db'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = (await headers()).get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Handle events
  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
      break
    case 'customer.subscription.updated':
    case 'customer.subscription.created':
      await handleSubscriptionUpdate(event.data.object as Stripe.Subscription)
      break
    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
      break
    case 'invoice.payment_succeeded':
      await handleInvoicePayment(event.data.object as Stripe.Invoice)
      break
  }

  return NextResponse.json({ received: true })
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId
  if (!userId) return

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
        description: 'Story credit purchase',
      },
    })
  }
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.userId
  const priceId = subscription.items.data[0].price.id

  // Determine tier from price ID
  let tier: string
  let monthlyCredits: number

  if (priceId === STRIPE_PRICES.STARTER) {
    tier = 'STARTER'
    monthlyCredits = TIER_CREDITS.STARTER
  } else if (priceId === STRIPE_PRICES.PLUS) {
    tier = 'PLUS'
    monthlyCredits = TIER_CREDITS.PLUS
  } else if (priceId === STRIPE_PRICES.UNLIMITED) {
    tier = 'UNLIMITED'
    monthlyCredits = TIER_CREDITS.UNLIMITED
  } else {
    return
  }

  const periodEnd = new Date(subscription.current_period_end * 1000)

  // Update user subscription
  await prisma.user.update({
    where: { id: userId },
    data: {
      stripeSubscriptionId: subscription.id,
      stripePriceId: priceId,
      stripeCurrentPeriodEnd: periodEnd,
      subscriptionTier: tier,
      monthlyCredits,
      creditsResetAt: periodEnd,
    },
  })

  // Grant monthly credits
  await prisma.creditTransaction.create({
    data: {
      userId,
      amount: monthlyCredits,
      type: 'SUBSCRIPTION',
      description: `${tier} subscription credits`,
    },
  })
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string

  await prisma.user.updateMany({
    where: { stripeCustomerId: customerId },
    data: {
      stripeSubscriptionId: null,
      stripePriceId: null,
      stripeCurrentPeriodEnd: null,
      subscriptionTier: 'FREE',
      monthlyCredits: 0,
    },
  })
}

async function handleInvoicePayment(invoice: Stripe.Invoice) {
  const subscription = invoice.subscription as string

  if (!subscription) return

  // Record payment in history
  const user = await prisma.user.findFirst({
    where: { stripeSubscriptionId: subscription },
  })

  if (!user) return

  await prisma.subscriptionHistory.create({
    data: {
      userId: user.id,
      tier: user.subscriptionTier,
      stripeInvoiceId: invoice.id,
      amount: invoice.amount_paid,
    },
  })
}
```

### 4.2 Configure Webhook in Stripe
1. Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://readsilk.com/api/stripe/webhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
4. Copy "Signing secret" → add to `.env` as `STRIPE_WEBHOOK_SECRET`

---

## Phase 5: Credit System Logic

### 5.1 Credit Utility Functions
**File:** `lib/credits.ts`
```typescript
import { prisma } from './db'
import { TIER_CREDITS } from './stripe'

export async function getUserCredits(userId: string): Promise<number> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      credits: true,
      subscriptionTier: true,
      creditsResetAt: true,
      monthlyCredits: true,
    },
  })

  if (!user) return 0

  // Check if monthly credits need reset
  if (user.creditsResetAt && new Date() >= user.creditsResetAt) {
    await resetMonthlyCredits(userId, user.subscriptionTier)
    return user.monthlyCredits
  }

  // For UNLIMITED tier, check daily usage (max 2/day)
  if (user.subscriptionTier === 'UNLIMITED') {
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    const usedToday = await prisma.creditTransaction.count({
      where: {
        userId,
        type: 'STORY_GENERATION',
        createdAt: { gte: todayStart },
      },
    })

    return usedToday >= 2 ? 0 : 999 // 0 if limit reached, 999 otherwise
  }

  return user.credits
}

export async function useCredit(userId: string, storyId: string): Promise<boolean> {
  const credits = await getUserCredits(userId)

  if (credits <= 0) return false

  await prisma.user.update({
    where: { id: userId },
    data: { credits: { decrement: 1 } },
  })

  await prisma.creditTransaction.create({
    data: {
      userId,
      storyId,
      amount: -1,
      type: 'STORY_GENERATION',
      description: 'Custom story generated',
    },
  })

  return true
}

async function resetMonthlyCredits(userId: string, tier: string) {
  const monthlyCredits = TIER_CREDITS[tier as keyof typeof TIER_CREDITS] || 0
  const nextReset = new Date()
  nextReset.setMonth(nextReset.getMonth() + 1)

  await prisma.user.update({
    where: { id: userId },
    data: {
      credits: monthlyCredits,
      creditsResetAt: nextReset,
    },
  })

  if (monthlyCredits > 0) {
    await prisma.creditTransaction.create({
      data: {
        userId,
        amount: monthlyCredits,
        type: 'SUBSCRIPTION',
        description: 'Monthly credits reset',
      },
    })
  }
}

export async function canGenerateStory(userId: string): Promise<{
  canGenerate: boolean
  reason?: string
  creditsRemaining: number
}> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { subscriptionTier: true },
  })

  if (!user) {
    return { canGenerate: false, reason: 'User not found', creditsRemaining: 0 }
  }

  const credits = await getUserCredits(userId)

  if (credits <= 0) {
    if (user.subscriptionTier === 'UNLIMITED') {
      return {
        canGenerate: false,
        reason: 'Daily limit reached (2 stories/day). Try again tomorrow!',
        creditsRemaining: 0,
      }
    }
    return {
      canGenerate: false,
      reason: 'No credits remaining. Purchase more or upgrade your plan!',
      creditsRemaining: 0,
    }
  }

  return { canGenerate: true, creditsRemaining: credits }
}
```

### 5.2 Update Story Generation to Check Credits
**File:** `app/api/generate-story/route.ts`
Add credit check before generation:
```typescript
import { canGenerateStory, useCredit } from '@/lib/credits'

// Before generating story:
const creditCheck = await canGenerateStory(user.id)
if (!creditCheck.canGenerate) {
  return NextResponse.json(
    { error: creditCheck.reason },
    { status: 403 }
  )
}

// After story created successfully:
await useCredit(user.id, story.id)
```

---

## Phase 6: Update UI Components

### 6.1 Update Pricing Page
**File:** `app/page.tsx`
Update pricing tiers:
```typescript
{
  name: 'Starter',
  price: '$6.99',
  period: '/month',
  description: 'Perfect for occasional custom stories',
  features: [
    'Everything in Free',
    '3 custom story credits per month',
    'Full character customization',
    '6,000-8,000 word stories',
    'Priority generation queue',
  ],
  cta: 'Start Creating',
  ctaLink: '/signup'
},
{
  name: 'Plus',
  price: '$11.99',
  period: '/month',
  description: 'For avid readers who want their perfect stories',
  features: [
    'Everything in Starter',
    '8 custom story credits per month',
    'Extended stories (8,000-10,000 words)',
    'Early access to new features',
    'Same price as Kindle Unlimited!',
  ],
  cta: 'Go Plus',
  ctaLink: '/signup',
  popular: true
},
{
  name: 'Unlimited',
  price: '$19.99',
  period: '/month',
  description: 'For true romantics who can\'t get enough',
  features: [
    'Everything in Plus',
    'Unlimited custom stories',
    'Fair use: 2 stories per day',
    'VIP support',
    'Beta features early access',
  ],
  cta: 'Go Unlimited',
  ctaLink: '/signup'
}
```

### 6.2 Create Pricing/Upgrade Page
**File:** `app/pricing/page.tsx`
Full pricing page with Stripe checkout integration

### 6.3 Update Dashboard to Show Credits
**File:** `app/dashboard/page.tsx`
Add credit display and manage subscription button

### 6.4 Create Stripe Checkout Component
**File:** `components/stripe/checkout-button.tsx`
Button to initiate Stripe checkout

---

## Phase 7: Testing

### 7.1 Test Scenarios
- [ ] Free user signup
- [ ] Starter subscription purchase
- [ ] Plus subscription purchase
- [ ] Unlimited subscription purchase
- [ ] One-time credit purchase
- [ ] Story generation with credits
- [ ] Credit deduction after generation
- [ ] Monthly credit reset
- [ ] Unlimited daily limit (2/day)
- [ ] Subscription upgrade
- [ ] Subscription downgrade
- [ ] Subscription cancellation
- [ ] Payment failure handling
- [ ] Customer portal access

### 7.2 Stripe Test Cards
```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
3D Secure: 4000 0025 0000 3155
```

---

## Phase 8: Production Deployment

### 8.1 Switch to Live Mode
1. Stripe Dashboard → Toggle to "Live mode"
2. Create same products/prices in live mode
3. Get live API keys
4. Update Vercel environment variables:
   - `STRIPE_SECRET_KEY` (live key)
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (live key)
   - `STRIPE_WEBHOOK_SECRET` (live webhook secret)
   - Price IDs (live price IDs)

### 8.2 Configure Live Webhook
1. Add webhook endpoint: `https://readsilk.com/api/stripe/webhook`
2. Select same events as test
3. Copy signing secret

### 8.3 Enable Payment Methods
1. Stripe Dashboard → Settings → Payment methods
2. Enable: Cards, Apple Pay, Google Pay

### 8.4 Set Up Business Details
1. Complete business profile
2. Add bank account for payouts
3. Configure tax settings if needed

---

## Phase 9: Post-Launch Monitoring

### 9.1 Metrics to Track
- Conversion rate (free → paid)
- MRR (Monthly Recurring Revenue)
- Churn rate
- ARPU (Average Revenue Per User)
- Credit usage patterns
- Failed payments

### 9.2 Stripe Dashboard Monitoring
- Dashboard → Analytics
- Set up email alerts for failed payments
- Monitor subscription metrics

---

## Timeline Estimate

- **Phase 1-2**: 2 hours (Database + Stripe setup)
- **Phase 3-4**: 4 hours (Core integration + webhooks)
- **Phase 5**: 2 hours (Credit system)
- **Phase 6**: 3 hours (UI updates)
- **Phase 7**: 3 hours (Testing)
- **Phase 8**: 1 hour (Production deployment)

**Total: ~15 hours of development**

---

## Environment Variables Checklist

```env
# Stripe Test Keys
STRIPE_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Stripe Price IDs (Test)
STRIPE_PRICE_STARTER=price_xxxxx
STRIPE_PRICE_PLUS=price_xxxxx
STRIPE_PRICE_UNLIMITED=price_xxxxx
STRIPE_PRICE_CREDIT=price_xxxxx

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000 (test) / https://readsilk.com (prod)
```

---

## Success Criteria

- ✅ Users can subscribe to any tier
- ✅ Credits are correctly allocated and deducted
- ✅ Monthly credits reset automatically
- ✅ Unlimited tier respects 2/day limit
- ✅ Users can manage subscriptions via portal
- ✅ Webhooks process all events correctly
- ✅ Payment failures are handled gracefully
- ✅ UI shows correct tier and credits
- ✅ One-time credits can be purchased
- ✅ All transactions are logged

---

**Created:** 2026-01-11
**Last Updated:** 2026-01-11
**Status:** Ready to implement
