# ⚠️ ACTION REQUIRED: Setup Resend Email Service

**Status:** Emails are coded and deployed but won't work until you add your Resend API key.

## Quick Checklist (5 minutes)

### ✅ Step 1: Create Resend Account
- [ ] Go to https://resend.com/
- [ ] Sign up (FREE - no credit card needed)
- [ ] Verify your email

### ✅ Step 2: Get API Key
- [ ] Login to Resend dashboard
- [ ] Click "API Keys" in sidebar
- [ ] Click "Create API Key"
- [ ] Name it: `Silk Stories Production`
- [ ] **Copy the key** (starts with `re_...`)

### ✅ Step 3: Add to Vercel (CRITICAL)
- [ ] Go to https://vercel.com
- [ ] Open your project
- [ ] Settings → Environment Variables
- [ ] Click "Add New"
- [ ] Key: `RESEND_API_KEY`
- [ ] Value: `re_your_copied_key_here`
- [ ] Click Save
- [ ] **REDEPLOY THE APP** (go to Deployments → click redeploy on latest)

### ✅ Step 4: Test It Works
- [ ] Create a new test account on your site
- [ ] Check you received a welcome email
- [ ] Generate a story
- [ ] Check you received a "story ready" email in 1-2 minutes

## Optional: Verify Domain (for professional emails)

**Without this:** Emails come from `onboarding@resend.dev` (works but looks generic)
**With this:** Emails come from `stories@readsilk.com` (much more professional)

### Add DNS Records to Namecheap:

1. Login to Namecheap
2. Go to Domain List → readsilk.com → Manage
3. Click "Advanced DNS"
4. Add these records:

| Type | Host | Value |
|------|------|-------|
| TXT | @ | `v=spf1 include:amazonses.com ~all` |
| CNAME | `resend._domainkey` | `resend._domainkey.resend.com` |
| MX | @ | `feedback-smtp.us-east-1.amazonses.com` (Priority: 10) |

5. Wait 10 minutes for DNS to propagate
6. Go to Resend dashboard → Domains → Add Domain
7. Enter: `readsilk.com`
8. Click "Verify"

## What Happens After Setup

✅ **New users get welcome emails** with:
- Welcome message
- Info about their 3 free credits
- Link to generate first story

✅ **Story ready emails** when generation completes:
- Notification that story is done
- Story title
- Direct link to read

✅ **Better UX** - users don't wait on generate page anymore

## If You Get Stuck

- Full detailed guide: See `RESEND-SETUP.md`
- Resend docs: https://resend.com/docs
- Resend support: support@resend.com (very responsive)

## Current Status

- ✅ Code is deployed to production
- ✅ Email templates are beautiful and branded
- ❌ **NOT WORKING YET** - needs RESEND_API_KEY in Vercel
- ⏳ Waiting for you to complete Steps 1-3 above

**Estimated time:** 5-10 minutes total
