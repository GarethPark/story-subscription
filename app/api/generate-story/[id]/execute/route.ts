import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'
import { prisma } from '@/lib/db'

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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Get the story config from database
    const story = await prisma.story.findUnique({
      where: { id },
    })

    if (!story) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 })
    }

    // Update status to GENERATING
    await prisma.story.update({
      where: { id },
      data: { generationStatus: 'GENERATING' },
    })

    // Get config from request body
    const config: StoryConfig = await request.json()

    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY!,
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
        console.error('Cover generation failed:', error)
      }
    }

    // Calculate reading time
    const wordCount = storyData.content.split(/\s+/).length
    const readingTime = Math.ceil(wordCount / 200)

    // Determine age rating
    const ageRating = config.heatLevel === 'Sweet' ? 'PG-13' : config.heatLevel === 'Warm' ? '16+' : '18+'

    // Update story with generated content
    await prisma.story.update({
      where: { id },
      data: {
        title: storyData.title,
        author: storyData.author,
        summary: storyData.summary,
        content: storyData.content,
        tags: storyData.tags,
        coverImage: coverImage || undefined,
        readingTime,
        ageRating,
        generationStatus: 'COMPLETED',
        generationError: null,
      },
    })

    return NextResponse.json({ success: true, wordCount })
  } catch (error) {
    console.error('Generation error:', error)

    const { id } = await params

    // Update story with error status
    await prisma.story.update({
      where: { id },
      data: {
        generationStatus: 'FAILED',
        generationError: error instanceof Error ? error.message : 'Unknown error',
      },
    })

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

  // Build character name instructions
  let characterInstruction = 'Use UNIQUE, CREATIVE character names - avoid common romance names like Emma, Ethan, Sophia, Liam, etc. Choose distinctive names that fit the genre and setting'

  if (config.protagonistName || config.loveInterestName) {
    characterInstruction = 'Character names:\n'
    if (config.protagonistName) {
      characterInstruction += `- Protagonist: ${config.protagonistName}\n`
    }
    if (config.loveInterestName) {
      characterInstruction += `- Love Interest: ${config.loveInterestName}\n`
    }
    characterInstruction += 'Use these exact names for the main characters.'
  }

  // Build scenario instruction
  let scenarioInstruction = ''
  if (config.customScenario) {
    scenarioInstruction = `\n\nPlot/Setting Details:\n${config.customScenario}\n\nIncorporate these details naturally into your story.`
  }

  const prompt = `You are a bestselling romance novelist. Write a complete, engaging romance story with the following specifications:

Genre: ${config.genre} Romance
Heat Level: ${config.heatLevel} - ${heatGuidance[config.heatLevel]}
Tropes: ${tropesText}
Length: Approximately ${wordCount} words${scenarioInstruction}

Requirements:
1. Create compelling, three-dimensional characters with chemistry
2. ${characterInstruction}
3. Include witty dialogue and emotional depth
4. Build sexual/romantic tension throughout
5. Include a satisfying emotional arc and happy ending (HEA)
6. Make it feel complete - beginning, middle, climactic resolution, and epilogue
7. Write in third person with close POV
8. Include vivid sensory details and emotional introspection

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
