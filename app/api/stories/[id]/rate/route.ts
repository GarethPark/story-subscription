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
    const { rating } = await request.json()

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    // Upsert rating (create or update)
    const ratingRecord = await prisma.rating.upsert({
      where: {
        userId_storyId: {
          userId: user.id,
          storyId,
        },
      },
      update: {
        rating,
      },
      create: {
        userId: user.id,
        storyId,
        rating,
      },
    })

    // Calculate new average rating
    const ratings = await prisma.rating.findMany({
      where: { storyId },
      select: { rating: true },
    })

    const averageRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
    const ratingCount = ratings.length

    return NextResponse.json({
      success: true,
      rating: ratingRecord.rating,
      averageRating: parseFloat(averageRating.toFixed(1)),
      ratingCount,
    })
  } catch (error) {
    console.error('Rating error:', error)
    return NextResponse.json(
      { error: 'Failed to save rating' },
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
    const user = await getCurrentUser()

    // Get average rating
    const ratings = await prisma.rating.findMany({
      where: { storyId },
      select: { rating: true },
    })

    const averageRating = ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
      : 0

    // Get user's rating if logged in
    let userRating = null
    if (user) {
      const rating = await prisma.rating.findUnique({
        where: {
          userId_storyId: {
            userId: user.id,
            storyId,
          },
        },
      })
      userRating = rating?.rating || null
    }

    return NextResponse.json({
      averageRating: parseFloat(averageRating.toFixed(1)),
      ratingCount: ratings.length,
      userRating,
    })
  } catch (error) {
    console.error('Get rating error:', error)
    return NextResponse.json(
      { error: 'Failed to get ratings' },
      { status: 500 }
    )
  }
}
