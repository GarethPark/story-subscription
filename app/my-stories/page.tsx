import { getCurrentUser } from '@/lib/auth/session'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import { Clock, BookOpen, Sparkles, AlertCircle, Loader2 } from 'lucide-react'

export default async function MyStoriesPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login?redirect=/my-stories')
  }

  // Fetch user's custom stories
  const stories = await prisma.story.findMany({
    where: {
      userId: user.id,
      isCustom: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      title: true,
      summary: true,
      coverImage: true,
      genre: true,
      tags: true,
      readingTime: true,
      ageRating: true,
      generationStatus: true,
      generationError: true,
      createdAt: true,
      characterNames: true,
      customScenario: true,
    },
  })

  const completedStories = stories.filter(s => s.generationStatus === 'COMPLETED')
  const generatingStories = stories.filter(s => s.generationStatus === 'GENERATING' || s.generationStatus === 'PENDING')
  const failedStories = stories.filter(s => s.generationStatus === 'FAILED')

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white py-12">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            My Stories
          </h1>
          <p className="text-slate-600">
            Your personalized romance story collection
          </p>
        </div>

        {/* Credits and CTA */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-1">
                Ready for another adventure?
              </h2>
              <p className="text-slate-600 text-sm">
                You have <span className="font-bold text-rose-600">{user.credits}</span> credits remaining
              </p>
            </div>
            <Link
              href="/generate"
              className="px-6 py-3 bg-rose-600 text-white rounded-lg font-medium hover:bg-rose-700 transition-colors flex items-center gap-2"
            >
              <Sparkles className="h-5 w-5" />
              Create New Story
            </Link>
          </div>
        </div>

        {/* Generating Stories */}
        {generatingStories.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              Generating Now
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {generatingStories.map((story) => (
                <div key={story.id} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <Loader2 className="h-5 w-5 text-blue-600 animate-spin flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium text-blue-900">
                        {story.genre} Romance - {story.tags}
                      </p>
                      <p className="text-sm text-blue-700 mt-1">
                        {story.generationStatus === 'PENDING' ? 'Starting generation...' : 'Generating your story... This takes 1-2 minutes.'}
                      </p>
                      {story.characterNames && (
                        <p className="text-xs text-blue-600 mt-1">
                          Custom characters: {JSON.parse(story.characterNames).protagonist || 'Auto'} & {JSON.parse(story.characterNames).loveInterest || 'Auto'}
                        </p>
                      )}
                    </div>
                    <Link
                      href={`/stories/${story.id}`}
                      className="text-sm text-blue-700 hover:text-blue-900 font-medium"
                    >
                      View Status
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Failed Stories */}
        {failedStories.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <AlertCircle className="h-6 w-6 text-red-600" />
              Failed Generations
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {failedStories.map((story) => (
                <div key={story.id} className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium text-red-900">
                        {story.genre} Romance - {story.tags}
                      </p>
                      <p className="text-sm text-red-700 mt-1">
                        Error: {story.generationError || 'Unknown error occurred'}
                      </p>
                      <p className="text-xs text-red-600 mt-1">
                        Your credit has been refunded. Please try again.
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Completed Stories */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Your Library ({completedStories.length})
          </h2>

          {completedStories.length === 0 && generatingStories.length === 0 && failedStories.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <BookOpen className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                No stories yet
              </h3>
              <p className="text-slate-600 mb-6">
                Create your first personalized romance story
              </p>
              <Link
                href="/generate"
                className="inline-flex items-center gap-2 px-6 py-3 bg-rose-600 text-white rounded-lg font-medium hover:bg-rose-700 transition-colors"
              >
                <Sparkles className="h-5 w-5" />
                Create Your First Story
              </Link>
            </div>
          ) : completedStories.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <p className="text-slate-600">
                Your completed stories will appear here
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedStories.map((story) => (
                <Link
                  key={story.id}
                  href={`/stories/${story.id}`}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden group"
                >
                  {/* Cover Image */}
                  <div className="aspect-[2/3] relative bg-gradient-to-br from-rose-400 via-purple-400 to-pink-400">
                    {story.coverImage ? (
                      <img
                        src={story.coverImage}
                        alt={story.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="h-16 w-16 text-white opacity-50" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {story.ageRating}
                    </div>
                  </div>

                  {/* Story Info */}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-rose-600 bg-rose-50 px-2 py-1 rounded">
                        {story.genre}
                      </span>
                      {story.readingTime && (
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {story.readingTime} min
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-slate-900 mb-1 line-clamp-2 group-hover:text-rose-600 transition-colors">
                      {story.title}
                    </h3>

                    <p className="text-sm text-slate-600 line-clamp-2 mb-2">
                      {story.summary}
                    </p>

                    {story.characterNames && (
                      <div className="text-xs text-purple-700 bg-purple-50 px-2 py-1 rounded mb-2">
                        Custom characters
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1">
                      {story.tags?.split(',').slice(0, 2).map((tag, i) => (
                        <span
                          key={i}
                          className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
