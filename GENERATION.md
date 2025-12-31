# AI Story & Cover Generation Guide

This project uses AI to generate full-length romance stories and matching cover art.

## Setup

### 1. Get API Keys

**Anthropic API (for story generation):**
- Go to https://console.anthropic.com/
- Create an account or log in
- Navigate to API Keys
- Create a new API key
- Copy the key (starts with `sk-ant-...`)

**OpenAI API (for cover images):**
- Go to https://platform.openai.com/
- Create an account or log in
- Navigate to API Keys
- Create a new secret key
- Copy the key (starts with `sk-...`)

### 2. Add Keys to .env

Copy `.env.example` to `.env` if you haven't already:
```bash
cp .env.example .env
```

Edit `.env` and add your API keys:
```bash
ANTHROPIC_API_KEY="sk-ant-your-actual-key-here"
OPENAI_API_KEY="sk-your-actual-key-here"
```

## Usage

### Generate a Story

Basic command:
```bash
npx tsx generate-story.ts [genre] [heatLevel] [tropes]
```

### Examples

**Contemporary Romance - Hot:**
```bash
npx tsx generate-story.ts Contemporary Hot "enemies to lovers,billionaire"
```

**Historical Romance - Warm:**
```bash
npx tsx generate-story.ts Historical Warm "arranged marriage,class difference"
```

**Paranormal Romance - Scorching:**
```bash
npx tsx generate-story.ts Paranormal Scorching "fated mates,vampire romance"
```

**Fantasy Romance - Sweet:**
```bash
npx tsx generate-story.ts Fantasy Sweet "destined lovers,royal romance"
```

**Suspense Romance - Hot:**
```bash
npx tsx generate-story.ts Suspense Hot "bodyguard,protector romance"
```

## Genres

- **Contemporary** - Modern-day romance
- **Historical** - Period romance (Regency, Victorian, etc.)
- **Paranormal** - Vampires, shifters, witches, supernatural
- **Fantasy** - Epic fantasy, magic, dragons
- **Suspense** - Romantic suspense, mystery, thriller

## Heat Levels

- **Sweet** (PG-13) - Innocent touches, fade to black, emotional connection
- **Warm** (16+) - Sensual tension, passionate kissing, implied intimacy
- **Hot** (18+) - Explicit romantic scenes, detailed intimate moments
- **Scorching** (18+) - Very explicit, erotic romance, graphic descriptions

## Available Tropes

### Contemporary
- enemies to lovers, second chance, fake relationship, boss/employee, friends to lovers, forced proximity

### Historical
- arranged marriage, forbidden love, secret identity, class difference, marriage of convenience, redemption

### Paranormal
- fated mates, vampire romance, shifter romance, witch/warlock, forbidden supernatural love, chosen one

### Fantasy
- destined lovers, magic bond, rival kingdoms, quest romance, dragon shifter, royal romance

### Suspense
- protector romance, witness protection, undercover, romantic suspense, bodyguard, detective romance

## What Gets Generated

For each story, the script will:

1. **Generate Story Content** (~3,500 words)
   - Compelling title
   - Author pen name
   - Book description/summary
   - Complete story with beginning, middle, climax, and HEA (Happily Ever After)
   - Tags and metadata

2. **Generate Cover Image**
   - AI-generated romantic cover art using DALL-E 3
   - Vertical book cover format (1024x1792)
   - Matches genre and story themes
   - Professional quality

3. **Save to Database**
   - Automatically published
   - Calculates reading time
   - Sets appropriate age rating
   - Adds all metadata

4. **Output**
   - Success message with story ID
   - Direct link to view the story
   - Word count and reading time

## Costs

Approximate costs per story:

- **Claude Sonnet 4.5** (story generation): ~$0.15-0.30
- **DALL-E 3 HD** (cover image): ~$0.08
- **Total per story**: ~$0.23-0.38

## Tips

1. **Mix tropes** - Combine 2-3 tropes for more interesting stories
2. **Experiment with heat levels** - Different audiences prefer different levels
3. **Generate batches** - Create multiple stories at once for variety
4. **Review before publishing** - AI-generated content may need light editing

## Troubleshooting

**"API key not found"**
- Make sure you've added keys to `.env` file
- Restart your dev server after adding keys

**"Rate limit exceeded"**
- You've hit API limits
- Wait a few minutes or upgrade your API plan

**"Failed to parse story"**
- Rare AI formatting issue
- Try running the command again

**"No image URL returned"**
- DALL-E failed to generate image
- Story will still be saved with gradient fallback

## Need Help?

Check the main README.md for more information about the project architecture.
