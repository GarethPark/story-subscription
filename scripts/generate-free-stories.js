const { PrismaClient } = require('@prisma/client');
const Anthropic = require('@anthropic-ai/sdk').default;

const prisma = new PrismaClient();
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const STORIES_TO_GENERATE = [
  {
    genre: 'Small Town',
    tropes: ['grumpy sunshine', 'forced proximity'],
    heatLevel: 'Hot',
    wordCount: 6000,
  },
  {
    genre: 'Sports Romance',
    tropes: ['hockey romance', 'rival teams'],
    heatLevel: 'Hot',
    wordCount: 6000,
  },
  {
    genre: 'Historical',
    tropes: ['enemies to lovers', 'arranged marriage'],
    heatLevel: 'Hot',
    wordCount: 6000,
  },
  {
    genre: 'Romantic Suspense',
    tropes: ['bodyguard', 'forced proximity'],
    heatLevel: 'Hot',
    wordCount: 6000,
  },
];

const heatGuidance = {
  Sweet: 'Focus on emotional connection, longing looks, and innocent touches. Keep intimacy to kissing and fade to black.',
  Warm: 'Include some sensual tension, passionate kissing, and implied intimacy. Tasteful but romantic.',
  Hot: 'Write explicit sex scenes with anatomical details. Describe the physical sensations, movements, and positions. Include at least one full intimate scene that is several paragraphs long.',
  Scorching: 'Write very explicit, graphic sex scenes. Use direct language for body parts and sexual acts. Include multiple detailed intimate scenes throughout the story. Describe physical sensations, dirty talk, and erotic details. This is adult erotica - be bold and uninhibited.',
};

async function generateStory(config) {
  const tropesText = config.tropes.join(', ');

  const prompt = `You are a bestselling romance novelist writing for an adult romance fiction subscription service. Your readers are adults who have chosen to read romance fiction and expect the full range of romantic content including steamy and explicit scenes when requested.

Write a complete, engaging romance story with the following specifications:

Genre: ${config.genre} Romance
Heat Level: ${config.heatLevel} - ${heatGuidance[config.heatLevel]}
Tropes: ${tropesText}
Length: Approximately ${config.wordCount} words

Requirements:
1. Create compelling, three-dimensional characters with chemistry
2. Use UNIQUE, CREATIVE character names - avoid common romance names like Emma, Ethan, Sophia, Liam, etc. Choose distinctive names that fit the genre and setting
3. Include witty dialogue and emotional depth
4. Build sexual/romantic tension throughout
5. Include a satisfying emotional arc and happy ending (HEA)
6. Make it feel complete - beginning, middle, climactic resolution, and epilogue
7. Write in third person with close POV
8. Include vivid sensory details and emotional introspection
9. This is fiction for adult readers - embrace the heat level requested fully

After the story, on a new line, provide metadata in this EXACT format:
---METADATA---
TITLE: [A captivating, unique title]
SUMMARY: [A 2-3 sentence hook that would make readers want to read this story]
AUTHOR: [A creative pen name]
TAGS: [comma-separated list of 5-7 relevant tags including genre, tropes, and themes]

Write the full story now:`;

  console.log(`Generating ${config.genre} story with tropes: ${tropesText}...`);

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 16000,
    messages: [{ role: 'user', content: prompt }],
  });

  const fullText = response.content[0].type === 'text' ? response.content[0].text : '';

  // Parse the response
  const metadataMatch = fullText.match(/---METADATA---\s*([\s\S]*?)$/);
  let title = `Untitled ${config.genre} Romance`;
  let summary = `A ${config.heatLevel.toLowerCase()} ${config.genre.toLowerCase()} romance featuring ${tropesText}.`;
  let author = 'Silk Stories';
  let tags = `${config.genre}, ${config.tropes.join(', ')}, ${config.heatLevel}`;
  let content = fullText;

  if (metadataMatch) {
    const metadata = metadataMatch[1];
    content = fullText.replace(/---METADATA---[\s\S]*$/, '').trim();

    const titleMatch = metadata.match(/TITLE:\s*(.+)/i);
    const summaryMatch = metadata.match(/SUMMARY:\s*(.+)/i);
    const authorMatch = metadata.match(/AUTHOR:\s*(.+)/i);
    const tagsMatch = metadata.match(/TAGS:\s*(.+)/i);

    if (titleMatch) title = titleMatch[1].trim();
    if (summaryMatch) summary = summaryMatch[1].trim();
    if (authorMatch) author = authorMatch[1].trim();
    if (tagsMatch) tags = tagsMatch[1].trim();
  }

  return { title, summary, content, author, tags, genre: config.genre };
}

async function main() {
  console.log('Starting generation of 4 free stories...\n');

  for (let i = 0; i < STORIES_TO_GENERATE.length; i++) {
    const config = STORIES_TO_GENERATE[i];
    console.log(`\n[${i + 1}/${STORIES_TO_GENERATE.length}] Generating ${config.genre} story...`);

    try {
      // Create pending story
      const story = await prisma.story.create({
        data: {
          title: 'Generating...',
          summary: '',
          content: '',
          genre: config.genre,
          author: 'Silk Stories',
          tags: config.tropes.join(', '),
          readingTime: Math.ceil(config.wordCount / 200),
          ageRating: '18+',
          published: false,
          isCustom: false,
          generationStatus: 'GENERATING',
        },
      });

      console.log(`Created story record: ${story.id}`);

      // Generate content
      const result = await generateStory(config);

      // Update story with generated content
      const wordCount = result.content.split(/\s+/).length;
      await prisma.story.update({
        where: { id: story.id },
        data: {
          title: result.title,
          summary: result.summary,
          content: result.content,
          author: result.author,
          tags: result.tags,
          readingTime: Math.ceil(wordCount / 200),
          generationStatus: 'COMPLETED',
          published: true,
        },
      });

      console.log(`✅ Completed: "${result.title}" (${wordCount} words)`);

    } catch (error) {
      console.error(`❌ Failed to generate ${config.genre} story:`, error.message);
    }
  }

  console.log('\n✨ All stories generated!');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
