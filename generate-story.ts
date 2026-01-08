import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'
import { prisma } from './lib/db'

// Initialize AI clients
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Story generation configuration
interface StoryConfig {
  genre: 'Contemporary' | 'Historical' | 'Paranormal' | 'Fantasy' | 'Suspense'
  heatLevel: 'Sweet' | 'Warm' | 'Hot' | 'Scorching'
  tropes: string[]
  wordCount?: number
}

// Romance tropes and themes
const ROMANCE_TROPES = {
  Contemporary: ['enemies to lovers', 'second chance', 'fake relationship', 'boss/employee', 'friends to lovers', 'forced proximity'],
  Historical: ['arranged marriage', 'forbidden love', 'secret identity', 'class difference', 'marriage of convenience', 'redemption'],
  Paranormal: ['fated mates', 'vampire romance', 'shifter romance', 'witch/warlock', 'forbidden supernatural love', 'chosen one'],
  Fantasy: ['destined lovers', 'magic bond', 'rival kingdoms', 'quest romance', 'dragon shifter', 'royal romance'],
  Suspense: ['protector romance', 'witness protection', 'undercover', 'romantic suspense', 'bodyguard', 'detective romance'],
}

async function generateStoryContent(config: StoryConfig): Promise<{ title: string; summary: string; content: string; author: string; tags: string }> {
  const tropesText = config.tropes.join(', ')
  const wordCount = config.wordCount || 3500

  console.log(`\n📝 Generating ${config.genre} romance story...`)
  console.log(`   Heat Level: ${config.heatLevel}`)
  console.log(`   Tropes: ${tropesText}`)
  console.log(`   Target: ~${wordCount} words\n`)

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
    model: 'claude-opus-4-20250514', // Opus for maximum quality curated stories
    max_tokens: 24000, // Increased for 8,000 word stories
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

async function generateCoverImage(title: string, genre: string, summary: string): Promise<string> {
  console.log(`🎨 Generating cover image for "${title}"...\n`)

  // Create a detailed prompt for a romance cover
  const styleGuides = {
    Contemporary: 'Modern, stylish photo of an attractive couple in contemporary setting, professional photography style, romantic lighting',
    Historical: 'Period-accurate romantic scene, couple in historical clothing, painterly style, dramatic lighting, Regency or Victorian era',
    Paranormal: 'Mystical, supernatural romance, dark and moody atmosphere, fantasy elements, ethereal lighting',
    Fantasy: 'Epic fantasy romance, magical setting, dramatic landscape, couple in fantasy attire, otherworldly beauty',
    Suspense: 'Tense, dramatic scene, couple in shadow, noir lighting, mysterious atmosphere, urban setting',
  }

  const prompt = `A captivating romance novel cover: ${styleGuides[genre as keyof typeof styleGuides]}.
Highly attractive couple with intense chemistry and longing gazes.
Sensual, alluring composition that captures the essence of: ${summary.substring(0, 200)}.
Professional book cover quality, trending on romance bestseller lists, gorgeous aesthetics, emotionally evocative.`

  try {
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: '1024x1792', // Vertical format for book covers
      quality: 'hd',
      style: 'vivid',
    })

    const imageUrl = response.data?.[0]?.url
    if (!imageUrl) {
      throw new Error('No image URL returned from DALL-E')
    }

    console.log(`✅ Cover image generated successfully!\n`)
    return imageUrl
  } catch (error) {
    console.error('Error generating cover image:', error)
    // Return a fallback gradient
    return ''
  }
}

async function createStory(config: StoryConfig) {
  try {
    // Generate story content
    const story = await generateStoryContent(config)

    // Generate cover image
    const coverImage = await generateCoverImage(story.title, config.genre, story.summary)

    // Calculate reading time (average 200 words per minute)
    const wordCount = story.content.split(/\s+/).length
    const readingTime = Math.ceil(wordCount / 200)

    // Determine age rating based on heat level
    const ageRating = config.heatLevel === 'Sweet' ? 'PG-13' : config.heatLevel === 'Warm' ? '16+' : '18+'

    // Save to database
    console.log(`💾 Saving "${story.title}" to database...\n`)
    const savedStory = await prisma.story.create({
      data: {
        title: story.title,
        author: story.author,
        summary: story.summary,
        content: story.content,
        genre: config.genre,
        tags: story.tags,
        coverImage: coverImage || undefined,
        readingTime,
        ageRating,
        published: true,
        featured: Math.random() > 0.5, // Randomly feature some stories
      },
    })

    console.log(`✅ SUCCESS! Story created with ID: ${savedStory.id}`)
    console.log(`   Title: ${savedStory.title}`)
    console.log(`   Author: ${savedStory.author}`)
    console.log(`   Word Count: ${wordCount}`)
    console.log(`   Reading Time: ${readingTime} minutes`)
    console.log(`   Age Rating: ${ageRating}`)
    console.log(`   Cover Image: ${coverImage ? 'Yes' : 'No (using gradient fallback)'}`)
    console.log(`\n📚 View at: http://localhost:3000/stories/${savedStory.id}\n`)

    return savedStory
  } catch (error) {
    console.error('Error creating story:', error)
    throw error
  }
}

// Example usage and CLI interface
async function main() {
  const args = process.argv.slice(2)

  if (args.length === 0) {
    console.log(`
🌹 Romance Story Generator 🌹

Usage: npx tsx generate-story.ts [genre] [heatLevel] [trope1,trope2,...]

Genres: Contemporary, Historical, Paranormal, Fantasy, Suspense
Heat Levels: Sweet, Warm, Hot, Scorching

Examples:
  npx tsx generate-story.ts Contemporary Hot "enemies to lovers,billionaire"
  npx tsx generate-story.ts Historical Warm "arranged marriage,class difference"
  npx tsx generate-story.ts Paranormal Scorching "fated mates,vampire romance"

Available tropes by genre:
${Object.entries(ROMANCE_TROPES).map(([genre, tropes]) => `  ${genre}: ${tropes.join(', ')}`).join('\n')}
    `)
    process.exit(0)
  }

  const genre = args[0] as StoryConfig['genre']
  const heatLevel = (args[1] || 'Warm') as StoryConfig['heatLevel']
  const tropes = args[2] ? args[2].split(',').map((t) => t.trim()) : ROMANCE_TROPES[genre].slice(0, 2)

  if (!['Contemporary', 'Historical', 'Paranormal', 'Fantasy', 'Suspense'].includes(genre)) {
    console.error('Invalid genre. Choose: Contemporary, Historical, Paranormal, Fantasy, Suspense')
    process.exit(1)
  }

  await createStory({
    genre,
    heatLevel,
    tropes,
    wordCount: 8000, // Maximum length for curated stories
  })

  await prisma.$disconnect()
}

main().catch(console.error)
