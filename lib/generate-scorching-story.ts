import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'

export interface ScorchingStoryConfig {
  genre: string
  tropes: string[]
  wordCount?: number
  protagonistName?: string
  loveInterestName?: string
  customScenario?: string
}

export interface ParsedStory {
  title: string
  author: string
  summary: string
  tags: string
  content: string
}

const OPENROUTER_MODEL = 'anthracite-org/magnum-v4-72b'
const MAX_OPENROUTER_ATTEMPTS = 2

const SCORCHING_GUIDANCE =
  'Write maximally explicit, graphic sex scenes between consenting adult characters. Build sexual tension deliberately before each intimate scene - use anticipation, foreplay, and emotional/physical build-up so the scene lands with impact rather than starting abruptly. Once a scene begins, do NOT stop, wrap up, fade to black, summarize, or rely on vague euphemisms - continue writing through the entire act in full explicit detail: anatomical language, physical sensations, movement, positions, and pacing, until it reaches its natural climax and aftermath. Include realistic, explicit dirty talk as direct quoted dialogue. Include multiple full-length intimate scenes across the story, each several paragraphs long, building in intensity. Make the characters\' enthusiastic mutual desire and consent clear and explicit in both narration and dialogue - this is adult erotica for a paying 18+ audience, so do not hold back on explicitness, and do not end the story or a scene early.'

function buildPrompt(config: ScorchingStoryConfig): string {
  const tropesText = config.tropes.join(', ')
  const wordCount = config.wordCount || 3500

  let characterInstruction = 'Use UNIQUE, CREATIVE character names - avoid common romance names like Emma, Ethan, Sophia, Liam, etc. Choose distinctive names that fit the genre and setting'
  if (config.protagonistName || config.loveInterestName) {
    characterInstruction = 'Character names:\n'
    if (config.protagonistName) characterInstruction += `- Protagonist: ${config.protagonistName}\n`
    if (config.loveInterestName) characterInstruction += `- Love Interest: ${config.loveInterestName}\n`
    characterInstruction += 'Use these exact names for the main characters.'
  }

  const scenarioInstruction = config.customScenario
    ? `\n\nPlot/Setting Details:\n${config.customScenario}\n\nIncorporate these details naturally into your story.`
    : ''

  return `You are a bestselling romance novelist. Write a complete, engaging romance story with the following specifications:

Genre: ${config.genre} Romance
Heat Level: Scorching - ${SCORCHING_GUIDANCE}
Tropes: ${tropesText}
Length: Approximately ${wordCount} words${scenarioInstruction}

Requirements:
1. Create compelling, three-dimensional characters with chemistry
2. ${characterInstruction}
3. Include witty dialogue and emotional depth
4. Build sexual/romantic tension throughout
5. Include a satisfying emotional arc and an unambiguous happy ending (HEA) - the leads must end the story clearly, visibly together and committed. Do not end on doubt, conflict, or a cliffhanger.
6. Make it feel complete - beginning, middle, climactic resolution, and epilogue. Do not stop writing until you reach the epilogue.
7. Write in third person with close POV throughout - do not switch to first person at any point
8. Include vivid sensory details and emotional introspection
9. Use correct, consistent character names throughout - do not swap or invent alternate names for the same character
10. Write clean, coherent prose - no corrupted text, code fragments, foreign-language noise, or non-sequitur tokens
11. Respond with ONLY the formatted story below - no preamble, no "here is your story" framing, nothing before the TITLE line

Please provide the story in this exact format:

TITLE: [An engaging, marketable romance title]

AUTHOR: [A pen name that sounds like a romance author]

SUMMARY: [A 2-3 sentence compelling book description that would hook readers]

TAGS: [5-7 comma-separated tags like "enemies to lovers, steamy, billionaire, second chance"]

STORY:
[The complete story text, approximately ${wordCount} words]`
}

