import { prisma } from '../lib/db'

/**
 * Script to add cover images to stories retrospectively
 *
 * Usage:
 * 1. Place your genre/trope images in /public/images/genre-tropes/
 * 2. Update the COVER_MAPPINGS below to map story IDs to image filenames
 * 3. Run: npx tsx scripts/add-cover-images.ts
 */

// Map story IDs to cover image paths
const COVER_MAPPINGS: Record<string, string> = {
  // Example:
  // 'cmk5b5c030001fedmpewtvoif': '/images/genre-tropes/romantasy_enemies-to-lovers.jpg',
  // Add more mappings as you generate stories
}

// OR use automatic mapping based on genre + first trope
async function autoMapCoverImages() {
  console.log('🎨 Adding cover images to stories...\n')

  const stories = await prisma.story.findMany({
    where: {
      published: true, // Only update published stories
    },
    select: {
      id: true,
      title: true,
      genre: true,
      tags: true,
      coverImage: true,
    },
  })

  console.log(`Found ${stories.length} published stories\n`)

  for (const story of stories) {
    // Check if manual mapping exists
    if (COVER_MAPPINGS[story.id]) {
      const coverPath = COVER_MAPPINGS[story.id]
      await prisma.story.update({
        where: { id: story.id },
        data: { coverImage: coverPath },
      })
      console.log(`✅ ${story.title}: ${coverPath}`)
      continue
    }

    // Auto-detect based on genre + first trope
    if (story.tags && story.genre) {
      const firstTrope = story.tags.split(',')[0]?.trim().toLowerCase().replace(/\s+/g, '-')
      const genreSlug = story.genre.toLowerCase().replace(/\s+/g, '-')

      // Build expected filename
      const imagePath = `/images/genre-tropes/${genreSlug}_${firstTrope}.jpg`

      await prisma.story.update({
        where: { id: story.id },
        data: { coverImage: imagePath },
      })
      console.log(`✅ ${story.title}: ${imagePath}`)
    } else {
      console.log(`⚠️  ${story.title}: No tags/genre - skipped`)
    }
  }

  console.log('\n✨ Cover images updated!')
  await prisma.$disconnect()
}

// Manual update for specific story
async function updateSingleStory(storyId: string, imagePath: string) {
  const story = await prisma.story.update({
    where: { id: storyId },
    data: { coverImage: imagePath },
    select: { title: true },
  })

  console.log(`✅ Updated cover for: ${story.title}`)
  console.log(`   Image: ${imagePath}`)

  await prisma.$disconnect()
}

// Main execution
async function main() {
  const args = process.argv.slice(2)

  if (args.length === 2) {
    // Manual mode: npx tsx scripts/add-cover-images.ts [storyId] [imagePath]
    const [storyId, imagePath] = args
    await updateSingleStory(storyId, imagePath)
  } else {
    // Auto mode: npx tsx scripts/add-cover-images.ts
    await autoMapCoverImages()
  }
}

main().catch(console.error)
