// FORCE REBUILD - Regular img tags only
import { prisma } from '@/lib/db'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Heart, LayoutDashboard, Sparkles, BookOpen, Library } from 'lucide-react'
import { StoryFilters } from '@/components/stories/story-filters'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function StoriesPage({
  searchParams,
}: {
  searchParams: Promise<{
    genre?: string
    search?: string
    heatLevel?: string
    length?: string
    sort?: string
  }>
}) {
  const params = await searchParams
  const { genre, search, heatLevel, length, sort = 'newest' } = params

  // Build where clause
  const where: any = {
    published: true,
    ...(genre && { genre }),
    ...(search && {
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { summary: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
        { tags: { contains: search, mode: 'insensitive' } },
      ],
    }),
  }

  // Add heat level filter (would need to add this field to schema later)
  // For now, we'll skip this since ageRating might be similar

  // Add length filter based on reading time
  if (length === 'short') {
    where.readingTime = { lt: 15 } // < 3000 words (~15 min)
  } else if (length === 'medium') {
    where.readingTime = { gte: 15, lte: 25 } // 3000-5000 words (15-25 min)
  } else if (length === 'long') {
    where.readingTime = { gt: 25 } // > 5000 words (> 25 min)
  }

  // Build orderBy based on sort option
  let orderBy: any
  if (sort === 'views') {
    orderBy = { viewCount: 'desc' }
  } else if (sort === 'favorites') {
    orderBy = { favorites: { _count: 'desc' } }
  } else {
    orderBy = { createdAt: 'desc' }
  }

  // Fetch published stories with filters
  const stories = await prisma.story.findMany({
    where,
    orderBy,
    include: {
      _count: {
        select: { favorites: true }
      }
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Dramatic Header */}
      <div className="relative bg-gradient-to-r from-black via-gray-900 to-black border-b border-rose-900/30">
        <div className="absolute inset-0 bg-gradient-to-br from-red-950/20 via-transparent to-purple-950/20" />
        <div className="w-full mx-auto px-5 py-16 relative z-10" style={{ maxWidth: '1400px' }}>
          {/* Navigation */}
          <nav className="mb-8 flex items-center gap-2 flex-wrap">
            <Link href="/dashboard" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
            <Link href="/generate" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors">
              <Sparkles className="h-4 w-4" />
              Generate
            </Link>
            <Link href="/stories" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-gradient-to-r from-rose-700 to-violet-700 text-white rounded-lg">
              <Library className="h-4 w-4" />
              Browse Stories
            </Link>
            <Link href="/my-stories" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors">
              <BookOpen className="h-4 w-4" />
              My Stories
            </Link>
            <Link href="/library" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors">
              <Heart className="h-4 w-4" />
              Favorites
            </Link>
          </nav>

          <div className="flex items-center justify-center mb-4">
            <Heart className="h-8 w-8 text-rose-500 fill-rose-500 mr-3" />
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-center mb-4 font-['Playfair_Display'] bg-gradient-to-r from-rose-400 via-pink-300 to-violet-400 bg-clip-text text-transparent">
            Silk Stories
          </h1>
          <p className="text-gray-300 text-center text-xl mx-auto leading-relaxed" style={{ maxWidth: '700px' }}>
            Indulge in our curated collection of irresistible romance
          </p>
        </div>
      </div>

      <div className="w-full mx-auto px-5 py-12" style={{ maxWidth: '1400px' }}>
        {/* Advanced Filters */}
        <StoryFilters totalCount={stories.length} />

        {/* Stories Grid */}
        <main>
            {stories.length === 0 ? (
              <Card className="p-16 text-center bg-gray-900/30 border-rose-900/30">
                <Heart className="h-16 w-16 text-rose-500/30 mx-auto mb-4" />
                <p className="text-gray-400 text-lg font-medium mb-2">
                  No stories found
                </p>
                <p className="text-gray-500 text-sm">
                  Try adjusting your filters or check back soon for new releases
                </p>
              </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                  {stories.map((story) => (
                    <Link
                      key={story.id}
                      href={`/stories/${story.id}`}
                      className="group"
                    >
                      <Card className="overflow-hidden bg-gray-900/50 border-rose-900/30 hover:border-rose-700/50 transition-all duration-300 hover:shadow-2xl hover:shadow-rose-900/20 hover:-translate-y-1">
                        {/* Cover Image */}
                        {story.coverImage ? (
                          <div className="relative h-72 bg-gray-800 overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={story.coverImage}
                              alt={story.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                          </div>
                        ) : (
                          <div className="h-72 bg-gradient-to-br from-rose-900 via-violet-900 to-gray-900 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-black/20" />
                            <span className="text-white text-6xl font-black font-['Playfair_Display'] relative z-10 opacity-50">
                              {story.title.charAt(0)}
                            </span>
                          </div>
                        )}

                        {/* Story Info */}
                        <div className="p-5">
                          <div className="flex items-center gap-2 mb-3 flex-wrap">
                            <Badge variant="genre" className="text-xs">
                              {story.genre}
                            </Badge>
                            {story.readingTime && (
                              <span className="text-xs text-gray-500">
                                {story.readingTime} min
                              </span>
                            )}
                          </div>
                          <h3 className="font-bold text-xl mb-2 text-white group-hover:text-rose-400 transition-colors font-['Playfair_Display'] line-clamp-2">
                            {story.title}
                          </h3>
                          <p className="text-sm text-gray-400 mb-3">
                            by {story.author}
                          </p>
                          <p className="text-sm text-gray-300 line-clamp-3 leading-relaxed">
                            {story.summary}
                          </p>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
