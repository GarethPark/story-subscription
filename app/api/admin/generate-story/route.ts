import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth/session'
import { prisma } from '@/lib/db'

// Story generation types
interface StoryConfig {
  genre: 'Contemporary' | 'Historical' | 'Paranormal' | 'Fantasy' | 'Suspense'
  heatLevel: 'Sweet' | 'Warm' | 'Hot' | 'Scorching'
  tropes: string[]
  wordCount?: number
  generateCover: boolean
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication and admin status
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (!user.isAdmin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const config: StoryConfig = await request.json()

    // Validate config
    if (!config.genre || !config.heatLevel || !config.tropes || config.tropes.length === 0) {
      return NextResponse.json(
        { error: 'Invalid configuration' },
        { status: 400 }
      )
    }

    // Check for API keys
    if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'your-anthropic-api-key-here') {
      return NextResponse.json(
        { error: 'Anthropic API key not configured. Please add ANTHROPIC_API_KEY to your .env file.' },
        { status: 500 }
      )
    }

    // Determine age rating
    const ageRating = config.heatLevel === 'Sweet' ? 'PG-13' : config.heatLevel === 'Warm' ? '16+' : '18+'

    // Create story immediately with PENDING status
    const story = await prisma.story.create({
      data: {
        title: 'Generating...',
        author: 'AI Generated',
        summary: 'Story is being generated. Please wait...',
        content: '',
        genre: config.genre,
        tags: config.tropes.join(', '),
        ageRating,
        published: false,
        featured: false,
        generationStatus: 'PENDING',
      },
    })

    // Trigger async generation (fire and forget)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    // Don't await this - let it run in background
    fetch(`${baseUrl}/api/admin/generate-story/${story.id}/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config),
    }).catch((error) => {
      console.error('Failed to trigger generation:', error)
      // Update story with error
      prisma.story.update({
        where: { id: story.id },
        data: {
          generationStatus: 'FAILED',
          generationError: 'Failed to start generation',
        },
      }).catch(console.error)
    })

    return NextResponse.json({
      success: true,
      storyId: story.id,
      message: 'Story generation started. Check status to see progress.',
    })
  } catch (error) {
    console.error('Story generation error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate story' },
      { status: 500 }
    )
  }
}
