import Anthropic from '@anthropic-ai/sdk'
import { prisma } from '../lib/db'

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

interface StoryConfig {
  genre: string
  heatLevel: 'Sweet' | 'Warm' | 'Hot' | 'Scorching'
  tropes: string[]
  wordCount: number
}

// All 50 story configurations (based on market research)
const STORY_CONFIGS: StoryConfig[] = [
  // ROMANTASY (20 stories - 40% of library)
  { genre: 'Romantasy', heatLevel: 'Hot', tropes: ['enemies to lovers', 'fated mates'], wordCount: 8000 },
  { genre: 'Romantasy', heatLevel: 'Scorching', tropes: ['morally gray hero', 'dragon shifter'], wordCount: 8000 },
  { genre: 'Romantasy', heatLevel: 'Hot', tropes: ['fated mates', 'magic bond'], wordCount: 8000 },
  { genre: 'Romantasy', heatLevel: 'Scorching', tropes: ['vampire romance', 'forbidden supernatural love'], wordCount: 8000 },
  { genre: 'Romantasy', heatLevel: 'Hot', tropes: ['chosen one', 'royal romance'], wordCount: 8000 },
  { genre: 'Romantasy', heatLevel: 'Scorching', tropes: ['morally gray hero', 'rival courts'], wordCount: 8000 },
  { genre: 'Romantasy', heatLevel: 'Hot', tropes: ['dragon shifter', 'enemies to lovers'], wordCount: 8000 },
  { genre: 'Romantasy', heatLevel: 'Scorching', tropes: ['fated mates', 'forbidden supernatural love'], wordCount: 8000 },
  { genre: 'Romantasy', heatLevel: 'Hot', tropes: ['vampire romance', 'enemies to lovers'], wordCount: 8000 },
  { genre: 'Romantasy', heatLevel: 'Scorching', tropes: ['morally gray hero', 'magic bond'], wordCount: 8000 },
  { genre: 'Romantasy', heatLevel: 'Hot', tropes: ['chosen one', 'fated mates'], wordCount: 8000 },
  { genre: 'Romantasy', heatLevel: 'Scorching', tropes: ['dragon shifter', 'royal romance'], wordCount: 8000 },
  { genre: 'Romantasy', heatLevel: 'Hot', tropes: ['rival courts', 'enemies to lovers'], wordCount: 8000 },
  { genre: 'Romantasy', heatLevel: 'Scorching', tropes: ['vampire romance', 'morally gray hero'], wordCount: 8000 },
  { genre: 'Romantasy', heatLevel: 'Hot', tropes: ['magic bond', 'royal romance'], wordCount: 8000 },
  { genre: 'Romantasy', heatLevel: 'Scorching', tropes: ['fated mates', 'dragon shifter'], wordCount: 8000 },
  { genre: 'Romantasy', heatLevel: 'Hot', tropes: ['forbidden supernatural love', 'chosen one'], wordCount: 8000 },
  { genre: 'Romantasy', heatLevel: 'Scorching', tropes: ['enemies to lovers', 'magic bond'], wordCount: 8000 },
  { genre: 'Romantasy', heatLevel: 'Hot', tropes: ['royal romance', 'morally gray hero'], wordCount: 8000 },
  { genre: 'Romantasy', heatLevel: 'Scorching', tropes: ['vampire romance', 'fated mates'], wordCount: 8000 },

  // CONTEMPORARY (10 stories - 20%)
  { genre: 'Contemporary', heatLevel: 'Hot', tropes: ['grumpy sunshine', 'office romance'], wordCount: 8000 },
  { genre: 'Contemporary', heatLevel: 'Hot', tropes: ['enemies to lovers', 'forced proximity'], wordCount: 8000 },
  { genre: 'Contemporary', heatLevel: 'Scorching', tropes: ['billionaire', 'one bed'], wordCount: 8000 },
  { genre: 'Contemporary', heatLevel: 'Hot', tropes: ['friends to lovers', 'grumpy sunshine'], wordCount: 8000 },
  { genre: 'Contemporary', heatLevel: 'Scorching', tropes: ['second chance', 'forced proximity'], wordCount: 8000 },
  { genre: 'Contemporary', heatLevel: 'Hot', tropes: ['fake relationship', 'enemies to lovers'], wordCount: 8000 },
  { genre: 'Contemporary', heatLevel: 'Scorching', tropes: ['office romance', 'billionaire'], wordCount: 8000 },
  { genre: 'Contemporary', heatLevel: 'Hot', tropes: ['grumpy sunshine', 'second chance'], wordCount: 8000 },
  { genre: 'Contemporary', heatLevel: 'Scorching', tropes: ['one bed', 'forced proximity'], wordCount: 8000 },
  { genre: 'Contemporary', heatLevel: 'Hot', tropes: ['friends to lovers', 'fake relationship'], wordCount: 8000 },

  // SMALL TOWN (8 stories - 16%)
  { genre: 'Small Town', heatLevel: 'Warm', tropes: ['grumpy sunshine', 'return to hometown'], wordCount: 8000 },
  { genre: 'Small Town', heatLevel: 'Hot', tropes: ['small business romance', 'second chance'], wordCount: 8000 },
  { genre: 'Small Town', heatLevel: 'Warm', tropes: ['city person moves to town', 'enemies to lovers'], wordCount: 8000 },
  { genre: 'Small Town', heatLevel: 'Hot', tropes: ['grumpy sunshine', 'fake dating'], wordCount: 8000 },
  { genre: 'Small Town', heatLevel: 'Warm', tropes: ['return to hometown', 'friends to lovers'], wordCount: 8000 },
  { genre: 'Small Town', heatLevel: 'Hot', tropes: ['small business romance', 'grumpy sunshine'], wordCount: 8000 },
  { genre: 'Small Town', heatLevel: 'Warm', tropes: ['single parent', 'second chance'], wordCount: 8000 },
  { genre: 'Small Town', heatLevel: 'Hot', tropes: ['city person moves to town', 'fake dating'], wordCount: 8000 },

  // SPORTS ROMANCE (6 stories - 12%)
  { genre: 'Sports Romance', heatLevel: 'Scorching', tropes: ['hockey romance', 'grumpy athlete'], wordCount: 8000 },
  { genre: 'Sports Romance', heatLevel: 'Hot', tropes: ['hockey romance', 'rival teams'], wordCount: 8000 },
  { genre: 'Sports Romance', heatLevel: 'Scorching', tropes: ['football romance', 'athlete & trainer'], wordCount: 8000 },
  { genre: 'Sports Romance', heatLevel: 'Hot', tropes: ['hockey romance', 'athlete & journalist'], wordCount: 8000 },
  { genre: 'Sports Romance', heatLevel: 'Scorching', tropes: ['basketball romance', 'grumpy athlete'], wordCount: 8000 },
  { genre: 'Sports Romance', heatLevel: 'Hot', tropes: ['hockey romance', 'rival teams'], wordCount: 8000 },

  // HISTORICAL (3 stories - 6%)
  { genre: 'Historical', heatLevel: 'Hot', tropes: ['regency romance', 'arranged marriage'], wordCount: 8000 },
  { genre: 'Historical', heatLevel: 'Warm', tropes: ['highland romance', 'enemies to lovers'], wordCount: 8000 },
  { genre: 'Historical', heatLevel: 'Hot', tropes: ['regency romance', 'marriage of convenience'], wordCount: 8000 },

  // DARK ROMANCE (2 stories - 4%)
  { genre: 'Dark Romance', heatLevel: 'Scorching', tropes: ['mafia romance', 'morally gray hero'], wordCount: 8000 },
  { genre: 'Dark Romance', heatLevel: 'Scorching', tropes: ['forbidden love', 'possessive love'], wordCount: 8000 },

  // ROMANTIC SUSPENSE (1 story - 2%)
  { genre: 'Romantic Suspense', heatLevel: 'Hot', tropes: ['bodyguard', 'forced proximity'], wordCount: 8000 },
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

  // Use streaming to avoid timeouts
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

  // Collect all chunks from the stream
  let responseText = ''
  for await (const chunk of stream) {
    if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
      responseText += chunk.delta.text
      // Show progress dots
      if (responseText.length % 1000 === 0) {
        process.stdout.write('.')
      }
    }
  }
  console.log('') // New line after dots

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

