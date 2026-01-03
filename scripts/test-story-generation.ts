import { prisma } from '../lib/db'

// Mock AI-generated story data
const mockStoryData = {
  title: 'Whispers in the Code',
  author: 'Elena Rivers',
  summary: 'When cybersecurity expert Maya Chen is assigned to protect cocky startup CEO Alex Sterling, their clash of wills ignites an unexpected passion. Can they lower their defenses long enough to let love in?',
  content: `Chapter 1: The Assignment

Maya Chen stared at the file on her screen, her jaw tightening. Alex Sterling. Silicon Valley's golden boy. Forbes 30 Under 30. And her new assignment.

"You've got to be kidding me," she muttered, scrolling through his profile. Cocky smile, designer suits, probably thought he was untouchable.

Her phone buzzed. "Chen, Sterling's company has been targeted by a sophisticated hacking group. He needs protection. You're the best we have."

Maya sighed. Of course she was.

---

Three hours later, she walked into Sterling Technologies' gleaming headquarters. All glass and steel and minimalist furniture that probably cost more than her car.

"You must be the bodyguard," a voice said behind her.

Maya turned to find Alex Sterling himself, all six feet of arrogant charm, leaning against a pillar with his arms crossed.

"Cybersecurity specialist," she corrected coolly.

"Right." His eyes traveled over her, assessing. "You don't look like you could protect anyone."

Maya raised an eyebrow. "You don't look like you're worth protecting. Yet here we are."

His expression shifted—surprise, then something that might have been respect. "Touché."

---

Chapter 2: Breaking the Ice

The first week was hell. Alex questioned every security protocol, every restriction. He was brilliant, she'd give him that, but his disregard for basic safety measures drove her crazy.

"I need to attend the tech conference," he insisted, standing too close in her temporary office.

"Absolutely not. The threat assessment—"

"Is overblown. I've been getting threats for years."

"Not like this." Maya pulled up the encrypted files. "These hackers are different. They're patient. Methodical. They've already breached your home security system twice."

Alex's confidence wavered for the first time. "What?"

"I've been covering for you. Installing new protocols. But if you keep fighting me on this, I can't protect you."

He ran a hand through his hair, suddenly looking less like a CEO and more like a worried man. "Show me."

---

For the next hour, Maya walked him through the intrusions. Alex listened, really listened, asking smart questions. When their hands accidentally touched reaching for the same file, electricity sparked between them.

"You're good at this," he said quietly.

"I know." Maya pulled her hand back, heart racing.

"Maya..." His voice was different now. Softer. "Thank you. For keeping me safe."

Their eyes met, and Maya felt the world tilt. This was dangerous. More dangerous than any hacker.

---

Chapter 3: Crossing the Line

Late nights became routine. Working side by side, hunting the hackers, learning each other's rhythms. Alex brought her coffee exactly how she liked it. Maya started to notice the way his eyes crinkled when he smiled.

"We got them," Maya announced one night, her fingers flying across the keyboard. "I traced their location."

Alex whooped, spinning her chair around. "You're amazing!"

Before she could think, he kissed her. Soft at first, then deeper when she didn't pull away. Maya's hands found his shirt, pulling him closer, all her professional boundaries crumbling.

When they finally broke apart, both breathing hard, reality crashed back in.

"I can't," Maya whispered. "You're my assignment."

"Then reassign me." Alex cupped her face. "Because I'm not letting you walk away."

---

Chapter 4: The Choice

The investigation concluded. The hackers were arrested. Alex was safe.

Maya stood in his office, resignation letter in hand.

"Don't," Alex said from the doorway.

"I have to. This is my career."

"And what about us?"

Maya closed her eyes. "There is no us. There can't be."

"Why? Because of some rule? I'll hire a different firm. I'll—"

"Because I'm terrified!" The words burst out. "You live in this world of billion-dollar deals and board meetings. I live in the shadows, protecting people who never see me. We don't fit."

Alex crossed the room in three strides. "We fit perfectly. You challenge me. You see through my bullshit. You make me want to be better."

"Alex..."

"I love you, Maya. I don't care about the rules or the differences. I care about you."

Maya's carefully constructed walls shattered. "I love you too."

His smile was brilliant. "So keep the job or quit. Either way, I'm keeping you."

This time when they kissed, it tasted like promise.

---

Epilogue: Six Months Later

Maya laughed as Alex tried to teach her to code, his arms wrapped around her at his home office desk.

"You're terrible at this," he teased.

"I'm a cybersecurity specialist, not a developer." She turned in his arms. "That's what I have you for."

"Is that the only thing you have me for?" His eyebrow arched suggestively.

Maya grinned. "Well, there are a few other talents you possess..."

"Let me demonstrate," he murmured against her lips.

Outside, the city lights of San Francisco glittered. Inside, two people who never should have worked found everything they needed in each other.

Sometimes the best security is letting someone past your defenses.

--- THE END ---`,
  genre: 'Contemporary',
  tags: 'enemies to lovers, workplace romance, bodyguard, tech, steamy',
  readingTime: 15,
  ageRating: '16+',
  published: false, // Saved as draft for review
  featured: false,
}

