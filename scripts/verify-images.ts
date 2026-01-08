import { prisma } from '../lib/db'
import * as fs from 'fs'
import * as path from 'path'

async function verifyImages() {
  console.log('🔍 COMPREHENSIVE IMAGE VERIFICATION\n')
  console.log('=' .repeat(80))

  // Test 1: Check local files
  console.log('\n📁 TEST 1: Local File System\n')
  const publicDir = path.join(process.cwd(), 'public')
  const genreTropesDir = path.join(publicDir, 'images', 'genre-tropes')

  console.log(`Public dir: ${publicDir}`)
  console.log(`Genre-tropes dir: ${genreTropesDir}`)
  console.log(`Directory exists: ${fs.existsSync(genreTropesDir)}`)

  if (fs.existsSync(genreTropesDir)) {
    const files = fs.readdirSync(genreTropesDir)
    console.log(`\nFiles in directory (${files.length}):`)
    files.forEach(file => {
      const filePath = path.join(genreTropesDir, file)
      const stats = fs.statSync(filePath)
      console.log(`  ✅ ${file} (${(stats.size / 1024).toFixed(2)} KB)`)
    })
  } else {
    console.log('❌ Directory does not exist!')
  }

  // Test 2: Check database paths
  console.log('\n' + '='.repeat(80))
  console.log('\n📊 TEST 2: Database Cover Paths\n')

  const stories = await prisma.story.findMany({
    where: {
      published: true
    },
    select: {
      id: true,
      title: true,
      genre: true,
      tags: true,
      coverImage: true
    },
    orderBy: { createdAt: 'desc' }
  })

  console.log(`Total published stories: ${stories.length}`)

  const storiesWithCovers = stories.filter(s => s.coverImage && s.coverImage !== '')
  const storiesWithoutCovers = stories.filter(s => !s.coverImage || s.coverImage === '')

  console.log(`Stories WITH covers: ${storiesWithCovers.length}`)
  console.log(`Stories WITHOUT covers: ${storiesWithoutCovers.length}`)

  // Test 3: Verify each cover path
  console.log('\n' + '='.repeat(80))
  console.log('\n🔗 TEST 3: Cover Path Verification\n')

  for (const story of storiesWithCovers) {
    const publicPath = path.join(publicDir, story.coverImage)
    const exists = fs.existsSync(publicPath)

    console.log(`${exists ? '✅' : '❌'} ${story.title}`)
    console.log(`   DB Path: ${story.coverImage}`)
    console.log(`   File System: ${exists ? 'EXISTS' : 'NOT FOUND'}`)

    if (!exists) {
      console.log(`   Expected at: ${publicPath}`)

      // Check what file SHOULD be there based on genre + first trope
      if (story.tags && story.genre) {
        const firstTrope = story.tags.split(',')[0]?.trim().toLowerCase().replace(/\s+/g, '-')
        const genreSlug = story.genre.toLowerCase().replace(/\s+/g, '-')
        const expectedPng = path.join(genreTropesDir, `${genreSlug}_${firstTrope}.png`)
        const expectedJpg = path.join(genreTropesDir, `${genreSlug}_${firstTrope}.jpg`)

        console.log(`   Expected file: ${genreSlug}_${firstTrope}.[png|jpg]`)
        console.log(`   PNG exists: ${fs.existsSync(expectedPng)}`)
        console.log(`   JPG exists: ${fs.existsSync(expectedJpg)}`)
      }
    }
    console.log()
  }

  // Test 4: Check for orphaned images
  console.log('=' .repeat(80))
  console.log('\n🗂️  TEST 4: Orphaned Images (not used by any story)\n')

  if (fs.existsSync(genreTropesDir)) {
    const files = fs.readdirSync(genreTropesDir)
    const usedPaths = new Set(storiesWithCovers.map(s => s.coverImage))

    files.forEach(file => {
      const urlPath = `/images/genre-tropes/${file}`
      if (!usedPaths.has(urlPath)) {
        console.log(`⚠️  ${file} - Not used by any story`)
      }
    })
  }

  // Test 5: Stories needing covers
  console.log('\n' + '='.repeat(80))
  console.log('\n📸 TEST 5: Stories Needing Covers\n')

  for (const story of storiesWithoutCovers) {
    console.log(`❌ ${story.title}`)
    console.log(`   Genre: ${story.genre}`)
    console.log(`   First trope: ${story.tags?.split(',')[0]?.trim()}`)

    if (story.tags && story.genre) {
      const firstTrope = story.tags.split(',')[0]?.trim().toLowerCase().replace(/\s+/g, '-')
      const genreSlug = story.genre.toLowerCase().replace(/\s+/g, '-')
      console.log(`   Needs: ${genreSlug}_${firstTrope}.[png|jpg]`)
    }
    console.log()
  }

  // Test 6: Git verification
  console.log('=' .repeat(80))
  console.log('\n🔧 TEST 6: Git Status\n')

  const { execSync } = require('child_process')

  try {
    const gitFiles = execSync('git ls-files public/images/genre-tropes/', { encoding: 'utf-8' })
    const trackedFiles = gitFiles.trim().split('\n').filter(Boolean)
    console.log(`Files tracked in git: ${trackedFiles.length}`)
    trackedFiles.forEach(file => console.log(`  ✅ ${file}`))
  } catch (error) {
    console.log('❌ Could not check git status')
  }

  // Summary
  console.log('\n' + '='.repeat(80))
  console.log('\n📋 SUMMARY\n')
  console.log(`✅ Total stories: ${stories.length}`)
  console.log(`✅ Stories with covers: ${storiesWithCovers.length}`)
  console.log(`⚠️  Stories without covers: ${storiesWithoutCovers.length}`)

  if (fs.existsSync(genreTropesDir)) {
    const files = fs.readdirSync(genreTropesDir)
    console.log(`✅ Image files available: ${files.length}`)
  }

  console.log('\n' + '='.repeat(80))

  await prisma.$disconnect()
}

verifyImages().catch(console.error)
