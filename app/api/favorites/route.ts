import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth/session'

// GET /api/favorites - Get user's favorited stories
export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const favorites = await prisma.favorite.findMany({
      where: {
        userId: user.id,
      },
      include: {
        story: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({
      favorites: favorites.map((f) => ({
        id: f.id,
        story: f.story,
        createdAt: f.createdAt,
      })),
    })
  } catch (error) {
    console.error('Get favorites error:', error)
    return NextResponse.json(
      { error: 'An error occurred while fetching favorites' },
      { status: 500 }
    )
  }
}

// POST /api/favorites - Add story to favorites
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { storyId } = await request.json()

    if (!storyId) {
      return NextResponse.json(
        { error: 'Story ID is required' },
        { status: 400 }
      )
    }

    // Check if story exists
    const story = await prisma.story.findUnique({
      where: { id: storyId },
    })

    if (!story) {
      return NextResponse.json(
        { error: 'Story not found' },
        { status: 404 }
      )
    }

    // Check if already favorited
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_storyId: {
          userId: user.id,
          storyId: storyId,
        },
      },
    })

    if (existingFavorite) {
      return NextResponse.json(
        { error: 'Story already in favorites' },
        { status: 400 }
      )
    }

    // Create favorite
    const favorite = await prisma.favorite.create({
      data: {
        userId: user.id,
        storyId: storyId,
      },
      include: {
        story: true,
      },
    })

    return NextResponse.json({
      success: true,
      favorite: {
        id: favorite.id,
        story: favorite.story,
        createdAt: favorite.createdAt,
      },
    })
  } catch (error) {
    console.error('Add favorite error:', error)
    return NextResponse.json(
      { error: 'An error occurred while adding to favorites' },
      { status: 500 }
    )
  }
}

// DELETE /api/favorites - Remove story from favorites
export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const storyId = searchParams.get('storyId')

    if (!storyId) {
      return NextResponse.json(
        { error: 'Story ID is required' },
        { status: 400 }
      )
    }

    // Delete the favorite
    const deleted = await prisma.favorite.deleteMany({
      where: {
        userId: user.id,
        storyId: storyId,
      },
    })

    if (deleted.count === 0) {
      return NextResponse.json(
        { error: 'Favorite not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Removed from favorites',
    })
  } catch (error) {
    console.error('Remove favorite error:', error)
    return NextResponse.json(
      { error: 'An error occurred while removing from favorites' },
      { status: 500 }
    )
  }
}
