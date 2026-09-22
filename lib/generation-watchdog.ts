import { prisma } from '@/lib/db'

// Execute routes have a 300s Vercel maxDuration, enforced by a hard kill that
// bypasses their own try/catch - so a story can freeze at GENERATING (or,
// more rarely, PENDING) forever with no error and no refund. This threshold
// gives real generations headroom above that 300s budget before being
// treated as dead.
const STUCK_THRESHOLD_MS = 7 * 60 * 1000

export async function reapStuckGenerations(userId?: string): Promise<number> {
  const cutoff = new Date(Date.now() - STUCK_THRESHOLD_MS)

  const stuck = await prisma.story.findMany({
    where: {
      generationStatus: { in: ['PENDING', 'GENERATING'] },
      updatedAt: { lt: cutoff },
      ...(userId ? { userId } : {}),
    },
    select: { id: true, userId: true, isCustom: true },
  })

  for (const story of stuck) {
    await prisma.story.update({
      where: { id: story.id },
      data: {
        generationStatus: 'FAILED',
        generationError: 'Generation timed out and was automatically marked as failed.',
      },
    })

    // Only custom (user-facing, credit-charged) stories need a refund -
    // admin-generated stories don't deduct credits.
    if (story.isCustom && story.userId) {
      await prisma.user.update({
        where: { id: story.userId },
        data: { credits: { increment: 1 } },
      })
      await prisma.creditTransaction.create({
        data: {
          userId: story.userId,
          storyId: story.id,
          amount: 1,
          type: 'REFUND',
          description: 'Story generation timed out - credit automatically refunded',
        },
      })
    }
  }

  return stuck.length
}
