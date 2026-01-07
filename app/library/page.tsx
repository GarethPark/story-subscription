import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth/session'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { Heart } from 'lucide-react'

export default async function LibraryPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login?redirect=/library')
  }

  const favorites = await prisma.favorite.findMany({
    where: {
      userId: user.id,
    },
    include: {
      story: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="h-8 w-8 text-rose-500 fill-current" />
            <h1 className="text-4xl font-bold">My Library</h1>
          </div>
          <p className="text-gray-300">
            Your favorite stories, all in one place
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {favorites.length === 0 ? (
          <Card className="p-12 text-center">
            <Heart className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No favorites yet</h2>
            <p className="text-gray-400 mb-6">
              Start building your collection by saving stories you love
            </p>
            <Button asChild>
              <Link href="/stories">Browse Stories</Link>
            </Button>
          </Card>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-300">
              {favorites.length} {favorites.length === 1 ? 'story' : 'stories'}{' '}
              saved
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map(({ story, createdAt }) => (
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
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2 py-1 bg-slate-100 rounded-full">
                            {story.genre}
                          </span>
                          {story.readingTime && (
                            <span className="text-xs text-gray-400">
                              {story.readingTime} min
                            </span>
                          )}
                        </div>
                        <Heart className="h-4 w-4 text-rose-500 fill-current" />
                      </div>
                      <h3 className="font-semibold text-lg mb-1 group-hover:text-gray-300 transition-colors">
                        {story.title}
                      </h3>
                      <p className="text-sm text-gray-400 mb-2">
                        by {story.author}
                      </p>
                      <p className="text-sm text-gray-300 line-clamp-3 mb-2">
                        {story.summary}
                      </p>
                      <p className="text-xs text-slate-400">
                        Saved {new Date(createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
