import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth/session'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { storyId, progress } = await request.json()

    if (!storyId) {
      return NextResponse.json({ error: 'Story ID required' }, { status: 400 })
    }

    // Upsert reading history (update if exists, create if not)
    const history = await prisma.readingHistory.upsert({
      where: {
        userId_storyId: {
          userId: user.id,
          storyId,
        },
      },
      update: {
        lastReadAt: new Date(),
        progress: progress || 0,
      },
      create: {
        userId: user.id,
        storyId,
        progress: progress || 0,
      },
    })

    return NextResponse.json({ success: true, history })
  } catch (error) {
    console.error('Reading history error:', error)
    return NextResponse.json(
      { error: 'Failed to update reading history' },
      { status: 500 }
    )
  }
}
