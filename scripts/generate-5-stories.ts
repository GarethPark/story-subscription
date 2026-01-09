import Anthropic from '@anthropic-ai/sdk'
import { prisma } from '../lib/db'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

const storyIds = [
  'cmk779rre0000zy8sphactzw0',
  'cmk779rya0001zy8svmjpsuya',
  'cmk779s160002zy8si1g6rdja',
  'cmk779s420003zy8sy4fjm9ao',
  'cmk779s6z0004zy8swgtveajw'
]

async function generateStory(storyId: string) {
  const story = await prisma.story.findUnique({ where: { id: storyId } })
  if (!story) return

  console.log(`\n📖 Generating: ${story.genre} - ${story.tags}`)

  await prisma.story.update({
    where: { id: storyId },
    data: { generationStatus: 'GENERATING' }
  })

  const prompt = `You are a bestselling romance novelist. Write a complete, steamy romance story.

Genre: ${story.genre}
Tropes: ${story.tags}
Heat Level: Extra Spicy (very steamy/explicit romantic content)
Target Length: 6000-8000 words

Create a full story with:
- Compelling title
- Two main characters with chemistry
- Clear romantic tension and build-up
- Explicit, steamy romantic scenes
- Emotional depth and character development
- Satisfying romantic conclusion

Format: Write ONLY the story content. Start directly with the narrative.`

  try {
    const message = await anthropic.messages.create({
      model: 'claude-opus-4-20250514',
      max_tokens: 16000,
      temperature: 1,
      messages: [{ role: 'user', content: prompt }]
    })

    const content = message.content[0].type === 'text' ? message.content[0].text : ''
    const lines = content.split('\n')
    const title = lines[0]?.replace(/^#+\s*/, '').trim() || 'Untitled Story'
    const actualContent = lines.slice(1).join('\n').trim()

    const wordCount = actualContent.split(/\s+/).length
    const readingTime = Math.ceil(wordCount / 200)

    await prisma.story.update({
      where: { id: storyId },
      data: {
        title,
        content: actualContent,
        summary: actualContent.substring(0, 300) + '...',
        readingTime,
        generationStatus: 'COMPLETED',
        published: true
      }
    })

    console.log(`✅ ${title} (${wordCount} words)`)
  } catch (error) {
    console.error(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    await prisma.story.update({
      where: { id: storyId },
      data: {
        generationStatus: 'FAILED',
        generationError: error instanceof Error ? error.message : 'Unknown error'
      }
    })
  }
}

async function main() {
  console.log('🎨 Generating 5 extra spicy stories...\n')

  for (const id of storyIds) {
    await generateStory(id)
  }

  console.log('\n✨ All 5 stories generated!')
  await prisma.$disconnect()
}

main().catch(console.error)
