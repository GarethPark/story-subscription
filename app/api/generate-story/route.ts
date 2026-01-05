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
  // Custom generation fields
  protagonistName?: string
  loveInterestName?: string
  customScenario?: string
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      )
    }

    // Check if user has credits
    if (user.credits < 1) {
      return NextResponse.json(
        { error: 'Insufficient credits. Please purchase more credits or upgrade to Premium.' },
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
        { error: 'Story generation is temporarily unavailable. Please try again later.' },
        { status: 500 }
      )
    }

    // Determine age rating
    const ageRating = config.heatLevel === 'Sweet' ? 'PG-13' : config.heatLevel === 'Warm' ? '16+' : '18+'

    // Build character names JSON if provided
    let characterNames: string | undefined
    if (config.protagonistName || config.loveInterestName) {
      characterNames = JSON.stringify({
        protagonist: config.protagonistName || undefined,
        loveInterest: config.loveInterestName || undefined,
      })
    }

    // Create story immediately with PENDING status
    const story = await prisma.story.create({
      data: {
        title: 'Generating...',
        author: 'AI Generated',
        summary: 'Your story is being generated. Please wait...',
        content: '',
        genre: config.genre,
        tags: config.tropes.join(', '),
        ageRating,
        published: false, // Custom stories are private by default
        featured: false,
        generationStatus: 'PENDING',
        // Custom generation fields
        isCustom: true,
        userId: user.id,
        characterNames,
        customScenario: config.customScenario,
      },
    })

    // Deduct credit from user
    await prisma.user.update({
      where: { id: user.id },
      data: {
        credits: {
          decrement: 1,
        },
      },
    })

    // Trigger async generation (fire and forget)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    // Don't await this - let it run in background
    fetch(`${baseUrl}/api/generate-story/${story.id}/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config),
    }).catch((error) => {
      console.error('Failed to trigger generation:', error)
      // Update story with error AND refund credit
      prisma.story.update({
        where: { id: story.id },
        data: {
          generationStatus: 'FAILED',
          generationError: 'Failed to start generation',
        },
      }).then(() => {
        // Refund the credit
        prisma.user.update({
          where: { id: user.id },
          data: {
            credits: {
              increment: 1,
            },
          },
        })
      }).catch(console.error)
    })

    return NextResponse.json({
      success: true,
      storyId: story.id,
      message: 'Story generation started. Check status to see progress.',
      creditsRemaining: user.credits - 1,
    })
  } catch (error) {
    console.error('Story generation error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate story' },
      { status: 500 }
    )
  }
}
