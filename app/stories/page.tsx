import { prisma } from '@/lib/db'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, Search, LayoutDashboard, Sparkles, BookOpen, Library } from 'lucide-react'

export default async function StoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ genre?: string; search?: string }>
}) {
  const { genre, search } = await searchParams

  // Fetch published stories
  const stories = await prisma.story.findMany({
    where: {
      published: true,
      ...(genre && { genre: genre }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { summary: { contains: search, mode: 'insensitive' } },
          { author: { contains: search, mode: 'insensitive' } },
        ],
      }),
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  // Get unique genres for filters
  const allStories = await prisma.story.findMany({
    where: { published: true },
    select: { genre: true },
  })
  const genres = [...new Set(allStories.map((s) => s.genre).filter(Boolean))]

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

      <div className="w-full mx-auto px-5 py-12" style={{ maxWidth: '1600px' }}>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <Card className="bg-gray-900/50 border-rose-900/30 backdrop-blur-sm sticky top-4">
              <div className="p-6">
                <h2 className="font-bold text-xl mb-6 text-white font-['Playfair_Display']">
                  Discover
                </h2>

                {/* Search */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Search Stories
                  </label>
                  <form method="get" className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input
                      type="text"
                      name="search"
                      placeholder="Find your passion..."
                      defaultValue={search}
                      className="w-full pl-10 pr-3 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-600 focus:border-transparent text-white placeholder:text-gray-500"
                    />
                    <input type="hidden" name="genre" value={genre || ''} />
                    <Button type="submit" className="w-full mt-3 bg-gradient-to-r from-rose-700 to-violet-700 hover:from-rose-600 hover:to-violet-600">
                      Search
                    </Button>
                  </form>
                </div>

                {/* Genre Filter */}
                <div>
                  <h3 className="text-sm font-semibold mb-3 text-gray-300 uppercase tracking-wider">
                    Genre
                  </h3>
                  <div className="space-y-1.5">
                    <Link
                      href="/stories"
                      className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        !genre
                          ? 'bg-gradient-to-r from-rose-700 to-violet-700 text-white shadow-lg'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                      }`}
                    >
                      All Stories
                    </Link>
                    {genres.map((g) => (
                      <Link
                        key={g}
                        href={`/stories?genre=${g}`}
                        className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                          genre === g
                            ? 'bg-gradient-to-r from-rose-700 to-violet-700 text-white shadow-lg'
                            : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                        }`}
                      >
                        {g}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </aside>

          {/* Stories Grid */}
          <main className="flex-1">
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
              <>
                <div className="mb-6 flex items-center justify-between">
                  <div className="text-sm text-gray-400">
                    <span className="text-rose-400 font-semibold">{stories.length}</span>{' '}
                    {stories.length === 1 ? 'story' : 'stories'} available
                  </div>
                  {(genre || search) && (
                    <Link
                      href="/stories"
                      className="text-sm text-rose-400 hover:text-rose-300 transition-colors"
                    >
                      Clear filters
                    </Link>
                  )}
                </div>
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
                            <Image
                              src={story.coverImage}
                              alt={story.title}
                              fill
                              unoptimized
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
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
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