function parseStoryResponse(responseText: string): ParsedStory | null {
  const titleMatch = responseText.match(/TITLE:\s*(.+?)(?:\n|$)/i)
  const authorMatch = responseText.match(/AUTHOR:\s*(.+?)(?:\n|$)/i)
  const summaryMatch = responseText.match(/SUMMARY:\s*(.+?)(?:\n\n|TAGS:|STORY:)/is)
  const tagsMatch = responseText.match(/TAGS:\s*(.+?)(?:\n|$)/i)
  const storyMatch = responseText.match(/STORY:\s*\n([\s\S]+)$/i)

  if (!titleMatch || !authorMatch || !summaryMatch || !storyMatch) {
    return null
  }

  return {
    title: titleMatch[1].trim(),
    author: authorMatch[1].trim(),
    summary: summaryMatch[1].trim(),
    tags: tagsMatch ? tagsMatch[1].trim() : '',
    content: storyMatch[1].trim(),
  }
}

async function generateOnceWithOpenRouter(
  openrouter: OpenAI,
  config: ScorchingStoryConfig
): Promise<ParsedStory | null> {
  const completion = await openrouter.chat.completions.create({
    model: OPENROUTER_MODEL,
    max_tokens: 9000,
    temperature: 0.9,
    messages: [{ role: 'user', content: buildPrompt(config) }],
  })

  const text = completion.choices[0]?.message?.content ?? ''
  if (!text) return null

  return parseStoryResponse(text)
}

interface ValidationResult {
  passed: boolean
  reason: string
}

export async function validateScorchingStory(anthropic: Anthropic, story: ParsedStory): Promise<ValidationResult> {
  const prompt = `You are a quality-control editor for a romance fiction platform. Read the story below and check three things:

1. has_resolved_happy_ending: Does the story end with the two leads clearly, unambiguously together and happy - not open-ended, not a cliffhanger, not unresolved conflict?
2. has_explicit_content: Does the story contain at least one on-page, graphically explicit sex scene (explicit anatomical language and physical detail) - not just an implied, vague, or fade-to-black reference?
3. is_clean_prose: Is the prose clean and coherent - no leaked preamble text (like "here is your story"), no switching to first person, no corrupted or garbled text, no repeated/swapped character names?

Story:
"""
${story.content}
"""

Respond with ONLY a single JSON object, no other text, no markdown code fences, in exactly this shape:
{"has_resolved_happy_ending": boolean, "has_explicit_content": boolean, "is_clean_prose": boolean, "reason": "one sentence explaining any false value, or empty string if all true"}`

  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 500,
    thinking: { type: 'disabled' },
    messages: [{ role: 'user', content: prompt }],
  })

  const block = response.content[0]
  const text = block?.type === 'text' ? block.text : ''
  const jsonMatch = text.match(/\{[\s\S]*\}/)

  if (!jsonMatch) {
    return { passed: false, reason: 'Validator did not return parseable JSON' }
  }

  try {
    const parsed = JSON.parse(jsonMatch[0])
    const passed = Boolean(parsed.has_resolved_happy_ending && parsed.has_explicit_content && parsed.is_clean_prose)
    return { passed, reason: parsed.reason || '' }
  } catch {
    return { passed: false, reason: 'Validator JSON failed to parse' }
  }
}

/**
 * Attempts to generate a Scorching-tier story via OpenRouter, validating each
 * attempt with a Claude Haiku judge. Returns null if OPENROUTER_API_KEY is
 * unset, or if every attempt fails validation - callers should fall back to
 * their normal Claude generation path in either case.
 */
export async function generateScorchingStoryViaOpenRouter(
  anthropic: Anthropic,
  config: ScorchingStoryConfig
): Promise<ParsedStory | null> {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) return null

  const openrouter = new OpenAI({
    apiKey,
    baseURL: 'https://openrouter.ai/api/v1',
    defaultHeaders: {
      'HTTP-Referer': 'https://www.readsilk.com',
      'X-Title': 'Silk - Scorching tier generation',
    },
  })

  for (let attempt = 1; attempt <= MAX_OPENROUTER_ATTEMPTS; attempt++) {
    let story: ParsedStory | null = null
    try {
      story = await generateOnceWithOpenRouter(openrouter, config)
    } catch (error) {
      console.error(`OpenRouter generation attempt ${attempt} failed:`, error)
      continue
    }

    if (!story) {
      console.error(`OpenRouter generation attempt ${attempt} did not parse into a story`)
      continue
    }

    const validation = await validateScorchingStory(anthropic, story)
    if (validation.passed) {
      return story
    }

    console.error(`OpenRouter generation attempt ${attempt} failed validation: ${validation.reason}`)
  }

  return null
}
