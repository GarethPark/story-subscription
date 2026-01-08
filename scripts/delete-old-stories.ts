import { prisma } from '../lib/db'

async function deleteOldStories() {
  console.log('🗑️  Cleaning up old stories...\n')

  // Delete stories with old genres (Paranormal, Fantasy, Suspense)
  const oldGenres = await prisma.story.deleteMany({
    where: {
      genre: {
        in: ['Paranormal', 'Fantasy', 'Suspense']
      }
    }
  })
  console.log(`✅ Deleted ${oldGenres.count} stories with old genres (Paranormal, Fantasy, Suspense)`)

  // Delete FAILED stories
  const failedStories = await prisma.story.deleteMany({
    where: {
      generationStatus: 'FAILED'
    }
  })
  console.log(`✅ Deleted ${failedStories.count} FAILED stories`)

  // Delete PENDING stories older than 1 day (stuck in limbo)
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
  const stuckPending = await prisma.story.deleteMany({
    where: {
      generationStatus: 'PENDING',
      createdAt: {
        lt: oneDayAgo
      }
    }
  })
  console.log(`✅ Deleted ${stuckPending.count} stuck PENDING stories (older than 1 day)`)

  // Count remaining stories
  const remaining = await prisma.story.count()
  console.log(`\n📚 ${remaining} stories remaining in database`)

  // Show remaining stories
  const stories = await prisma.story.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      genre: true,
      published: true,
      generationStatus: true,
    },
  })

  console.log('\nRemaining stories:')
  stories.forEach((story, i) => {
    console.log(`${i + 1}. [${story.generationStatus}] ${story.title} (${story.genre}) - Published: ${story.published}`)
  })

  await prisma.$disconnect()
}

deleteOldStories().catch(console.error)
