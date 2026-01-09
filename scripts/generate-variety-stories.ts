/**
 * Generate 10 stories across all genres to match new cover images
 */

const STORY_CONFIGS = [
  // Contemporary Romance (3)
  {
    genre: 'Contemporary',
    tropes: ['enemies to lovers', 'forced proximity'],
    length: 'medium',
  },
  {
    genre: 'Contemporary',
    tropes: ['office romance', 'billionaire'],
    length: 'medium',
  },
  {
    genre: 'Contemporary',
    tropes: ['second chance romance', 'small town'],
    length: 'medium',
  },

  // Dark Romance (3)
  {
    genre: 'Dark Romance',
    tropes: ['mafia romance', 'possessive hero'],
    length: 'long',
  },
  {
    genre: 'Dark Romance',
    tropes: ['enemies to lovers', 'captive'],
    length: 'long',
  },
  {
    genre: 'Dark Romance',
    tropes: ['dark romance', 'anti-hero'],
    length: 'medium',
  },

  // Romantasy (4)
  {
    genre: 'Romantasy',
    tropes: ['dragon shifter', 'fated mates'],
    length: 'long',
  },
  {
    genre: 'Romantasy',
    tropes: ['fated mates', 'forbidden love'],
    length: 'medium',
  },
  {
    genre: 'Romantasy',
    tropes: ['morally gray hero', 'enemies to lovers'],
    length: 'long',
  },
  {
    genre: 'Romantasy',
    tropes: ['vampire romance', 'forbidden love'],
    length: 'medium',
  },
]

async function generateStories() {
  console.log('🎨 Generating 10 stories across all genres...\n')

  for (let i = 0; i < STORY_CONFIGS.length; i++) {
    const config = STORY_CONFIGS[i]

    console.log(`\n[${i + 1}/10] Generating ${config.genre} story...`)
    console.log(`   Tropes: ${config.tropes.join(', ')}`)
    console.log(`   Length: ${config.length}`)

    try {
      // Call generation API directly (using production)
      const response = await fetch(
        `https://romance-story-subscription.vercel.app/api/admin/generate-story`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            genre: config.genre,
            tropes: config.tropes,
            length: config.length,
          }),
        }
      )

      if (!response.ok) {
        const error = await response.text()
        console.log(`   ❌ Generation failed: ${response.status}`)
        continue
      }

      const result = await response.json()
      console.log(`   ✅ Story request created: ${result.id}`)

      // Now execute the generation
      const executeResponse = await fetch(
        `https://romance-story-subscription.vercel.app/api/admin/generate-story/${result.id}/execute`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        }
      )

      if (!executeResponse.ok) {
        console.log(`   ❌ Execution failed: ${executeResponse.status}`)
        continue
      }

      const executeResult = await executeResponse.json()
      console.log(`   ✅ Story generated: "${executeResult.story.title}"`)
      console.log(`   📖 ${executeResult.story.content.length} characters`)

      // Small delay between generations
      await new Promise(resolve => setTimeout(resolve, 2000))

    } catch (error) {
      console.error(`   ❌ Error:`, error)
    }
  }

  console.log('\n\n✨ Batch generation complete!')
}

generateStories().catch(console.error)
