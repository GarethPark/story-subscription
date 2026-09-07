import OpenAI from 'openai'
import fs from 'fs'
import path from 'path'

const apiKey = process.env.OPENROUTER_API_KEY

if (!apiKey) {
  console.error('Set OPENROUTER_API_KEY in your environment (or .env) before running this script.')
  process.exit(1)
}

const openrouter = new OpenAI({
  apiKey,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': 'https://www.readsilk.com',
    'X-Title': 'Silk - Scorching tier model test',
  },
})

// Same heat guidance and prompt shape as app/api/admin/generate-story/[id]/execute/route.ts,
// so this is an apples-to-apples comparison against what Claude currently produces.
const SCORCHING_GUIDANCE =
  'Write maximally explicit, graphic sex scenes between consenting adult characters. Build sexual tension deliberately before each intimate scene - use anticipation, foreplay, and emotional/physical build-up so the scene lands with impact rather than starting abruptly. Once a scene begins, do not fade to black, summarize, or rely on vague euphemisms - describe the sex act explicitly and in full detail: anatomical language, physical sensations, movement, positions, and pacing. Include realistic, explicit dirty talk as direct quoted dialogue. Include multiple full-length intimate scenes across the story, each several paragraphs long, building in intensity. Make the characters\' enthusiastic mutual desire and consent clear and explicit in both narration and dialogue - this is adult erotica for a paying 18+ audience, so do not hold back on explicitness.'

const WORD_COUNT = 3000
const GENRE = 'Contemporary'
const TROPES = 'enemies to lovers, forced proximity'

function buildPrompt() {
  return `You are a bestselling romance novelist. Write a complete, engaging romance story with the following specifications:

Genre: ${GENRE} Romance
Heat Level: Scorching - ${SCORCHING_GUIDANCE}
Tropes: ${TROPES}
Length: Approximately ${WORD_COUNT} words

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
[The complete story text, approximately ${WORD_COUNT} words]`
}

const MODELS = [
  'anthracite-org/magnum-v4-72b',
  'sao10k/l3.3-euryale-70b',
  'cognitivecomputations/dolphin-mistral-24b-venice-edition',
]

async function testModel(model: string) {
  console.log(`\nGenerating with ${model}...`)
  const start = Date.now()

  try {
    const completion = await openrouter.chat.completions.create({
      model,
      max_tokens: 6000,
      temperature: 1,
      messages: [{ role: 'user', content: buildPrompt() }],
    })

    const text = completion.choices[0]?.message?.content ?? ''
    const elapsed = ((Date.now() - start) / 1000).toFixed(1)

    if (!text) {
      console.log(`  No content returned (finish_reason: ${completion.choices[0]?.finish_reason})`)
      return
    }

    const wordCount = text.split(/\s+/).length
    console.log(`  Done in ${elapsed}s, ~${wordCount} words, finish_reason: ${completion.choices[0]?.finish_reason}`)

    const outDir = path.join(process.cwd(), 'scripts', 'output')
    fs.mkdirSync(outDir, { recursive: true })
    const outFile = path.join(outDir, `openrouter-${model.replace(/\//g, '_')}.txt`)
    fs.writeFileSync(outFile, text, 'utf-8')
    console.log(`  Saved to ${outFile}`)
  } catch (error: any) {
    console.log(`  ERROR: ${error?.status ?? ''} ${error?.message ?? error}`)
  }
}

async function main() {
  console.log('Testing OpenRouter models for the Scorching heat level...')
  console.log(`Prompt: ${GENRE} romance, ${TROPES}, ~${WORD_COUNT} words\n`)

  for (const model of MODELS) {
    await testModel(model)
  }

  console.log('\nAll done. Read the files in scripts/output/ to compare quality and explicitness.')
}

main()
