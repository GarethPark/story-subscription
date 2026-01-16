import { prisma } from '@/lib/db'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Clock, Eye, Heart, BookOpen, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { getCurrentUser } from '@/lib/auth/session'
import { FavoriteButton } from '@/components/story/favorite-button'
import { ContinueStoryButton } from '@/components/story/continue-story-button'
import { ReadingTracker } from '@/components/story/reading-tracker'
import { StoryContent } from '@/components/story/story-content'
import { StoryRating } from '@/components/story/story-rating'
import { StoryReviews } from '@/components/story/story-reviews'

// Genre mood images - map all genres to available images
const GENRE_MOOD_IMAGES: Record<string, string> = {
  'Contemporary': '/images/genre-tropes/contemporary_grumpy-sunshine.png',
  'Dark Romance': '/images/genre-tropes/dark-romance_forbidden-love.png',
  'Romantasy': '/images/genre-tropes/romantasy_enemies-to-lovers.png',
  'Fantasy': '/images/genre-tropes/romantasy_enemies-to-lovers.png',
  'Historical': '/images/genre-tropes/contemporary_grumpy-sunshine.png',
  'Paranormal': '/images/genre-tropes/dark-romance_morally-gray-hero.png',
  'Suspense': '/images/genre-tropes/dark-romance_morally-gray-hero.png',
  'Small Town': '/images/genre-tropes/contemporary_grumpy-sunshine.png',
  'Sports Romance': '/images/genre-tropes/contemporary_grumpy-sunshine.png',
  'Romantic Suspense': '/images/genre-tropes/dark-romance_morally-gray-hero.png',
}