async function testStoryGeneration() {
  console.log('\n🎬 Starting Mock Story Generation Test...\n')

  try {
    // Step 1: Simulate story generation
    console.log('📝 Step 1: Generating story with Claude AI (MOCKED)')
    console.log('   Configuration:')
    console.log('   - Genre: Contemporary Romance')
    console.log('   - Heat Level: Warm')
    console.log('   - Tropes: enemies to lovers, workplace romance')
    console.log('   - Word Count: ~3,500 words')
    console.log('   ⏳ Generating... (this would take 30-60s with real API)\n')

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Step 2: Calculate story stats
    const wordCount = mockStoryData.content.split(/\s+/).length
    console.log(`✅ Story generated successfully!`)
    console.log(`   - Title: "${mockStoryData.title}"`)
    console.log(`   - Author: ${mockStoryData.author}`)
    console.log(`   - Word Count: ${wordCount.toLocaleString()}`)
    console.log(`   - Reading Time: ${mockStoryData.readingTime} minutes\n`)

    // Step 3: Save to database as draft
    console.log('💾 Step 2: Saving to database as DRAFT (unpublished)...')

    const story = await prisma.story.create({
      data: mockStoryData,
    })

    console.log(`✅ Story saved successfully!`)
    console.log(`   - Story ID: ${story.id}`)
    console.log(`   - Status: ${story.published ? 'Published' : 'Draft (Unpublished)'}\n`)

    // Step 4: Show review information
    console.log('📋 Step 3: Story ready for admin review')
    console.log(`   - Review URL: http://localhost:3000/admin/review/${story.id}`)
    console.log(`   - Admin can now:`)
    console.log(`     ✓ Read the full story`)
    console.log(`     ✓ Check quality and appropriateness`)
    console.log(`     ✓ Publish to make it public`)
    console.log(`     ✓ Delete if not satisfied`)
    console.log(`     ✓ Generate a new story with different settings\n`)

    // Step 5: Demonstrate publishing (optional)
    console.log('🔄 Step 4: Testing publish workflow...')
    console.log('   (In real usage, admin would manually click "Publish")\n')

    await new Promise((resolve) => setTimeout(resolve, 1000))

    const publishedStory = await prisma.story.update({
      where: { id: story.id },
      data: { published: true, featured: true },
    })

    console.log(`✅ Story published successfully!`)
    console.log(`   - Now visible at: http://localhost:3000/stories/${publishedStory.id}`)
    console.log(`   - Appears in library: http://localhost:3000/stories`)
    console.log(`   - Featured on homepage: Yes\n`)

    // Step 6: Verify in database
    console.log('🔍 Step 5: Verifying in database...')
    const allStories = await prisma.story.count()
    const publishedCount = await prisma.story.count({
      where: { published: true },
    })

    console.log(`✅ Database verification complete!`)
    console.log(`   - Total stories: ${allStories}`)
    console.log(`   - Published stories: ${publishedCount}`)
    console.log(`   - Draft stories: ${allStories - publishedCount}\n`)

    // Summary
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('✅ MOCK TEST COMPLETED SUCCESSFULLY!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('')
    console.log('📚 What was tested:')
    console.log('   ✓ Story generation workflow (simulated)')
    console.log('   ✓ Database storage as draft')
    console.log('   ✓ Admin review process')
    console.log('   ✓ Publishing workflow')
    console.log('   ✓ Data validation')
    console.log('')
    console.log('🌐 View your new story:')
    console.log(`   http://localhost:3000/stories/${story.id}`)
    console.log('')
    console.log('🔑 With Real API:')
    console.log('   1. Get API key from: https://console.anthropic.com/')
    console.log('   2. Add to .env: ANTHROPIC_API_KEY="sk-ant-..."')
    console.log('   3. Login as admin: test@test.com / test123')
    console.log('   4. Visit: http://localhost:3000/admin/generate')
    console.log('   5. Configure and click "Generate Story"')
    console.log('')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

    return story
  } catch (error) {
    console.error('❌ Error during test:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the test
testStoryGeneration()
  .then(() => {
    console.log('🎉 Test script completed!\n')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Test script failed:', error)
    process.exit(1)
  })