async function generateAndSaveStory(config: StoryConfig, index: number, total: number) {
  console.log(`\n${'='.repeat(80)}`)
  console.log(`📚 Story ${index}/${total}`)
  console.log(`Genre: ${config.genre} | Heat: ${config.heatLevel} | Tropes: ${config.tropes.join(', ')}`)
  console.log(`${'='.repeat(80)}`)

  try {
    // Generate story content
    const story = await generateStoryContent(config)

    // Calculate reading time
    const wordCount = story.content.split(/\s+/).length
    const readingTime = Math.ceil(wordCount / 200)

    // Determine age rating
    const ageRating = config.heatLevel === 'Sweet' ? 'PG-13' : config.heatLevel === 'Warm' ? '16+' : '18+'

    console.log(`  ✅ Generated: "${story.title}" by ${story.author}`)
    console.log(`  📊 ${wordCount} words | ${readingTime} min read | ${ageRating}`)

    // Save to database
    const savedStory = await prisma.story.create({
      data: {
        title: story.title,
        author: story.author,
        summary: story.summary,
        content: story.content,
        genre: config.genre,
        tags: story.tags,
        coverImage: '', // Will add covers later
        readingTime,
        ageRating,
        published: true, // Auto-publish curated stories
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
║                    🌹 SILK STORY GENERATOR 🌹                  ║
║                                                                ║
║  Generating 50 high-quality curated stories for your library  ║
║  Using: Claude Opus 4 (maximum quality)                       ║
║  Length: 8,000 words per story                                ║
║  Estimated time: 5-10 minutes per story                       ║
║  Total time: ~4-8 hours                                       ║
║  Estimated cost: ~$46 (50 × $0.92)                            ║
╚════════════════════════════════════════════════════════════════╝
`)

  const args = process.argv.slice(2)
  const startFrom = args[0] ? parseInt(args[0]) : 1
  const count = args[1] ? parseInt(args[1]) : STORY_CONFIGS.length

  console.log(`Starting from story #${startFrom}, generating ${count} stories\n`)

  const successCount = []
  const failedCount = []

  for (let i = startFrom - 1; i < Math.min(startFrom - 1 + count, STORY_CONFIGS.length); i++) {
    const config = STORY_CONFIGS[i]
    try {
      await generateAndSaveStory(config, i + 1, STORY_CONFIGS.length)
      successCount.push(i + 1)
    } catch (error) {
      console.error(`\n❌ Story ${i + 1} FAILED. Continuing to next story...\n`)
      failedCount.push(i + 1)
    }

    // Small delay between stories to avoid rate limits
    if (i < STORY_CONFIGS.length - 1) {
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
  console.log(`\n🎉 All done! Your stories are now live on the site.`)
  console.log(`📊 View them at: https://romance-story-subscription.vercel.app/stories\n`)

  await prisma.$disconnect()
}

main().catch(console.error)
