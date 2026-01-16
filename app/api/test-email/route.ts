import { NextRequest, NextResponse } from 'next/server'
import {
  sendStoryReadyEmail,
  sendWelcomeEmail,
  sendSubscriptionConfirmationEmail,
  sendCreditsRenewedEmail,
  sendSubscriptionCancelledEmail,
  sendLowCreditsWarningEmail,
  notifyAdminNewUser,
  notifyAdminNewFeedback,
  notifyAdminPaymentFailed,
  notifyAdminError,
} from '@/lib/email'

// Only allow in development
const isDev = process.env.NODE_ENV === 'development'

export async function POST(request: NextRequest) {
  if (!isDev) {
    return NextResponse.json(
      { error: 'Test endpoint only available in development' },
      { status: 403 }
    )
  }

  try {
    const body = await request.json()
    const { emailType, to } = body

    if (!emailType) {
      return NextResponse.json(
        { error: 'emailType is required' },
        { status: 400 }
      )
    }

    if (!to) {
      return NextResponse.json(
        { error: 'to (email address) is required' },
        { status: 400 }
      )
    }

    let result

    switch (emailType) {
      case 'story-ready':
        result = await sendStoryReadyEmail({
          to,
          userName: 'Test User',
          storyTitle: 'The Moonlit Ballroom',
          storyId: 'test-story-123',
          genre: 'Romantasy',
        })
        break

      case 'welcome':
        result = await sendWelcomeEmail({
          to,
          userName: 'Test User',
        })
        break

      case 'subscription-confirmation':
        result = await sendSubscriptionConfirmationEmail({
          to,
          userName: 'Test User',
          tier: 'STANDARD',
          credits: 10,
        })
        break

      case 'credits-renewed':
        result = await sendCreditsRenewedEmail({
          to,
          userName: 'Test User',
          credits: 10,
          tier: 'STANDARD',
        })
        break

      case 'subscription-cancelled':
        result = await sendSubscriptionCancelledEmail({
          to,
          userName: 'Test User',
          remainingCredits: 3,
        })
        break

      case 'low-credits':
        result = await sendLowCreditsWarningEmail({
          to,
          userName: 'Test User',
          remainingCredits: 1,
        })
        break

      case 'admin-new-user':
        result = await notifyAdminNewUser({
          userName: 'Test User',
          userEmail: to,
        })
        break

      case 'admin-feedback':
        result = await notifyAdminNewFeedback({
          userName: 'Test User',
          userEmail: to,
          subject: 'Test Feedback',
          message: 'This is a test feedback message to verify the email template looks correct.',
        })
        break

      case 'admin-payment-failed':
        result = await notifyAdminPaymentFailed({
          customerEmail: to,
          amount: 999,
          error: 'Card declined - insufficient funds',
        })
        break

      case 'admin-error':
        result = await notifyAdminError({
          context: 'Test Error Context',
          error: 'This is a test error message to verify the error notification template.',
          userId: 'test-user-123',
        })
        break

      default:
        return NextResponse.json(
          {
            error: 'Invalid emailType',
            validTypes: [
              'story-ready',
              'welcome',
              'subscription-confirmation',
              'credits-renewed',
              'subscription-cancelled',
              'low-credits',
              'admin-new-user',
              'admin-feedback',
              'admin-payment-failed',
              'admin-error',
            ],
          },
          { status: 400 }
        )
    }

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Test email "${emailType}" sent to ${to}`,
        data: result.data,
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Test email error:', error)
    return NextResponse.json(
      { error: 'Failed to send test email' },
      { status: 500 }
    )
  }
}

// GET endpoint to show available email types
export async function GET() {
  if (!isDev) {
    return NextResponse.json(
      { error: 'Test endpoint only available in development' },
      { status: 403 }
    )
  }

  return NextResponse.json({
    message: 'Email test endpoint',
    usage: 'POST /api/test-email with { emailType, to }',
    emailTypes: {
      'User Emails': [
        { type: 'story-ready', description: 'Sent when a story is ready to read' },
        { type: 'welcome', description: 'Sent when a new user signs up' },
        { type: 'subscription-confirmation', description: 'Sent when user subscribes' },
        { type: 'credits-renewed', description: 'Sent on monthly credit renewal' },
        { type: 'subscription-cancelled', description: 'Sent when subscription ends' },
        { type: 'low-credits', description: 'Sent when user has 1 credit left' },
      ],
      'Admin Emails': [
        { type: 'admin-new-user', description: 'Notifies admin of new signup' },
        { type: 'admin-feedback', description: 'Notifies admin of feedback' },
        { type: 'admin-payment-failed', description: 'Notifies admin of failed payment' },
        { type: 'admin-error', description: 'Notifies admin of system error' },
      ],
    },
    example: {
      method: 'POST',
      body: {
        emailType: 'welcome',
        to: 'your-email@example.com',
      },
    },
  })
}
