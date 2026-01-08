import { prisma } from '../lib/db'

async function cleanSlate() {
  console.log('🧹 Cleaning database - keeping only "Bound by Starfire"...\n')

  // The ID of "Bound by Starfire" - the only story we want to keep
  const keepStoryId = 'cmk5b5c030001fedmpewtvoif'

  // Get all stories first to show what we're deleting
  const allStories = await prisma.story.findMany({
    select: {
      id: true,
      title: true,
      genre: true,
      published: true,
    },
  })

  console.log(`Found ${allStories.length} total stories:\n`)
  allStories.forEach((story, i) => {
    const keep = story.id === keepStoryId
    console.log(`${i + 1}. ${story.title} (${story.genre}) - ${keep ? '✅ KEEP' : '❌ DELETE'}`)
  })

  // Delete all stories except "Bound by Starfire"
  const result = await prisma.story.deleteMany({
    where: {
      id: {
        not: keepStoryId
      }
    }
  })

  console.log(`\n✅ Deleted ${result.count} test stories`)

  // Show what's left
  const remaining = await prisma.story.findMany({
    select: {
      id: true,
      title: true,
      genre: true,
      published: true,
    },
  })

  console.log(`\n📚 Remaining in database: ${remaining.length} story\n`)
  remaining.forEach(story => {
    console.log(`- ${story.title} (${story.genre}) - Published: ${story.published}`)
  })

  console.log('\n✨ Clean slate ready! You can now generate your 50 curated stories.')

  await prisma.$disconnect()
}

cleanSlate().catch(console.error)
