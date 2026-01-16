import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// Use Resend's test domain in development, real domain in production
const FROM_EMAIL = process.env.NODE_ENV === 'development'
  ? 'Silk Stories <onboarding@resend.dev>'
  : 'Silk Stories <stories@readsilk.com>'
const ADMIN_EMAIL = 'garethpark@yahoo.com'

// Genre image mapping
const GENRE_IMAGES: Record<string, string> = {
  'Contemporary': '/images/genre-tropes/contemporary_grumpy-sunshine.png',
  'Dark Romance': '/images/genre-tropes/dark-romance_forbidden-love.png',
  'Romantasy': '/images/genre-tropes/romantasy_enemies-to-lovers.png',
  'Fantasy': '/images/genre-tropes/romantasy_enemies-to-lovers.png',
  'Historical': '/images/genre-tropes/contemporary_grumpy-sunshine.png',
  'Paranormal': '/images/genre-tropes/dark-romance_morally-gray-hero.png',
  'Suspense': '/images/genre-tropes/dark-romance_morally-gray-hero.png',
}

export async function sendStoryReadyEmail({
  to,
  userName,
  storyTitle,
  storyId,
  genre,
}: {
  to: string
  userName: string
  storyTitle: string
  storyId: string
  genre?: string
}) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://readsilk.com'
  const storyUrl = `${baseUrl}/stories/${storyId}`
  const genreImage = genre ? GENRE_IMAGES[genre] || GENRE_IMAGES['Contemporary'] : GENRE_IMAGES['Contemporary']
  const imageUrl = `${baseUrl}${genreImage}`

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Your story "${storyTitle}" is ready! 📖`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Story is Ready</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Georgia', serif; background: linear-gradient(to bottom, #000000, #1a1a1a); color: #ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #000000;">
    <!-- Header -->
    <tr>
      <td style="padding: 40px 30px; text-align: center; background: linear-gradient(to right, #be123c, #7c2d12); border-bottom: 2px solid #fb7185;">
        <h1 style="margin: 0; font-size: 36px; font-weight: 900; background: linear-gradient(to right, #fda4af, #f9a8d4, #ddd6fe); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
          Silk Stories
        </h1>
      </td>
    </tr>

    <!-- Genre Image -->
    <tr>
      <td style="padding: 0; text-align: center; background-color: #111827;">
        <img src="${imageUrl}" alt="${genre || 'Romance'}" style="width: 100%; max-width: 600px; height: auto; display: block;" />
      </td>
    </tr>

    <!-- Content -->
    <tr>
      <td style="padding: 40px 30px; background-color: #111827;">
        <h2 style="margin: 0 0 20px 0; font-size: 28px; color: #fda4af; font-weight: bold;">
          ✨ Your Story is Ready, ${userName}!
        </h2>

        <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #d1d5db;">
          Your personalized ${genre ? genre.toLowerCase() + ' ' : ''}romance story has been crafted and is waiting for you:
        </p>

        <div style="background: linear-gradient(to bottom right, #450a0a, #3b0764); border: 1px solid #9f1239; border-radius: 12px; padding: 24px; margin: 30px 0;">
          <h3 style="margin: 0 0 12px 0; font-size: 24px; color: #fda4af; font-family: 'Playfair Display', Georgia, serif;">
            "${storyTitle}"
          </h3>
          <p style="margin: 0; font-size: 14px; color: #9ca3af;">
            ${genre ? `A ${genre} Romance` : 'Created just for you'}
          </p>
        </div>

        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
          <tr>
            <td align="center">
              <a href="${storyUrl}" style="display: inline-block; padding: 16px 32px; background: linear-gradient(to right, #be123c, #7c2d12); color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 12px rgba(251, 113, 133, 0.3);">
                Read Your Story Now →
              </a>
            </td>
          </tr>
        </table>

        <p style="margin: 30px 0 0 0; font-size: 14px; line-height: 1.6; color: #9ca3af;">
          Don't forget to favorite your story if you love it, and you can even extend it with new chapters!
        </p>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="padding: 30px; text-align: center; background-color: #000000; border-top: 1px solid #374151;">
        <p style="margin: 0 0 10px 0; font-size: 14px; color: #6b7280;">
          Happy reading! ❤️
        </p>
        <p style="margin: 0; font-size: 12px; color: #4b5563;">
          <a href="${baseUrl}" style="color: #fb7185; text-decoration: none;">Visit Silk Stories</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    })

    if (error) {
      console.error('Error sending story ready email:', error)
      return { success: false, error }
    }

    console.log('Story ready email sent:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Error sending story ready email:', error)
    return { success: false, error }
  }
}

export async function sendWelcomeEmail({
  to,
  userName,
}: {
  to: string
  userName: string
}) {
  const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://readsilk.com'}/dashboard`
  const generateUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://readsilk.com'}/generate`

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: 'Welcome to Silk Stories! 💕',
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Silk Stories</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Georgia', serif; background: linear-gradient(to bottom, #000000, #1a1a1a); color: #ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #000000;">
    <!-- Header -->
    <tr>
      <td style="padding: 40px 30px; text-align: center; background: linear-gradient(to right, #be123c, #7c2d12); border-bottom: 2px solid #fb7185;">
        <h1 style="margin: 0; font-size: 36px; font-weight: 900; background: linear-gradient(to right, #fda4af, #f9a8d4, #ddd6fe); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
          Silk Stories
        </h1>
      </td>
    </tr>

    <!-- Content -->
    <tr>
      <td style="padding: 40px 30px; background-color: #111827;">
        <h2 style="margin: 0 0 20px 0; font-size: 28px; color: #fda4af; font-weight: bold;">
          Welcome to Silk Stories, ${userName}! 💕
        </h2>

        <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #d1d5db;">
          We're thrilled to have you join our community of romance lovers. Get ready for personalized stories that sweep you off your feet!
        </p>

        <div style="background: linear-gradient(to bottom right, #450a0a, #3b0764); border: 1px solid #9f1239; border-radius: 12px; padding: 24px; margin: 30px 0;">
          <h3 style="margin: 0 0 16px 0; font-size: 20px; color: #fda4af;">
            🎁 You've received 3 free credits!
          </h3>
          <p style="margin: 0; font-size: 14px; color: #d1d5db; line-height: 1.6;">
            Use them to create your first personalized romance story. Choose your genre, tropes, heat level, and let our AI craft something magical just for you.
          </p>
        </div>

        <h3 style="margin: 30px 0 16px 0; font-size: 18px; color: #fda4af;">
          Here's what you can do:
        </h3>

        <ul style="margin: 0 0 30px 0; padding-left: 20px; font-size: 15px; line-height: 1.8; color: #d1d5db;">
          <li><strong style="color: #fda4af;">Generate Custom Stories</strong> - Create romance stories tailored to your preferences</li>
          <li><strong style="color: #fda4af;">Browse Our Library</strong> - Discover hundreds of curated romance stories</li>
          <li><strong style="color: #fda4af;">Save Favorites</strong> - Build your personal collection of beloved stories</li>
          <li><strong style="color: #fda4af;">Extend Stories</strong> - Continue your favorite stories with new chapters</li>
        </ul>

        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
          <tr>
            <td align="center">
              <a href="${generateUrl}" style="display: inline-block; padding: 16px 32px; background: linear-gradient(to right, #be123c, #7c2d12); color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 12px rgba(251, 113, 133, 0.3);">
                Create Your First Story →
              </a>
            </td>
          </tr>
        </table>

        <p style="margin: 30px 0 0 0; font-size: 14px; line-height: 1.6; color: #9ca3af; text-align: center;">
          Questions? Just reply to this email - we're here to help!
        </p>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="padding: 30px; text-align: center; background-color: #000000; border-top: 1px solid #374151;">
        <p style="margin: 0 0 10px 0; font-size: 14px; color: #6b7280;">
          Happy reading! ❤️
        </p>
        <p style="margin: 0; font-size: 12px; color: #4b5563;">
          <a href="${dashboardUrl}" style="color: #fb7185; text-decoration: none;">Go to Dashboard</a> ·
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://readsilk.com'}/stories" style="color: #fb7185; text-decoration: none;">Browse Stories</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    })

    if (error) {
      console.error('Error sending welcome email:', error)
      return { success: false, error }
    }

    console.log('Welcome email sent:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Error sending welcome email:', error)
    return { success: false, error }
  }
}