export default async function StoryPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await getCurrentUser()

  const story = await prisma.story.findUnique({
    where: { id },
    include: {
      extensions: {
        where: { published: true },
        orderBy: { chapterNumber: 'asc' },
      },
    },
  })

  if (!story) {
    notFound()
  }

  // Check access: story must be published OR user owns it OR user is admin
  const hasAccess = story.published ||
                    (user && story.userId === user.id) ||
                    (user?.isAdmin)

  if (!hasAccess) {
    notFound()
  }

  // Check if user has favorited this story
  let isFavorited = false
  if (user) {
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_storyId: {
          userId: user.id,
          storyId: story.id,
        },
      },
    })
    isFavorited = !!favorite
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Track reading for authenticated users */}
      <ReadingTracker storyId={story.id} isAuthenticated={!!user} />

      {/* Header with cover */}
      <div className="relative bg-gradient-to-r from-black via-gray-900 to-black border-b border-rose-900/30">
        {(story.coverImage || (story.genre && GENRE_MOOD_IMAGES[story.genre])) && (
          <div className="absolute inset-0 opacity-20">
            <Image
              src={story.coverImage || GENRE_MOOD_IMAGES[story.genre!]}
              alt={story.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/60" />
          </div>
        )}
        <div className="relative w-full py-12">
          <div className="mx-auto" style={{ maxWidth: '900px', padding: '0 20px' }}>
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <Link
                href="/stories"
                className="inline-flex items-center text-gray-400 hover:text-white transition-colors group"
              >
                <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Stories
              </Link>
              {story.parentStoryId && (
                <>
                  <span className="text-gray-600">•</span>
                  <Link
                    href={`/stories/${story.parentStoryId}`}
                    className="inline-flex items-center text-violet-400 hover:text-violet-300 transition-colors"
                  >
                    Read Chapter 1
                  </Link>
                </>
              )}
            </div>

            <div>
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <Badge variant="genre">
                {story.genre}
              </Badge>
              {story.ageRating && (
                <Badge variant="default" className="bg-gray-700 text-gray-200">
                  {story.ageRating}
                </Badge>
              )}
              {story.isCustom && (
                <Badge variant="default" className="bg-violet-700 text-white">
                  Custom Story
                </Badge>
              )}
            </div>

            <h1 className="text-4xl md:text-6xl font-black mb-5 text-white font-['Playfair_Display'] leading-tight">
              {story.title}
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-4 font-medium">by {story.author}</p>

            <p className="text-lg text-gray-400 mb-8 leading-relaxed">{story.summary}</p>

            <div className="flex items-center gap-6 text-sm text-gray-500">
              {story.readingTime && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{story.readingTime} min read</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span>{story.viewCount} views</span>
              </div>
              {user && (
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>Reader Mode</span>
                </div>
              )}
            </div>

            {story.tags && (
              <div className="mt-6 flex flex-wrap gap-2">
                {story.tags.split(',').map((tag) => (
                  <span
                    key={tag.trim()}
                    className="px-3 py-1.5 bg-gray-800/50 border border-gray-700 text-gray-300 text-xs rounded-lg hover:bg-gray-700/50 transition-colors"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}
            </div>
          </div>
        </div>
      </div>

      {/* Story Content */}
      <div className="w-full py-8 sm:py-12">
        <div className="mx-auto" style={{ maxWidth: '800px', padding: '0 20px' }}>
          {/* Action bar */}
          <div className="bg-gray-900/50 border border-rose-900/30 rounded-xl p-4 mb-6 sm:mb-8 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <FavoriteButton
                storyId={story.id}
                initialIsFavorited={isFavorited}
                isAuthenticated={!!user}
              />
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <span className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Published {new Date(story.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Mood Image */}
          {story.genre && GENRE_MOOD_IMAGES[story.genre] && (
            <div className="mb-8 sm:mb-10 rounded-2xl overflow-hidden border border-rose-900/30 shadow-2xl shadow-rose-900/10">
              <div className="relative aspect-[21/9] w-full">
                <Image
                  src={GENRE_MOOD_IMAGES[story.genre]}
                  alt={`${story.genre} mood`}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
                <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6">
                  <span className="px-3 py-1.5 bg-black/60 backdrop-blur-sm text-rose-300 text-sm font-medium rounded-full border border-rose-500/30">
                    {story.genre} Romance
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Story content */}
          <StoryContent content={story.content} />

          {/* Rating & Reviews Section */}
          <div className="mt-12 space-y-8">
            {/* Rating */}
            <div className="bg-gray-900/50 border border-rose-900/30 rounded-xl p-6 backdrop-blur-sm">
              <h3 className="text-lg font-bold text-white mb-4">Rate This Story</h3>
              <StoryRating storyId={story.id} isAuthenticated={!!user} />
            </div>

            {/* Reviews */}
            <div className="bg-gray-900/50 border border-rose-900/30 rounded-xl p-6 backdrop-blur-sm">
              <StoryReviews storyId={story.id} isAuthenticated={!!user} />
            </div>
          </div>

          {/* End of story section */}
          <div className="mt-12 bg-gradient-to-r from-rose-950/30 to-violet-950/30 border border-rose-900/30 rounded-2xl p-10 text-center backdrop-blur-sm">
            <div className="flex items-center justify-center mb-4">
              <Heart className="h-8 w-8 text-rose-400 fill-rose-400" />
            </div>
            <p className="text-2xl font-bold text-white mb-3 font-['Playfair_Display']">
              {story.chapterNumber > 1 ? `End of Chapter ${story.chapterNumber}` : 'The End'}
            </p>
            <p className="text-gray-400 mb-8 text-lg">
              Thank you for reading "{story.title}"
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {user && !story.parentStoryId && (
                <ContinueStoryButton storyId={story.id} isAuthenticated={true} />
              )}
              <Button
                asChild
                className="bg-gradient-to-r from-rose-700 to-violet-700 hover:from-rose-600 hover:to-violet-600 shadow-lg"
              >
                <Link href="/stories">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Browse More Stories
                </Link>
              </Button>
              {!user && (
                <Button
                  variant="outline"
                  asChild
                  className="border-gray-700 bg-gray-800 hover:bg-gray-700 text-white"
                >
                  <Link href="/signup">
                    <Heart className="mr-2 h-5 w-5" />
                    Create Free Account
                  </Link>
                </Button>
              )}
              {user && (
                <Button
                  variant="outline"
                  asChild
                  className="border-gray-700 bg-gray-800 hover:bg-gray-700 text-white"
                >
                  <Link href="/generate">
                    Create Your Own Story
                  </Link>
                </Button>
              )}
            </div>
          </div>

          {/* Show extensions if they exist */}
          {story.extensions && story.extensions.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-white mb-4 font-['Playfair_Display']">
                Continue Reading
              </h2>
              <div className="space-y-4">
                {story.extensions.map((extension) => (
                  <Link
                    key={extension.id}
                    href={`/stories/${extension.id}`}
                    className="block bg-gray-900/50 border border-gray-800 hover:border-violet-700 rounded-xl p-6 transition-all hover:shadow-lg hover:shadow-violet-900/20"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="default" className="bg-violet-700 text-white">
                            Chapter {extension.chapterNumber}
                          </Badge>
                          {extension.readingTime && (
                            <span className="text-sm text-gray-500">
                              {extension.readingTime} min read
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">
                          {extension.title}
                        </h3>
                        <p className="text-gray-400 text-sm line-clamp-2">
                          {extension.summary}
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-500 flex-shrink-0 ml-4" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
