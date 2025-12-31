import { prisma } from '@/lib/db'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Heart, ArrowLeft, Clock, Tag } from 'lucide-react'
import Image from 'next/image'

export default async function StoryPage({
  params,
}: {
  params: { id: string }
}) {
  const story = await prisma.story.findUnique({
    where: {
      id: params.id,
      published: true,
    },
  })

  if (!story) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header with cover */}
      <div className="relative bg-white border-b">
        {story.coverImage && (
          <div className="absolute inset-0 opacity-10">
            <Image
              src={story.coverImage}
              alt={story.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="relative container mx-auto px-4 py-8">
          <Link
            href="/stories"
            className="inline-flex items-center text-slate-600 hover:text-slate-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Stories
          </Link>

          <div className="max-w-4xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 bg-slate-900 text-white text-sm rounded-full">
                {story.genre}
              </span>
              <span className="px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-full">
                {story.ageRating}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {story.title}
            </h1>

            <p className="text-xl text-slate-600 mb-4">by {story.author}</p>

            <p className="text-lg text-slate-700 mb-6">{story.summary}</p>

            <div className="flex items-center gap-6 text-sm text-slate-600">
              {story.readingTime && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{story.readingTime} min read</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                <span>{story.viewCount} views</span>
              </div>
            </div>

            {story.tags && (
              <div className="mt-4 flex flex-wrap gap-2">
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
        </div>
      </div>

      {/* Story Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Card className="p-8 md:p-12">
            {/* Action buttons */}
            <div className="flex justify-between items-center mb-8 pb-6 border-b">
              <Button variant="outline" size="sm">
                <Heart className="h-4 w-4 mr-2" />
                Save to Favorites
              </Button>
              <div className="text-sm text-slate-500">
                Published {new Date(story.createdAt).toLocaleDateString()}
              </div>
            </div>

            {/* Story content */}
            <div className="prose prose-slate max-w-none">
              <div className="whitespace-pre-wrap text-lg leading-relaxed">
                {story.content}
              </div>
            </div>

            {/* End of story */}
            <div className="mt-12 pt-8 border-t text-center">
              <p className="text-slate-500 mb-6">
                Thank you for reading "{story.title}"
              </p>
              <div className="flex justify-center gap-4">
                <Button asChild>
                  <Link href="/stories">Browse More Stories</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/signup">Subscribe for Full Access</Link>
                </Button>
              </div>
            </div>
          </Card>

          {/* Related stories could go here */}
        </div>
      </div>
    </div>
  )
}