// ============================================
// ADMIN NOTIFICATION EMAILS
// ============================================

export async function notifyAdminNewUser({
  userName,
  userEmail,
}: {
  userName: string
  userEmail: string
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `🎉 New User Signup: ${userName}`,
      html: `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; padding: 20px; background: #1a1a1a; color: #fff;">
  <div style="max-width: 500px; margin: 0 auto; background: #2a2a2a; padding: 30px; border-radius: 10px;">
    <h2 style="color: #fb7185; margin-top: 0;">🎉 New User Signed Up!</h2>
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 10px 0; color: #9ca3af;">Name:</td>
        <td style="padding: 10px 0; color: #fff; font-weight: bold;">${userName}</td>
      </tr>
      <tr>
        <td style="padding: 10px 0; color: #9ca3af;">Email:</td>
        <td style="padding: 10px 0; color: #fff; font-weight: bold;">${userEmail}</td>
      </tr>
      <tr>
        <td style="padding: 10px 0; color: #9ca3af;">Time:</td>
        <td style="padding: 10px 0; color: #fff;">${new Date().toLocaleString()}</td>
      </tr>
    </table>
    <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #444;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://readsilk.com'}/admin/users" style="color: #fb7185;">View all users →</a>
    </div>
  </div>
</body>
</html>
      `,
    })

    if (error) {
      console.error('Error sending admin notification:', error)
      return { success: false, error }
    }
    return { success: true, data }
  } catch (error) {
    console.error('Error sending admin notification:', error)
    return { success: false, error }
  }
}

