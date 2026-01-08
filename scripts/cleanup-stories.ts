import { prisma } from '../lib/db'

async function cleanupStories() {
  console.log('🔍 Fetching all stories...\n')

  // Get all stories
  const allStories = await prisma.story.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      genre: true,
      published: true,
      createdAt: true,
      userId: true,
      generationStatus: true,
    },
  })

  console.log(`Found ${allStories.length} stories:\n`)

  allStories.forEach((story, index) => {
    console.log(`${index + 1}. [${story.generationStatus}] ${story.title}`)
    console.log(`   Genre: ${story.genre} | Published: ${story.published} | Created: ${story.createdAt.toISOString()}`)
    console.log(`   ID: ${story.id} | UserID: ${story.userId || 'admin'}\n`)
  })

  // Find stories with old genres (Paranormal, Fantasy, Suspense)
  const oldGenreStories = allStories.filter(s =>
    s.genre && ['Paranormal', 'Fantasy', 'Suspense'].includes(s.genre)
  )

  if (oldGenreStories.length > 0) {
    console.log(`\n⚠️  Found ${oldGenreStories.length} stories with OLD genres (Paranormal, Fantasy, Suspense)`)
    console.log('These are legacy stories that should be deleted.\n')

    // Ask for confirmation (in real use, but for script we'll just show)
    console.log('To delete these, uncomment the delete code below.\n')

    // Uncomment to actually delete:
    // const deleted = await prisma.story.deleteMany({
    //   where: {
    //     genre: {
    //       in: ['Paranormal', 'Fantasy', 'Suspense']
    //     }
    //   }
    // })
    // console.log(`✅ Deleted ${deleted.count} old stories`)
  }

  // Find the most recent story (likely the one just generated)
  const latestStory = allStories[0]
  if (latestStory) {
    console.log('\n📚 MOST RECENT STORY:')
    console.log(`Title: ${latestStory.title}`)
    console.log(`Genre: ${latestStory.genre}`)
    console.log(`Status: ${latestStory.generationStatus}`)
    console.log(`Published: ${latestStory.published}`)
    console.log(`View/Edit: https://romance-story-subscription.vercel.app/admin/review/${latestStory.id}`)
  }

  await prisma.$disconnect()
}

cleanupStories().catch(console.error)
