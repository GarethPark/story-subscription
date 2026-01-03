import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth/session'
import { prisma } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    const { id } = await params

    if (!user || !user.isAdmin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const story = await prisma.story.update({
      where: { id },
      data: { published: false },
    })

    return NextResponse.json({
      success: true,
      story: {
        id: story.id,
        title: story.title,
        published: story.published,
      },
    })
  } catch (error) {
    console.error('Unpublish error:', error)
    return NextResponse.json(
      { error: 'Failed to unpublish story' },
      { status: 500 }
    )
  }
}