export async function notifyAdminNewFeedback({
  userName,
  userEmail,
  subject,
  message,
}: {
  userName?: string
  userEmail?: string
  subject: string
  message: string
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `📝 New Feedback: ${subject}`,
      html: `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; padding: 20px; background: #1a1a1a; color: #fff;">
  <div style="max-width: 500px; margin: 0 auto; background: #2a2a2a; padding: 30px; border-radius: 10px;">
    <h2 style="color: #a78bfa; margin-top: 0;">📝 New Feedback Received</h2>
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 10px 0; color: #9ca3af;">From:</td>
        <td style="padding: 10px 0; color: #fff; font-weight: bold;">${userName || 'Anonymous'}</td>
      </tr>
      <tr>
        <td style="padding: 10px 0; color: #9ca3af;">Email:</td>
        <td style="padding: 10px 0; color: #fff;">${userEmail || 'Not provided'}</td>
      </tr>
      <tr>
        <td style="padding: 10px 0; color: #9ca3af;">Subject:</td>
        <td style="padding: 10px 0; color: #fff; font-weight: bold;">${subject}</td>
      </tr>
    </table>
    <div style="margin-top: 20px; padding: 15px; background: #1a1a1a; border-radius: 8px; border-left: 3px solid #a78bfa;">
      <p style="margin: 0; color: #d1d5db; white-space: pre-wrap;">${message}</p>
    </div>
    <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #444;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://readsilk.com'}/admin/feedback" style="color: #a78bfa;">View all feedback →</a>
    </div>
  </div>
</body>
</html>
      `,
    })

    if (error) {
      console.error('Error sending admin notification:', error)
      return { success: false, error }
    }
    return { success: true, data }
  } catch (error) {
    console.error('Error sending admin notification:', error)
    return { success: false, error }
  }
}

