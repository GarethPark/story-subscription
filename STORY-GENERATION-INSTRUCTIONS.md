# 📚 Generate 50 Curated Stories - Local Script Instructions

This script generates all 50 high-quality stories on your local machine, bypassing Vercel's timeout limits.

---

## ✅ Prerequisites

Make sure you have:
- ✅ Anthropic API key with credits (you have £27 remaining)
- ✅ Database connection configured (.env file)
- ✅ Node.js and npm installed

---

## 🚀 Step-by-Step Instructions

### **Step 1: Clean Up Failed Stories**

First, delete the stuck/failed stories from earlier attempts:

```bash
npx tsx -e "
import { prisma } from './lib/db'

async function cleanup() {
  const deleted = await prisma.story.deleteMany({
    where: {
      OR: [
        { generationStatus: 'PENDING' },
        { generationStatus: 'FAILED' },
      ]
    }
  })
  console.log('Deleted', deleted.count, 'stuck stories')
  await prisma.\$disconnect()
}

cleanup()
"
```

### **Step 2: Start Generation**

Run the generation script:

```bash
npx tsx scripts/generate-50-stories.ts
```

This will:
- Generate all 50 stories (one at a time)
- Show progress for each story
- Automatically save to database
- Auto-publish stories (they'll be live immediately)
- Take ~4-8 hours total

---

## ⏸️ **If You Need to Pause/Resume:**

### To Generate Only Certain Stories:

```bash
# Start from story #10, generate 5 stories
npx tsx scripts/generate-50-stories.ts 10 5

# Start from story #25, generate remaining stories
npx tsx scripts/generate-50-stories.ts 25 26
```

### To Stop:
Press `Ctrl+C` - already-generated stories are saved!

### To Resume:
Run the script again starting from where you left off:
```bash
npx tsx scripts/generate-50-stories.ts 15
```

---

## 📊 **What You'll See:**

```
╔════════════════════════════════════════════════════════════════╗
║                    🌹 SILK STORY GENERATOR 🌹                  ║
║                                                                ║
║  Generating 50 high-quality curated stories for your library  ║
║  Using: Claude Opus 4 (maximum quality)                       ║
║  Length: 8,000 words per story                                ║
║  Estimated time: 5-10 minutes per story                       ║
║  Total time: ~4-8 hours                                       ║
║  Estimated cost: ~$46 (50 × $0.92)                            ║
╚════════════════════════════════════════════════════════════════╝

================================================================================
📚 Story 1/50
Genre: Romantasy | Heat: Hot | Tropes: enemies to lovers, fated mates
================================================================================
  📝 Generating with Claude Opus...
  .............................................
  ✅ Generated: "Shadows of Starlight" by Aurora Kane
  📊 8234 words | 41 min read | 18+
  💾 Saved to database (ID: abc123...)
  ✅ SUCCESS!

⏳ Waiting 5 seconds before next story...
```

---

## 💰 **Cost Tracking:**

- **Each story:** ~$0.92
- **50 stories:** ~$46 total
- **Your credits:** £30 (~$37 USD)

⚠️ **You may need to add ~$10-15 more credits** to complete all 50 stories.

---

## 🐛 **Troubleshooting:**

### "API key not found"
Make sure your `.env` file has:
```
ANTHROPIC_API_KEY=your-key-here
```

### "Credit balance too low"
Add more credits at: https://console.anthropic.com/settings/billing

### Script crashes or errors
- Already-generated stories are saved
- Note which story number it failed on
- Resume from that story: `npx tsx scripts/generate-50-stories.ts 23`

---

## ✨ **What Happens:**

1. **Stories are auto-published** - they go live immediately
2. **No covers** - we'll add those later with your custom images
3. **All data saved** - title, author, summary, content, tags, reading time
4. **Check progress** - view stories at `/stories` on your site

---

## 📋 **Story Distribution:**

The script generates:
- **20 Romantasy** (40%) - fated mates, dragon shifters, morally gray heroes
- **10 Contemporary** (20%) - grumpy sunshine, office romance, billionaire
- **8 Small Town** (16%) - cozy, return to hometown, small business
- **6 Sports Romance** (12%) - heavy on hockey romance
- **3 Historical** (6%) - regency, highland romance
- **2 Dark Romance** (4%) - mafia, morally gray heroes
- **1 Romantic Suspense** (2%) - bodyguard romance

All based on 2025-2026 BookTok market research!

---

## 🎯 **Recommended Approach:**

### Option A: Let it run overnight
```bash
npx tsx scripts/generate-50-stories.ts
```
Go to bed, wake up with 50 stories!

### Option B: Generate in batches
```bash
# Batch 1: First 10 stories (test)
npx tsx scripts/generate-50-stories.ts 1 10

# Check quality, then continue
npx tsx scripts/generate-50-stories.ts 11 40
```

---

## ✅ **After Generation:**

1. Check your stories: https://romance-story-subscription.vercel.app/stories
2. Generate your 21 custom genre/trope images
3. Add cover images: `npx tsx scripts/add-cover-images.ts`
4. You're ready to launch! 🚀

---

**Ready to start?** Run:
```bash
npx tsx scripts/generate-50-stories.ts
```
