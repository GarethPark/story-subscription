import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = 'Silk Stories <stories@readsilk.com>'

export async function sendStoryReadyEmail({
  to,
  userName,
  storyTitle,
  storyId,
}: {
  to: string
  userName: string
  storyTitle: string
  storyId: string
}) {
  const storyUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://readsilk.com'}/stories/${storyId}`

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

    <!-- Content -->
    <tr>
      <td style="padding: 40px 30px; background-color: #111827;">
        <h2 style="margin: 0 0 20px 0; font-size: 28px; color: #fda4af; font-weight: bold;">
          ✨ Your Story is Ready, ${userName}!
        </h2>

        <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #d1d5db;">
          Your personalized romance story has been crafted and is waiting for you:
        </p>

        <div style="background: linear-gradient(to bottom right, #450a0a, #3b0764); border: 1px solid #9f1239; border-radius: 12px; padding: 24px; margin: 30px 0;">
          <h3 style="margin: 0 0 12px 0; font-size: 24px; color: #fda4af; font-family: 'Playfair Display', Georgia, serif;">
            "${storyTitle}"
          </h3>
          <p style="margin: 0; font-size: 14px; color: #9ca3af;">
            Created just for you
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