export async function notifyAdminPaymentFailed({
  customerEmail,
  amount,
  error: paymentError,
}: {
  customerEmail: string
  amount?: number
  error?: string
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `⚠️ Payment Failed: ${customerEmail}`,
      html: `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; padding: 20px; background: #1a1a1a; color: #fff;">
  <div style="max-width: 500px; margin: 0 auto; background: #2a2a2a; padding: 30px; border-radius: 10px; border: 2px solid #ef4444;">
    <h2 style="color: #ef4444; margin-top: 0;">⚠️ Payment Failed</h2>
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 10px 0; color: #9ca3af;">Customer:</td>
        <td style="padding: 10px 0; color: #fff; font-weight: bold;">${customerEmail}</td>
      </tr>
      ${amount ? `
      <tr>
        <td style="padding: 10px 0; color: #9ca3af;">Amount:</td>
        <td style="padding: 10px 0; color: #fff;">$${(amount / 100).toFixed(2)}</td>
      </tr>
      ` : ''}
      <tr>
        <td style="padding: 10px 0; color: #9ca3af;">Time:</td>
        <td style="padding: 10px 0; color: #fff;">${new Date().toLocaleString()}</td>
      </tr>
    </table>
    ${paymentError ? `
    <div style="margin-top: 20px; padding: 15px; background: #450a0a; border-radius: 8px;">
      <p style="margin: 0; color: #fca5a5; font-size: 14px;">${paymentError}</p>
    </div>
    ` : ''}
    <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #444;">
      <a href="https://dashboard.stripe.com/payments" style="color: #fb7185;">View in Stripe →</a>
    </div>
  </div>
</body>
</html>
      `,
    })

    if (error) {
      console.error('Error sending admin notification:', error)
      return { success: false, error }
    }
    return { success: true, data }
  } catch (error) {
    console.error('Error sending admin notification:', error)
    return { success: false, error }
  }
}

export async function notifyAdminError({
  context,
  error: errorMessage,
  userId,
}: {
  context: string
  error: string
  userId?: string
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `🚨 Error: ${context}`,
      html: `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; padding: 20px; background: #1a1a1a; color: #fff;">
  <div style="max-width: 500px; margin: 0 auto; background: #2a2a2a; padding: 30px; border-radius: 10px; border: 2px solid #ef4444;">
    <h2 style="color: #ef4444; margin-top: 0;">🚨 Error Alert</h2>
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 10px 0; color: #9ca3af;">Context:</td>
        <td style="padding: 10px 0; color: #fff; font-weight: bold;">${context}</td>
      </tr>
      ${userId ? `
      <tr>
        <td style="padding: 10px 0; color: #9ca3af;">User ID:</td>
        <td style="padding: 10px 0; color: #fff;">${userId}</td>
      </tr>
      ` : ''}
      <tr>
        <td style="padding: 10px 0; color: #9ca3af;">Time:</td>
        <td style="padding: 10px 0; color: #fff;">${new Date().toLocaleString()}</td>
      </tr>
    </table>
    <div style="margin-top: 20px; padding: 15px; background: #450a0a; border-radius: 8px; overflow-x: auto;">
      <pre style="margin: 0; color: #fca5a5; font-size: 12px; white-space: pre-wrap;">${errorMessage}</pre>
    </div>
  </div>
</body>
</html>
      `,
    })

    if (error) {
      console.error('Error sending admin notification:', error)
      return { success: false, error }
    }
    return { success: true, data }
  } catch (error) {
    console.error('Error sending admin notification:', error)
    return { success: false, error }
  }
}

// ============================================
// USER SUBSCRIPTION EMAILS
// ============================================

