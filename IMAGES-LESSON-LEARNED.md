# Images Issue - Lesson Learned

## What Happened
Spent 2 days trying to get 4 cover images to display on the stories page. Multiple approaches failed before finding the root cause.

## The Root Cause
**Next.js page caching** - The `/stories` page was being statically rendered and cached, so database updates to cover image URLs weren't reflected on the live site.

## The Solution
1. **Added dynamic rendering to stories page** (`app/stories/page.tsx`):
   ```typescript
   export const dynamic = 'force-dynamic'
   export const revalidate = 0
   ```
   This forces the page to fetch fresh data from the database on every request.

2. **Used Imgur for external image hosting**:
   - Uploaded images to Imgur
   - Stored direct Imgur URLs in database (`https://i.imgur.com/xxxxx.png`)
   - This is more reliable than GitHub raw URLs or local `/public` folder

3. **Cleaned up invalid config**:
   - Removed invalid `images` config from `vercel.json` (Vercel doesn't support `unoptimized` in vercel.json)
   - Removed test pages and unused scripts that had TypeScript errors

## How to Avoid This Going Forward

### 1. Page Rendering Strategy
- **Static pages** (`export const dynamic = 'force-static'`): Use for content that rarely changes (About, Terms, etc.)
- **Dynamic pages** (`export const dynamic = 'force-dynamic'`): Use for pages that fetch user data or frequently changing database content
- **Revalidated pages** (`export const revalidate = 60`): Use for content that changes occasionally (cache for 60 seconds)

### 2. Images Best Practices
- **For user-uploaded or frequently changing images**: Use external CDN (Imgur, Cloudinary, AWS S3)
- **For static assets**: Put in `/public` folder and reference with `/filename.png`
- **For Next.js Image optimization**: Only use `next/image` component with proper remote patterns in `next.config.ts`

### 3. Database-Driven Content
When showing content from database:
- Add `export const dynamic = 'force-dynamic'` to ensure fresh data
- OR use ISR (Incremental Static Regeneration) with `revalidate` for better performance

### 4. Vercel Deployment
- Use `vercel deploy --prod` to force new deployment
- Build errors = deployment fails (fix TypeScript errors in ALL files, even unused scripts)
- Invalid `vercel.json` config = deployment fails

## Current Setup
- **Stories page**: Dynamic rendering, fetches fresh data every request
- **Cover images**: Stored in database as Imgur URLs
- **4 stories with covers**:
  - Crimson Obsession: https://i.imgur.com/vCRUGA2.png
  - Courts of Shadow and Starlight: https://i.imgur.com/Esiimly.png
  - Blood Moon Prophecy: https://i.imgur.com/Esiimly.png
  - Bound by Starfire: https://i.imgur.com/Esiimly.png

## Script to Update Cover Images
Use `scripts/add-cover-images.ts`:
```bash
# Auto-map covers based on genre + trope
npx tsx scripts/add-cover-images.ts

# Manual update single story
npx tsx scripts/add-cover-images.ts [storyId] [imageUrl]
```

## Key Takeaway
**When database content doesn't show on production**: Check if the page has dynamic rendering enabled. Next.js defaults to static rendering when possible.
