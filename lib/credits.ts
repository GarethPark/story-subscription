import { prisma } from './db'
import { TIER_CREDITS } from './stripe'

/**
 * Get user's available credits
 * Handles monthly resets and unlimited tier daily limits
 */
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
    await resetMonthlyCredits(userId, user.subscriptionTier, user.monthlyCredits)
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

    // Return 0 if daily limit reached, 999 otherwise (effectively unlimited)
    return usedToday >= 2 ? 0 : 999
  }

  return user.credits
}

/**
 * Use a credit for story generation
 * Returns true if successful, false if insufficient credits
 */
export async function useCredit(
  userId: string,
  storyId: string
): Promise<boolean> {
  const credits = await getUserCredits(userId)

  if (credits <= 0) return false

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { subscriptionTier: true },
  })

  if (!user) return false

  // For unlimited tier, we don't actually decrement credits
  // Just log the transaction for daily limit tracking
  if (user.subscriptionTier === 'UNLIMITED') {
    await prisma.creditTransaction.create({
      data: {
        userId,
        storyId,
        amount: -1,
        type: 'STORY_GENERATION',
        description: 'Story generated (Unlimited tier)',
      },
    })
    return true
  }

  // For other tiers, decrement credits
  await prisma.user.update({
    where: { id: userId },
    data: {
      credits: { decrement: 1 },
      creditsUsed: { increment: 1 },
    },
  })

  await prisma.creditTransaction.create({
    data: {
      userId,
      storyId,
      amount: -1,
      type: 'STORY_GENERATION',
      description: 'Story generated',
    },
  })

  return true
}

/**
 * Check if user can generate a story
 * Returns detailed information about credit availability
 */
export async function canGenerateStory(userId: string): Promise<{
  canGenerate: boolean
  reason?: string
  creditsRemaining: number
  tier: string
}> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      subscriptionTier: true,
      credits: true,
    },
  })

  if (!user) {
    return {
      canGenerate: false,
      reason: 'User not found',
      creditsRemaining: 0,
      tier: 'FREE',
    }
  }

  const credits = await getUserCredits(userId)

  if (credits <= 0) {
    if (user.subscriptionTier === 'UNLIMITED') {
      return {
        canGenerate: false,
        reason: 'Daily limit reached (2 stories/day). Try again tomorrow!',
        creditsRemaining: 0,
        tier: user.subscriptionTier,
      }
    }

    if (user.subscriptionTier === 'FREE') {
      return {
        canGenerate: false,
        reason: 'No credits remaining. Subscribe to generate custom stories!',
        creditsRemaining: 0,
        tier: user.subscriptionTier,
      }
    }

    return {
      canGenerate: false,
      reason: 'No credits remaining. Purchase more credits or upgrade your plan!',
      creditsRemaining: 0,
      tier: user.subscriptionTier,
    }
  }

  return {
    canGenerate: true,
    creditsRemaining: credits,
    tier: user.subscriptionTier,
  }
}

/**
 * Reset monthly credits for a user
 * Called automatically when credits expire
 */
async function resetMonthlyCredits(
  userId: string,
  tier: string,
  monthlyCredits: number
) {
  // Calculate next reset date (30 days from now)
  const nextReset = new Date()
  nextReset.setDate(nextReset.getDate() + 30)

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

    console.log(`Reset ${monthlyCredits} credits for user ${userId} (${tier})`)
  }
}

/**
 * Get credit transaction history for a user
 */
export async function getCreditHistory(
  userId: string,
  limit: number = 50
): Promise<
  Array<{
    id: string
    amount: number
    type: string
    description: string | null
    createdAt: Date
    story: { id: string; title: string } | null
  }>
> {
  const transactions = await prisma.creditTransaction.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      story: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  })

  return transactions
}

/**
 * Get user's subscription summary
 */
export async function getSubscriptionSummary(userId: string): Promise<{
  tier: string
  credits: number
  monthlyCredits: number
  creditsUsed: number
  nextResetDate: Date | null
  subscriptionEnds: Date | null
  canGenerate: boolean
}> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      subscriptionTier: true,
      credits: true,
      monthlyCredits: true,
      creditsUsed: true,
      creditsResetAt: true,
      stripeCurrentPeriodEnd: true,
    },
  })

  if (!user) {
    return {
      tier: 'FREE',
      credits: 0,
      monthlyCredits: 0,
      creditsUsed: 0,
      nextResetDate: null,
      subscriptionEnds: null,
      canGenerate: false,
    }
  }

  const credits = await getUserCredits(userId)
  const { canGenerate } = await canGenerateStory(userId)

  return {
    tier: user.subscriptionTier,
    credits,
    monthlyCredits: user.monthlyCredits,
    creditsUsed: user.creditsUsed,
    nextResetDate: user.creditsResetAt,
    subscriptionEnds: user.stripeCurrentPeriodEnd,
    canGenerate,
  }
}
