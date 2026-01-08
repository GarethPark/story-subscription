import Anthropic from '@anthropic-ai/sdk'
import { prisma } from '../lib/db'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

interface StoryConfig {
  genre: string
  heatLevel: 'Sweet' | 'Warm' | 'Hot' | 'Scorching'
  tropes: string[]
  wordCount: number
}

// CUSTOM BATCH: Contemporary + Dark Romance - All Scorching
const CUSTOM_BATCH: StoryConfig[] = [
  // CONTEMPORARY (5 stories - Scorching)
  { genre: 'Contemporary', heatLevel: 'Scorching', tropes: ['grumpy sunshine', 'office romance'], wordCount: 8000 },
  { genre: 'Contemporary', heatLevel: 'Scorching', tropes: ['billionaire', 'one bed'], wordCount: 8000 },
  { genre: 'Contemporary', heatLevel: 'Scorching', tropes: ['enemies to lovers', 'forced proximity'], wordCount: 8000 },
  { genre: 'Contemporary', heatLevel: 'Scorching', tropes: ['second chance', 'grumpy sunshine'], wordCount: 8000 },
  { genre: 'Contemporary', heatLevel: 'Scorching', tropes: ['office romance', 'billionaire'], wordCount: 8000 },

  // DARK ROMANCE (5 stories - Scorching)
  { genre: 'Dark Romance', heatLevel: 'Scorching', tropes: ['mafia romance', 'morally gray hero'], wordCount: 8000 },
  { genre: 'Dark Romance', heatLevel: 'Scorching', tropes: ['forbidden love', 'possessive love'], wordCount: 8000 },
  { genre: 'Dark Romance', heatLevel: 'Scorching', tropes: ['captive', 'enemies to lovers'], wordCount: 8000 },
  { genre: 'Dark Romance', heatLevel: 'Scorching', tropes: ['antihero', 'revenge'], wordCount: 8000 },
  { genre: 'Dark Romance', heatLevel: 'Scorching', tropes: ['mafia romance', 'forced proximity'], wordCount: 8000 },
]

async function generateStoryContent(config: StoryConfig): Promise<{
  title: string
  summary: string
  content: string
  author: string
  tags: string
}> {
  const tropesText = config.tropes.join(', ')
  const wordCount = config.wordCount

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
2. Use UNIQUE, CREATIVE character names - avoid common romance names like Emma, Ethan, Sophia, Liam, etc. Choose distinctive names that fit the genre and setting
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

  console.log(`  📝 Generating with Claude Opus...`)

  const stream = await anthropic.messages.stream({
    model: 'claude-opus-4-20250514',
    max_tokens: 24000,
    temperature: 1,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  })

  let responseText = ''
  for await (const chunk of stream) {
    if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
      responseText += chunk.delta.text
      if (responseText.length % 1000 === 0) {
        process.stdout.write('.')
      }
    }
  }
  console.log('')

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

async function generateAndSaveStory(config: StoryConfig, index: number, total: number) {
  console.log(`\n${'='.repeat(80)}`)
  console.log(`📚 Story ${index}/${total}`)
  console.log(`Genre: ${config.genre} | Heat: ${config.heatLevel} 🌶️ | Tropes: ${config.tropes.join(', ')}`)
  console.log(`${'='.repeat(80)}`)

  try {
    const story = await generateStoryContent(config)

    const wordCount = story.content.split(/\s+/).length
    const readingTime = Math.ceil(wordCount / 200)
    const ageRating = '18+'

    console.log(`  ✅ Generated: "${story.title}" by ${story.author}`)
    console.log(`  📊 ${wordCount} words | ${readingTime} min read | ${ageRating}`)

    const savedStory = await prisma.story.create({
      data: {
        title: story.title,
        author: story.author,
        summary: story.summary,
        content: story.content,
        genre: config.genre,
        tags: story.tags,
        coverImage: '',
        readingTime,
        ageRating,
        published: true,
        featured: false,
        generationStatus: 'COMPLETED',
      },
    })

    console.log(`  💾 Saved to database (ID: ${savedStory.id})`)
    console.log(`  ✅ SUCCESS!`)

    return savedStory
  } catch (error) {
    console.error(`  ❌ ERROR:`, error instanceof Error ? error.message : error)
    throw error
  }
}

async function main() {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║           🔥 CONTEMPORARY + DARK ROMANCE BATCH 🔥              ║
║                                                                ║
║  10 Scorching hot stories (5 Contemporary + 5 Dark Romance)   ║
║  Heat Level: Scorching 🌶️🌶️🌶️                                 ║
║  Cost: ~$9.20                                                  ║
║  Time: ~1-2 hours                                              ║
╚════════════════════════════════════════════════════════════════╝
`)

  const successCount = []
  const failedCount = []

  for (let i = 0; i < CUSTOM_BATCH.length; i++) {
    const config = CUSTOM_BATCH[i]
    try {
      await generateAndSaveStory(config, i + 1, CUSTOM_BATCH.length)
      successCount.push(i + 1)
    } catch (error) {
      console.error(`\n❌ Story ${i + 1} FAILED. Continuing to next story...\n`)
      failedCount.push(i + 1)
    }

    if (i < CUSTOM_BATCH.length - 1) {
      console.log(`\n⏳ Waiting 5 seconds before next story...`)
      await new Promise(resolve => setTimeout(resolve, 5000))
    }
  }

  console.log(`\n${'='.repeat(80)}`)
  console.log(`✨ GENERATION COMPLETE!`)
  console.log(`${'='.repeat(80)}`)
  console.log(`✅ Success: ${successCount.length} stories`)
  if (failedCount.length > 0) {
    console.log(`❌ Failed: ${failedCount.length} stories (${failedCount.join(', ')})`)
  }
  console.log(`\n🔥 All done! Check your scorching hot stories at /stories\n`)

  await prisma.$disconnect()
}

main().catch(console.error)
