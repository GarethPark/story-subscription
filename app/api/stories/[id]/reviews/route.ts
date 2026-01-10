import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth/session'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: storyId } = await params
    const { content } = await request.json()

    // Validate content
    if (!content || content.trim().length < 10) {
      return NextResponse.json(
        { error: 'Review must be at least 10 characters' },
        { status: 400 }
      )
    }

    if (content.length > 1000) {
      return NextResponse.json(
        { error: 'Review must be less than 1000 characters' },
        { status: 400 }
      )
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        userId: user.id,
        storyId,
        content: content.trim(),
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      review: {
        id: review.id,
        content: review.content,
        createdAt: review.createdAt,
        userName: review.user.name || review.user.email.split('@')[0],
      },
    })
  } catch (error) {
    console.error('Review error:', error)
    return NextResponse.json(
      { error: 'Failed to save review' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: storyId } = await params

    const reviews = await prisma.review.findMany({
      where: { storyId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50, // Limit to 50 most recent reviews
    })

    return NextResponse.json({
      reviews: reviews.map((review) => ({
        id: review.id,
        content: review.content,
        createdAt: review.createdAt,
        userName: review.user.name || review.user.email.split('@')[0],
      })),
    })
  } catch (error) {
    console.error('Get reviews error:', error)
    return NextResponse.json(
      { error: 'Failed to get reviews' },
      { status: 500 }
    )
  }
}
