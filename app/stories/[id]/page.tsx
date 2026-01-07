import { prisma } from '@/lib/db'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Clock, Eye, Heart, BookOpen } from 'lucide-react'
import Image from 'next/image'
import { getCurrentUser } from '@/lib/auth/session'
import { FavoriteButton } from '@/components/story/favorite-button'

export default async function StoryPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await getCurrentUser()

  const story = await prisma.story.findUnique({
    where: { id },
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
      {/* Header with cover */}
      <div className="relative bg-gradient-to-r from-black via-gray-900 to-black border-b border-rose-900/30">
        {story.coverImage && (
          <div className="absolute inset-0 opacity-20">
            <Image
              src={story.coverImage}
              alt={story.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/60" />
          </div>
        )}
        <div className="relative container mx-auto px-4 md:px-6 py-12">
          <Link
            href="/stories"
            className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Stories
          </Link>

          <div className="max-w-4xl">
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

      {/* Story Content */}
      <div className="container max-w-4xl mx-auto px-4 md:px-6 py-12">
        <div className="w-full">
          {/* Action bar */}
          <div className="bg-gray-900/50 border border-rose-900/30 rounded-2xl p-6 mb-8 backdrop-blur-sm">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
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

          {/* Story content with optimal reading typography */}
          <div className="bg-gray-900/40 border border-gray-800/50 rounded-2xl p-8 md:p-12 backdrop-blur-sm">
            <div className="max-w-3xl mx-auto">
              <div
                className="whitespace-pre-wrap text-gray-300 leading-relaxed text-lg"
                style={{
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  lineHeight: '1.8'
                }}
              >
                {story.content}
              </div>
            </div>
          </div>

          {/* End of story section */}
          <div className="mt-12 bg-gradient-to-r from-rose-950/30 to-violet-950/30 border border-rose-900/30 rounded-2xl p-10 text-center backdrop-blur-sm">
            <div className="flex items-center justify-center mb-4">
              <Heart className="h-8 w-8 text-rose-400 fill-rose-400" />
            </div>
            <p className="text-2xl font-bold text-white mb-3 font-['Playfair_Display']">
              The End
            </p>
            <p className="text-gray-400 mb-8 text-lg">
              Thank you for reading "{story.title}"
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
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
        </div>
      </div>
    </div>
  )
}
