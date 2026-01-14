import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth/session'
import { notifyAdminNewFeedback } from '@/lib/email'

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

    // Notify admin of new feedback
    if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 'your-resend-api-key-here') {
      try {
        await notifyAdminNewFeedback({
          userName: name?.trim(),
          userEmail: email?.trim(),
          subject: subject?.trim() || 'General Feedback',
          message: message.trim(),
        })
      } catch (notifyError) {
        console.error('Failed to notify admin:', notifyError)
      }
    }

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
