import { prisma } from '@/lib/db'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'

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

  // Get unique genres for filter
  const allStories = await prisma.story.findMany({
    where: { published: true },
    select: { genre: true },
  })
  const genres = [...new Set(allStories.map((s) => s.genre))]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-2">Story Library</h1>
          <p className="text-slate-600">
            Discover captivating romance stories from talented authors
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <Card className="p-6">
              <h2 className="font-semibold text-lg mb-4">Filters</h2>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Search
                </label>
                <form method="get">
                  <input
                    type="text"
                    name="search"
                    placeholder="Search stories..."
                    defaultValue={search}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                  <input type="hidden" name="genre" value={genre} />
                  <Button type="submit" className="w-full mt-2">
                    Search
                  </Button>
                </form>
              </div>

              {/* Genre Filter */}
              <div>
                <h3 className="text-sm font-medium mb-3">Genre</h3>
                <div className="space-y-2">
                  <Link
                    href="/stories"
                    className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                      !genre
                        ? 'bg-slate-900 text-white'
                        : 'hover:bg-slate-100'
                    }`}
                  >
                    All Stories
                  </Link>
                  {genres.map((g) => (
                    <Link
                      key={g}
                      href={`/stories?genre=${g}`}
                      className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                        genre === g
                          ? 'bg-slate-900 text-white'
                          : 'hover:bg-slate-100'
                      }`}
                    >
                      {g}
                    </Link>
                  ))}
                </div>
              </div>
            </Card>
          </aside>

          {/* Stories Grid */}
          <main className="flex-1">
            {stories.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-slate-500 text-lg">
                  No stories found. Check back soon!
                </p>
              </Card>
            ) : (
              <>
                <div className="mb-4 text-sm text-slate-600">
                  {stories.length} {stories.length === 1 ? 'story' : 'stories'}{' '}
                  found
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {stories.map((story) => (
                    <Link
                      key={story.id}
                      href={`/stories/${story.id}`}
                      className="group"
                    >
                      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                        {/* Cover Image */}
                        {story.coverImage ? (
                          <div className="relative h-64 bg-slate-200">
                            <Image
                              src={story.coverImage}
                              alt={story.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        ) : (
                          <div className="h-64 bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center">
                            <span className="text-white text-4xl font-bold">
                              {story.title.charAt(0)}
                            </span>
                          </div>
                        )}

                        {/* Story Info */}
                        <div className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs px-2 py-1 bg-slate-100 rounded-full">
                              {story.genre}
                            </span>
                            {story.readingTime && (
                              <span className="text-xs text-slate-500">
                                {story.readingTime} min read
                              </span>
                            )}
                          </div>
                          <h3 className="font-semibold text-lg mb-1 group-hover:text-slate-600 transition-colors">
                            {story.title}
                          </h3>
                          <p className="text-sm text-slate-500 mb-2">
                            by {story.author}
                          </p>
                          <p className="text-sm text-slate-600 line-clamp-3">
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
