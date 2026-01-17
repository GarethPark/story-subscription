# Silk Stories - Project Status (Jan 17, 2026)

## What's Working ✅

### Core Features
- Story library with genre-based mood images
- User authentication (login/signup)
- Story generation with AI (Anthropic Claude)
- Favorites and reading history
- Admin dashboard and analytics
- Email notifications (10 templates via Resend)

### Stripe Payments ✅ WORKING
- Live checkout working - tested with real payment
- Subscriptions creating correctly (Starter plan tested)
- Credits allocated on subscription (3 credits for Starter)
- Webhook endpoint: https://www.readsilk.com/api/stripe/webhook

### Story Generation ✅ IMPROVED
- Real-time status polling with progress messages
- Auto-redirect to story when complete
- Credit refunds on failed generations
- Spicier content for Hot/Scorching heat levels
- Admin defaults to Sweet for curated stories

### Production Setup
- **Domain**: readsilk.com (verified in Resend)
- **Database**: PostgreSQL on Neon (production)
- **Hosting**: Vercel (deploy with `vercel --prod`)
- **Emails**: Working - go to junk folder initially, mark as not spam

## Fixed Today (Jan 17)

### Stripe Checkout Fix
- **Root cause**: Environment variables had trailing newlines (`\n`)
- **Solution**: Added `.trim()` to all price IDs in `lib/stripe.ts` and `app/pricing/page.tsx`

### Story Generation UX
- Added real-time polling every 3 seconds during generation
- Progress messages: "Crafting characters...", "Writing story...", "Adding finishing touches..."
- Direct redirect to completed story instead of My Stories page
- Auto-refund credits when generation fails (AI refusal, timeout, etc.)

### Spicier Content
- Updated heat level guidance for Hot and Scorching:
  - **Hot**: Explicit sex scenes with anatomical details, physical sensations, positions
  - **Scorching**: Graphic erotica, multiple detailed scenes, direct language, dirty talk

### Published Stories
- "Trapped in Temptation" - published to free library (18+)

## Stripe Price IDs (Live Mode)
```
Starter:   price_1SqJ2NKjruuOoDVK5jj67hu0  ($6.99/mo, 3 credits)
Plus:      price_1SqJ2cKjruuOoDVKYwtkPmcG  ($11.99/mo, 8 credits)
Unlimited: price_1SqJ2sKjruuOoDVKn12a7VZ2  ($19.99/mo, unlimited)
Credit:    price_1SqJ3FKjruuOoDVKX8WUvc76  ($3.99 one-time, 1 credit)
```

## Known Limitations

### Claude API Content Limits
Claude will refuse to generate explicit content involving:
- Active infidelity/adultery (cheating on current partner)
- Non-consensual scenarios
- Underage characters

**Workaround**: Scenarios with separated/divorced characters, exes, or single characters work fine.

### Emails Going to Junk
- Emails from stories@readsilk.com initially go to spam/junk
- Users need to mark as "not spam" once
- Consider adding SPF/DKIM records if not already done

## Next Steps for Tomorrow

### 1. Test Full Payment Flow
- Test Plus and Unlimited subscriptions
- Test one-time credit purchase
- Verify webhook handles all event types
- Test subscription cancellation via Stripe portal

### 2. Generate More Curated Stories
- Use admin panel to generate Sweet stories for free library
- Cover multiple genres: Contemporary, Romantasy, Historical, etc.
- Add cover images to generated stories

### 3. Nice-to-haves Before Launch
- Password reset flow
- Sitemap.xml for SEO
- Error tracking (Sentry)
- Google Analytics
- Email deliverability improvements

### 4. Marketing/Launch Prep
- Social media accounts
- Landing page copy review
- Beta testers feedback

## Commands to Remember

```bash
# Deploy to production
vercel --prod

# Check Vercel logs
vercel logs <deployment-url>

# Reset a user's password
node -e "
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function reset() {
  const hash = await bcrypt.hash('NEW_PASSWORD', 10);
  await prisma.user.update({
    where: { email: 'EMAIL' },
    data: { password: hash }
  });
}
reset();
"

# Add credits to a user
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.user.update({
  where: { email: 'EMAIL' },
  data: { credits: { increment: 5 } }
}).then(console.log);
"

# Publish a story to free library
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.story.update({
  where: { id: 'STORY_ID' },
  data: { published: true, isCustom: false }
}).then(console.log);
"
```

## Test Accounts
- Email: garethpark@msn.com
- Password: test1234
- Subscription: Starter (3 credits/month)

## Files Changed Today (Jan 17)
- `lib/stripe.ts` - Trim price IDs, better Stripe init
- `app/pricing/page.tsx` - Trim client-side price IDs
- `app/api/stripe/test/route.ts` - Test endpoint for debugging
- `app/api/generate-story/[id]/execute/route.ts` - Credit refunds, spicier prompts, email logging
- `components/generate/custom-story-form.tsx` - Real-time status polling, progress messages
- `components/admin/story-generation-form.tsx` - Default to Sweet heat
- `app/api/admin/generate-story/[id]/execute/route.ts` - Matching heat guidance
