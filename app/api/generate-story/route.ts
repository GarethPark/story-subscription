import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth/session'
import { prisma } from '@/lib/db'
import { canGenerateStory, useCredit, getUserCredits } from '@/lib/credits'
import { sendLowCreditsWarningEmail } from '@/lib/email'

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

    // Check if user can generate a story
    const creditCheck = await canGenerateStory(user.id)
    if (!creditCheck.canGenerate) {
      return NextResponse.json(
        { error: creditCheck.reason },
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
    const creditUsed = await useCredit(user.id, story.id)

    if (!creditUsed) {
      // This shouldn't happen since we checked earlier, but handle it anyway
      await prisma.story.delete({ where: { id: story.id } })
      return NextResponse.json(
        { error: 'Failed to use credit. Please try again.' },
        { status: 500 }
      )
    }

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
      }).then(async () => {
        // Refund the credit with transaction log
        await prisma.user.update({
          where: { id: user.id },
          data: { credits: { increment: 1 } },
        })
        await prisma.creditTransaction.create({
          data: {
            userId: user.id,
            storyId: story.id,
            amount: 1,
            type: 'REFUND',
            description: 'Story generation failed - credit refunded',
          },
        })
      }).catch(console.error)
    })

    // Get updated credit balance
    const creditsRemaining = await getUserCredits(user.id)

    // Send low credits warning email if down to 1 credit (for non-unlimited users)
    if (creditsRemaining === 1 && creditCheck.tier !== 'UNLIMITED') {
      // Get full user info for email
      const fullUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { email: true, name: true },
      })

      if (fullUser && process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 'your-resend-api-key-here') {
        // Send async - don't block the response
        sendLowCreditsWarningEmail({
          to: fullUser.email,
          userName: fullUser.name || 'Reader',
          remainingCredits: creditsRemaining,
        }).catch((error) => {
          console.error('Failed to send low credits warning email:', error)
        })
      }
    }

    return NextResponse.json({
      success: true,
      storyId: story.id,
      message: 'Story generation started. Check status to see progress.',
      creditsRemaining,
    })
  } catch (error) {
    console.error('Story generation error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate story' },
      { status: 500 }
    )
  }
}