export async function sendSubscriptionConfirmationEmail({
  to,
  userName,
  tier,
  credits,
}: {
  to: string
  userName: string
  tier: string
  credits: number
}) {
  const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://readsilk.com'}/dashboard`
  const generateUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://readsilk.com'}/generate`

  const tierDisplay = tier.charAt(0).toUpperCase() + tier.slice(1).toLowerCase()
  const creditsText = tier === 'UNLIMITED' ? 'Unlimited stories (fair use: 2/day)' : `${credits} story credits`

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Welcome to ${tierDisplay}! Your subscription is active`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Subscription Confirmed</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Georgia', serif; background: linear-gradient(to bottom, #000000, #1a1a1a); color: #ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #000000;">
    <!-- Header -->
    <tr>
      <td style="padding: 40px 30px; text-align: center; background: linear-gradient(to right, #be123c, #7c2d12); border-bottom: 2px solid #fb7185;">
        <h1 style="margin: 0; font-size: 36px; font-weight: 900; background: linear-gradient(to right, #fda4af, #f9a8d4, #ddd6fe); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
          Silk Stories
        </h1>
      </td>
    </tr>

    <!-- Content -->
    <tr>
      <td style="padding: 40px 30px; background-color: #111827;">
        <h2 style="margin: 0 0 20px 0; font-size: 28px; color: #fda4af; font-weight: bold;">
          Welcome to ${tierDisplay}, ${userName}!
        </h2>

        <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #d1d5db;">
          Thank you for subscribing! Your ${tierDisplay} membership is now active and ready to use.
        </p>

        <div style="background: linear-gradient(to bottom right, #450a0a, #3b0764); border: 1px solid #9f1239; border-radius: 12px; padding: 24px; margin: 30px 0;">
          <h3 style="margin: 0 0 16px 0; font-size: 20px; color: #fda4af;">
            Your Plan Details
          </h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #9ca3af;">Plan:</td>
              <td style="padding: 8px 0; color: #fff; font-weight: bold;">${tierDisplay}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #9ca3af;">Monthly Allowance:</td>
              <td style="padding: 8px 0; color: #fff; font-weight: bold;">${creditsText}</td>
            </tr>
          </table>
        </div>

        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
          <tr>
            <td align="center">
              <a href="${generateUrl}" style="display: inline-block; padding: 16px 32px; background: linear-gradient(to right, #be123c, #7c2d12); color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 12px rgba(251, 113, 133, 0.3);">
                Create Your First Story
              </a>
            </td>
          </tr>
        </table>

        <p style="margin: 30px 0 0 0; font-size: 14px; line-height: 1.6; color: #9ca3af; text-align: center;">
          Your credits renew automatically each month. Happy reading!
        </p>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="padding: 30px; text-align: center; background-color: #000000; border-top: 1px solid #374151;">
        <p style="margin: 0 0 10px 0; font-size: 14px; color: #6b7280;">
          Questions? Just reply to this email.
        </p>
        <p style="margin: 0; font-size: 12px; color: #4b5563;">
          <a href="${dashboardUrl}" style="color: #fb7185; text-decoration: none;">Go to Dashboard</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    })

    if (error) {
      console.error('Error sending subscription confirmation email:', error)
      return { success: false, error }
    }

    console.log('Subscription confirmation email sent:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Error sending subscription confirmation email:', error)
    return { success: false, error }
  }
}

export async function sendCreditsRenewedEmail({
  to,
  userName,
  credits,
  tier,
}: {
  to: string
  userName: string
  credits: number
  tier: string
}) {
  const generateUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://readsilk.com'}/generate`
  const tierDisplay = tier.charAt(0).toUpperCase() + tier.slice(1).toLowerCase()

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Your ${credits} story credits have been renewed!`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Credits Renewed</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Georgia', serif; background: linear-gradient(to bottom, #000000, #1a1a1a); color: #ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #000000;">
    <!-- Header -->
    <tr>
      <td style="padding: 40px 30px; text-align: center; background: linear-gradient(to right, #be123c, #7c2d12); border-bottom: 2px solid #fb7185;">
        <h1 style="margin: 0; font-size: 36px; font-weight: 900; background: linear-gradient(to right, #fda4af, #f9a8d4, #ddd6fe); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
          Silk Stories
        </h1>
      </td>
    </tr>

    <!-- Content -->
    <tr>
      <td style="padding: 40px 30px; background-color: #111827;">
        <h2 style="margin: 0 0 20px 0; font-size: 28px; color: #fda4af; font-weight: bold;">
          Your Credits Have Been Renewed!
        </h2>

        <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #d1d5db;">
          Hi ${userName}, great news! Your monthly story credits have been refreshed.
        </p>

        <div style="background: linear-gradient(to bottom right, #450a0a, #3b0764); border: 1px solid #9f1239; border-radius: 12px; padding: 24px; margin: 30px 0; text-align: center;">
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #9ca3af;">Available Credits</p>
          <p style="margin: 0; font-size: 48px; font-weight: bold; color: #fda4af;">${credits}</p>
          <p style="margin: 8px 0 0 0; font-size: 14px; color: #9ca3af;">${tierDisplay} Plan</p>
        </div>

        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
          <tr>
            <td align="center">
              <a href="${generateUrl}" style="display: inline-block; padding: 16px 32px; background: linear-gradient(to right, #be123c, #7c2d12); color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 12px rgba(251, 113, 133, 0.3);">
                Create a New Story
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="padding: 30px; text-align: center; background-color: #000000; border-top: 1px solid #374151;">
        <p style="margin: 0; font-size: 12px; color: #4b5563;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://readsilk.com'}" style="color: #fb7185; text-decoration: none;">Visit Silk Stories</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    })

    if (error) {
      console.error('Error sending credits renewed email:', error)
      return { success: false, error }
    }

    console.log('Credits renewed email sent:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Error sending credits renewed email:', error)
    return { success: false, error }
  }
}

export async function sendSubscriptionCancelledEmail({
  to,
  userName,
  remainingCredits,
}: {
  to: string
  userName: string
  remainingCredits: number
}) {
  const storiesUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://readsilk.com'}/stories`
  const pricingUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://readsilk.com'}/pricing`

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: 'Your Silk Stories subscription has ended',
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Subscription Cancelled</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Georgia', serif; background: linear-gradient(to bottom, #000000, #1a1a1a); color: #ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #000000;">
    <!-- Header -->
    <tr>
      <td style="padding: 40px 30px; text-align: center; background: linear-gradient(to right, #be123c, #7c2d12); border-bottom: 2px solid #fb7185;">
        <h1 style="margin: 0; font-size: 36px; font-weight: 900; background: linear-gradient(to right, #fda4af, #f9a8d4, #ddd6fe); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
          Silk Stories
        </h1>
      </td>
    </tr>

    <!-- Content -->
    <tr>
      <td style="padding: 40px 30px; background-color: #111827;">
        <h2 style="margin: 0 0 20px 0; font-size: 28px; color: #fda4af; font-weight: bold;">
          We're Sorry to See You Go
        </h2>

        <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #d1d5db;">
          Hi ${userName}, your subscription has been cancelled. We hope you enjoyed your time with Silk Stories.
        </p>

        ${remainingCredits > 0 ? `
        <div style="background: linear-gradient(to bottom right, #1e3a5f, #1e1b4b); border: 1px solid #3b82f6; border-radius: 12px; padding: 24px; margin: 30px 0;">
          <h3 style="margin: 0 0 12px 0; font-size: 18px; color: #93c5fd;">
            Good News!
          </h3>
          <p style="margin: 0; font-size: 14px; color: #d1d5db; line-height: 1.6;">
            You still have <strong style="color: #fda4af;">${remainingCredits} credits</strong> remaining. These credits never expire, so you can use them anytime to create new stories.
          </p>
        </div>
        ` : ''}

        <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #d1d5db;">
          You can still browse our curated story library anytime. If you ever want to create custom stories again, we'll be here.
        </p>

        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
          <tr>
            <td align="center">
              <a href="${storiesUrl}" style="display: inline-block; padding: 14px 28px; background: transparent; border: 2px solid #fb7185; color: #fb7185; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600; margin-right: 10px;">
                Browse Stories
              </a>
              <a href="${pricingUrl}" style="display: inline-block; padding: 14px 28px; background: linear-gradient(to right, #be123c, #7c2d12); color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600;">
                Resubscribe
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="padding: 30px; text-align: center; background-color: #000000; border-top: 1px solid #374151;">
        <p style="margin: 0 0 10px 0; font-size: 14px; color: #6b7280;">
          Thank you for being part of our story.
        </p>
        <p style="margin: 0; font-size: 12px; color: #4b5563;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://readsilk.com'}" style="color: #fb7185; text-decoration: none;">Visit Silk Stories</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    })

    if (error) {
      console.error('Error sending subscription cancelled email:', error)
      return { success: false, error }
    }

    console.log('Subscription cancelled email sent:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Error sending subscription cancelled email:', error)
    return { success: false, error }
  }
}

