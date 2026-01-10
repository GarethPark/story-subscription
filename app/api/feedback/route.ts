import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth/session'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    const { name, email, subject, message } = await request.json()

    // Validate message
    if (!message || message.trim().length < 10) {
      return NextResponse.json(
        { error: 'Message must be at least 10 characters' },
        { status: 400 }
      )
    }

    // Create feedback
    const feedback = await prisma.feedback.create({
      data: {
        userId: user?.id || null,
        name: name?.trim() || null,
        email: email?.trim() || null,
        subject: subject?.trim() || null,
        message: message.trim(),
      },
    })

    return NextResponse.json({
      success: true,
      feedbackId: feedback.id,
    })
  } catch (error) {
    console.error('Feedback submission error:', error)
    return NextResponse.json(
      { error: 'Failed to submit feedback' },
      { status: 500 }
    )
  }
}
