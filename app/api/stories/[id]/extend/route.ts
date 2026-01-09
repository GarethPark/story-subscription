import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Get user from session (you'll need to implement this based on your auth)
    // For now, we'll skip auth check - you can add it later
    // const session = await getSession(request)
    // if (!session) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    // Get the parent story
    const parentStory = await prisma.story.findUnique({
      where: { id },
      include: {
        extensions: {
          orderBy: { chapterNumber: 'desc' },
          take: 1,
        },
      },
    })

    if (!parentStory) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 })
    }

    // Determine next chapter number
    const nextChapterNumber = parentStory.extensions.length > 0
      ? parentStory.extensions[0].chapterNumber + 1
      : 2

    // Create the extension story record
    const extension = await prisma.story.create({
      data: {
        title: `${parentStory.title} - Chapter ${nextChapterNumber}`,
        summary: `Continuation of ${parentStory.title}`,
        content: '',
        author: parentStory.author,
        genre: parentStory.genre,
        tags: parentStory.tags,
        published: false,
        generationStatus: 'GENERATING',
        parentStoryId: parentStory.id,
        chapterNumber: nextChapterNumber,
        isCustom: true,
      },
    })

    // Generate the extension content
    try {
      const prompt = `You are a romance novelist. Continue this story as Chapter ${nextChapterNumber}.

Original Story Title: ${parentStory.title}
Genre: ${parentStory.genre}
Tropes: ${parentStory.tags}

Previous Chapter:
${parentStory.content}

Write Chapter ${nextChapterNumber} that:
1. Continues directly from where the previous chapter ended
2. Maintains the same tone, style, and character voices
3. Develops the romance further with new tension or intimacy
4. Includes vivid sensory details and emotional depth
5. Ends with a compelling hook that could lead to another chapter
6. Is approximately 3000-4000 words

Write ONLY the story content for Chapter ${nextChapterNumber}. Do not include "Chapter ${nextChapterNumber}" as a heading.`

      const message = await anthropic.messages.create({
        model: 'claude-opus-4-20250514',
        max_tokens: 16000,
        temperature: 1,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      })

      const content = message.content[0].type === 'text' ? message.content[0].text : ''

      // Calculate reading time (assuming 200 words per minute)
      const wordCount = content.split(/\s+/).length
      const readingTime = Math.ceil(wordCount / 200)

      // Update the extension with generated content
      const updatedExtension = await prisma.story.update({
        where: { id: extension.id },
        data: {
          content,
          readingTime,
          generationStatus: 'COMPLETED',
          published: true,
        },
      })

      return NextResponse.json({
        success: true,
        extension: updatedExtension,
      })
    } catch (error) {
      // Mark as failed if generation errors
      await prisma.story.update({
        where: { id: extension.id },
        data: {
          generationStatus: 'FAILED',
          generationError: error instanceof Error ? error.message : 'Unknown error',
        },
      })

      throw error
    }
  } catch (error) {
    console.error('Extension generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate extension' },
      { status: 500 }
    )
  }
}
