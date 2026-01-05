import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth/session'
import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'
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

    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })

    // Generate story content
    const storyData = await generateStoryContent(anthropic, config)

    // Generate cover image if requested
    let coverImage = ''
    if (config.generateCover && process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your-openai-api-key-here') {
      try {
        const openai = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY,
        })
        coverImage = await generateCoverImage(openai, storyData.title, config.genre, storyData.summary)
      } catch (error) {
        console.error('Cover generation failed, using fallback:', error)
        // Continue without cover image
      }
    }

    // Calculate reading time
    const wordCount = storyData.content.split(/\s+/).length
    const readingTime = Math.ceil(wordCount / 200)

    // Determine age rating
    const ageRating = config.heatLevel === 'Sweet' ? 'PG-13' : config.heatLevel === 'Warm' ? '16+' : '18+'

    // Save to database as UNPUBLISHED for review
    const story = await prisma.story.create({
      data: {
        title: storyData.title,
        author: storyData.author,
        summary: storyData.summary,
        content: storyData.content,
        genre: config.genre,
        tags: storyData.tags,
        coverImage: coverImage || undefined,
        readingTime,
        ageRating,
        published: false, // Save as draft for review
        featured: false,
      },
    })

    return NextResponse.json({
      success: true,
      storyId: story.id,
      title: story.title,
      wordCount,
      message: 'Story generated successfully. Review before publishing.',
    })
  } catch (error) {
    console.error('Story generation error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate story' },
      { status: 500 }
    )
  }
}

async function generateStoryContent(
  anthropic: Anthropic,
  config: StoryConfig
): Promise<{ title: string; summary: string; content: string; author: string; tags: string }> {
  const tropesText = config.tropes.join(', ')
  const wordCount = config.wordCount || 3500

  const heatGuidance = {
    Sweet: 'Focus on emotional connection, longing looks, and innocent touches. Keep intimacy to kissing and fade to black.',
    Warm: 'Include some sensual tension, passionate kissing, and implied intimacy. Tasteful but romantic.',
    Hot: 'Include explicit romantic scenes with detailed intimate moments. Sensual and passionate.',
    Scorching: 'Include very explicit, detailed intimate scenes. Erotic romance with graphic descriptions.',
  }

  const prompt = `You are a bestselling romance novelist. Write a complete, engaging romance story with the following specifications:

Genre: ${config.genre} Romance
Heat Level: ${config.heatLevel} - ${heatGuidance[config.heatLevel]}
Tropes: ${tropesText}
Length: Approximately ${wordCount} words

Requirements:
1. Create compelling, three-dimensional characters with chemistry
2. Include witty dialogue and emotional depth
3. Build sexual/romantic tension throughout
4. Include a satisfying emotional arc and happy ending (HEA)
5. Make it feel complete - beginning, middle, climactic resolution, and epilogue
6. Write in third person with close POV
7. Include vivid sensory details and emotional introspection

Please provide the story in this exact format:

TITLE: [An engaging, marketable romance title]

AUTHOR: [A pen name that sounds like a romance author]

SUMMARY: [A 2-3 sentence compelling book description that would hook readers]

TAGS: [5-7 comma-separated tags like "enemies to lovers, steamy, billionaire, second chance"]

STORY:
[The complete story text, approximately ${wordCount} words]`

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8192,
    temperature: 1,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  })

  const responseText = message.content[0].type === 'text' ? message.content[0].text : ''

  // Parse the response
  const titleMatch = responseText.match(/TITLE:\s*(.+?)(?:\n|$)/i)
  const authorMatch = responseText.match(/AUTHOR:\s*(.+?)(?:\n|$)/i)
  const summaryMatch = responseText.match(/SUMMARY:\s*(.+?)(?:\n\n|TAGS:|STORY:)/is)
  const tagsMatch = responseText.match(/TAGS:\s*(.+?)(?:\n|$)/i)
  const storyMatch = responseText.match(/STORY:\s*\n([\s\S]+)$/i)

  if (!titleMatch || !authorMatch || !summaryMatch || !storyMatch) {
    throw new Error('Failed to parse story response from Claude')
  }

  return {
    title: titleMatch[1].trim(),
    author: authorMatch[1].trim(),
    summary: summaryMatch[1].trim(),
    tags: tagsMatch ? tagsMatch[1].trim() : tropesText,
    content: storyMatch[1].trim(),
  }
}

async function generateCoverImage(
  openai: OpenAI,
  title: string,
  genre: string,
  summary: string
): Promise<string> {
  const styleGuides: Record<string, string> = {
    Contemporary: 'Modern, stylish photo of an attractive couple in contemporary setting, professional photography style, romantic lighting',
    Historical: 'Period-accurate romantic scene, couple in historical clothing, painterly style, dramatic lighting, Regency or Victorian era',
    Paranormal: 'Mystical, supernatural romance, dark and moody atmosphere, fantasy elements, ethereal lighting',
    Fantasy: 'Epic fantasy romance, magical setting, dramatic landscape, couple in fantasy attire, otherworldly beauty',
    Suspense: 'Tense, dramatic scene, couple in shadow, noir lighting, mysterious atmosphere, urban setting',
  }

  const prompt = `A captivating romance novel cover: ${styleGuides[genre]}.
Highly attractive couple with intense chemistry and longing gazes.
Sensual, alluring composition that captures the essence of: ${summary.substring(0, 200)}.
Professional book cover quality, trending on romance bestseller lists, gorgeous aesthetics, emotionally evocative.`

  const response = await openai.images.generate({
    model: 'dall-e-3',
    prompt: prompt,
    n: 1,
    size: '1024x1792',
    quality: 'hd',
    style: 'vivid',
  })

  const imageUrl = response.data?.[0]?.url
  if (!imageUrl) {
    throw new Error('No image URL returned from DALL-E')
  }

  return imageUrl
}