export async function sendLowCreditsWarningEmail({
  to,
  userName,
  remainingCredits,
}: {
  to: string
  userName: string
  remainingCredits: number
}) {
  const pricingUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://readsilk.com'}/pricing`
  const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://readsilk.com'}/dashboard`

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `You're running low on story credits (${remainingCredits} left)`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Low Credits Warning</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Georgia', serif; background: linear-gradient(to bottom, #000000, #1a1a1a); color: #ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #000000;">
    <!-- Header -->
    <tr>
      <td style="padding: 40px 30px; text-align: center; background: linear-gradient(to right, #be123c, #7c2d12); border-bottom: 2px solid #fb7185;">
        <h1 style="margin: 0; font-size: 36px; font-weight: 900; background: linear-gradient(to right, #fda4af, #f9a8d4, #ddd6fe); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
          Silk Stories
        </h1>
      </td>
    </tr>

    <!-- Content -->
    <tr>
      <td style="padding: 40px 30px; background-color: #111827;">
        <h2 style="margin: 0 0 20px 0; font-size: 28px; color: #fda4af; font-weight: bold;">
          Running Low on Credits
        </h2>

        <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #d1d5db;">
          Hi ${userName}, just a friendly heads up - you're running low on story credits!
        </p>

        <div style="background: linear-gradient(to bottom right, #78350f, #451a03); border: 1px solid #f59e0b; border-radius: 12px; padding: 24px; margin: 30px 0; text-align: center;">
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #fcd34d;">Credits Remaining</p>
          <p style="margin: 0; font-size: 48px; font-weight: bold; color: #fcd34d;">${remainingCredits}</p>
        </div>

        <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #d1d5db;">
          Don't let writer's block stop your reading adventures! Top up your credits or upgrade your plan to keep the stories flowing.
        </p>

        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
          <tr>
            <td align="center">
              <a href="${pricingUrl}" style="display: inline-block; padding: 16px 32px; background: linear-gradient(to right, #be123c, #7c2d12); color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 12px rgba(251, 113, 133, 0.3);">
                Get More Credits
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="padding: 30px; text-align: center; background-color: #000000; border-top: 1px solid #374151;">
        <p style="margin: 0; font-size: 12px; color: #4b5563;">
          <a href="${dashboardUrl}" style="color: #fb7185; text-decoration: none;">Go to Dashboard</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    })

    if (error) {
      console.error('Error sending low credits warning email:', error)
      return { success: false, error }
    }

    console.log('Low credits warning email sent:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Error sending low credits warning email:', error)
    return { success: false, error }
  }
}
