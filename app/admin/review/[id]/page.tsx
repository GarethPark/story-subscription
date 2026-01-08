import { redirect, notFound } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/session'
import { prisma } from '@/lib/db'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowLeft, Clock, Tag, AlertCircle } from 'lucide-react'
import Image from 'next/image'
import { StoryReviewActions } from '@/components/admin/story-review-actions'

export default async function ReviewStoryPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await getCurrentUser()
  const { id } = await params

  if (!user) {
    redirect('/login?redirect=/admin/review/' + id)
  }

  if (!user.isAdmin) {
    redirect('/dashboard')
  }

  const story = await prisma.story.findUnique({
    where: { id },
  })

  if (!story) {
    notFound()
  }

  const wordCount = story.content.split(/\s+/).length

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-10">
        <div className="w-full px-5 py-4" style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="text-slate-600 hover:text-slate-900">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-xl font-bold">Review Generated Story</h1>
                <p className="text-sm text-slate-600">
                  {story.published ? 'Published' : 'Draft - Not Published'}
                </p>
              </div>
            </div>
            <span className="text-sm text-slate-600">{user.email}</span>
          </div>
        </div>
      </header>

      {/* Alert Banner */}
      {!story.published && (
        <div className="bg-yellow-50 border-b border-yellow-200">
          <div className="w-full px-5 py-3" style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <div className="flex items-center gap-2 text-yellow-800">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm font-medium">
                This story is a draft. Review the content and quality before publishing.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Story Preview */}
      <div className="w-full py-8">
        <div className="mx-auto px-5" style={{ maxWidth: '900px' }}>
          {/* Story Header */}
          <div className="mb-8">
            {story.coverImage && (
              <div className="relative h-96 rounded-lg overflow-hidden mb-6">
                <Image
                  src={story.coverImage}
                  alt={story.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 bg-slate-900 text-white text-sm rounded-full">
                {story.genre}
              </span>
              <span className="px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-full">
                {story.ageRating}
              </span>
              {!story.published && (
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full font-medium">
                  DRAFT
                </span>
              )}
            </div>

            <h1 className="text-4xl font-bold mb-4">{story.title}</h1>
            <p className="text-xl text-slate-600 mb-4">by {story.author}</p>
            <p className="text-lg text-slate-700 mb-6">{story.summary}</p>

            <div className="flex items-center gap-6 text-sm text-slate-600 mb-4">
              {story.readingTime && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{story.readingTime} min read</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                <span>{wordCount.toLocaleString()} words</span>
              </div>
            </div>

            {story.tags && (
              <div className="flex flex-wrap gap-2 mb-6">
                {story.tags.split(',').map((tag) => (
                  <span
                    key={tag.trim()}
                    className="px-2 py-1 bg-white border border-slate-200 text-xs rounded"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Story Content */}
          <Card className="p-8 md:p-12 mb-8">
            <div
              className="whitespace-pre-wrap text-slate-800"
              style={{
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontSize: '18px',
                lineHeight: '1.75',
                letterSpacing: '0.01em'
              }}
            >
              {story.content}
            </div>
          </Card>

          {/* Review Actions */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Review Actions</h2>
            <StoryReviewActions
              storyId={story.id}
              isPublished={story.published}
              title={story.title}
            />
          </Card>
        </div>
      </div>
    </div>
  )
}
