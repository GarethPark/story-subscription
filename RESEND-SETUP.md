# Resend Email Setup Guide

Email notifications are now configured for Silk Stories! Users will receive emails when:
- ✅ They sign up for a new account (welcome email)
- ✅ Their story generation is complete (story ready email)

## Quick Setup (5 minutes)

### 1. Create a Resend Account

1. Go to **https://resend.com/**
2. Click "Sign Up" (it's **FREE** for up to 100 emails/day and 3,000/month)
3. Verify your email address

### 2. Verify Your Domain

To send emails from `stories@readsilk.com`, you need to verify your domain:

1. In Resend dashboard, click **"Domains"**
2. Click **"Add Domain"**
3. Enter: `readsilk.com`
4. You'll get DNS records to add to Namecheap:

**Add these DNS records in Namecheap:**

| Type | Host | Value | Priority |
|------|------|-------|----------|
| TXT | @ | `v=spf1 include:amazonses.com ~all` | - |
| CNAME | `resend._domainkey` | `resend._domainkey.resend.com` | - |
| MX | @ | `feedback-smtp.us-east-1.amazonses.com` | 10 |

5. Wait 5-10 minutes for DNS propagation
6. Click "Verify" in Resend dashboard

### 3. Get Your API Key

1. In Resend dashboard, click **"API Keys"**
2. Click **"Create API Key"**
3. Name it: `Silk Stories Production`
4. Copy the API key (starts with `re_`)

### 4. Add API Key to Your Environment

**Update your `.env` file:**

```bash
RESEND_API_KEY="re_your_actual_api_key_here"
```

**IMPORTANT:** Also add this to your **Vercel environment variables**:

1. Go to https://vercel.com/your-project/settings/environment-variables
2. Add new variable:
   - **Key:** `RESEND_API_KEY`
   - **Value:** `re_your_actual_api_key_here`
3. Click "Save"
4. **Redeploy your app** for changes to take effect

### 5. Test It!

1. Create a new user account on your site
2. You should receive a welcome email at the signup email address
3. Generate a story
4. You should receive a "Story Ready" email when it's done

## Email Templates

The app includes two beautiful HTML email templates:

### Welcome Email
- Sent immediately when a new user signs up
- Tells them about their 3 free credits
- Links to generate their first story
- Branded with Silk Stories theme

### Story Ready Email
- Sent when story generation completes
- Displays the story title
- Direct link to read the story
- Encourages favoriting and extending stories

## Cost

Resend pricing is VERY generous:

- **Free Tier:** 100 emails/day, 3,000/month (perfect for starting out)
- **Paid:** $20/month for 50,000 emails (only if you grow big)

You'll be well within the free tier for a while!

## Troubleshooting

### Emails not sending?

1. Check your API key is correct in `.env` and Vercel
2. Make sure you verified your domain in Resend
3. Check Vercel logs for email errors: `vercel logs`
4. Emails might be in spam folder initially (improves over time)

### Domain not verifying?

1. Double-check DNS records in Namecheap
2. Wait 10-15 minutes for DNS propagation
3. Use https://mxtoolbox.com to verify DNS records are live

### Testing without domain?

You can test using `onboarding@resend.dev` as the "from" address before your domain is verified. The emails will work but come from Resend's domain instead of yours.

To use this temporarily, change line 6 in `lib/email.ts`:
```typescript
const FROM_EMAIL = 'onboarding@resend.dev'  // Temporary for testing
```

Once your domain is verified, change it back to:
```typescript
const FROM_EMAIL = 'Silk Stories <stories@readsilk.com>'
```

## What's Different Now

### Before Email Notifications:
- Users had to wait on the generate page for 1-2 minutes ⏳
- No way to know when their story was ready
- Bad UX if they closed the tab

### After Email Notifications:
- Users submit the form and get redirected immediately ✅
- They receive an email when story is ready (1-2 min later) 📧
- They can browse the site while waiting
- Much better user experience!

## Need Help?

- Resend Docs: https://resend.com/docs
- Resend Support: support@resend.com
- They have great support and usually respond quickly!
