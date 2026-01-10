'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { MessageSquare, Send } from 'lucide-react'

interface Review {
  id: string
  content: string
  createdAt: string
  userName: string
}

interface StoryReviewsProps {
  storyId: string
  isAuthenticated: boolean
}

export function StoryReviews({ storyId, isAuthenticated }: StoryReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [newReview, setNewReview] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showReviewForm, setShowReviewForm] = useState(false)

  useEffect(() => {
    fetchReviews()
  }, [storyId])

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/stories/${storyId}/reviews`)
      const data = await response.json()
      setReviews(data.reviews)
    } catch (error) {
      console.error('Failed to fetch reviews:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isAuthenticated) {
      alert('Please sign in to leave a review')
      return
    }

    if (newReview.trim().length < 10) {
      alert('Review must be at least 10 characters')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/stories/${storyId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newReview }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit review')
      }

      const data = await response.json()
      setReviews([data.review, ...reviews])
      setNewReview('')
      setShowReviewForm(false)
    } catch (error) {
      console.error('Failed to submit review:', error)
      alert('Failed to submit review. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-rose-500" />
          Reviews ({reviews.length})
        </h3>
        {isAuthenticated && !showReviewForm && (
          <Button
            onClick={() => setShowReviewForm(true)}
            variant="outline"
            size="sm"
            className="border-gray-700 bg-gray-800 hover:bg-gray-700 text-white"
          >
            Write a Review
          </Button>
        )}
      </div>

      {/* Review Form */}
      {showReviewForm && isAuthenticated && (
        <form onSubmit={handleSubmit} className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
          <textarea
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            placeholder="Share your thoughts about this story... (minimum 10 characters)"
            className="w-full h-24 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-600 resize-none"
            maxLength={1000}
          />
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-gray-500">
              {newReview.length}/1000 characters
            </span>
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={() => {
                  setShowReviewForm(false)
                  setNewReview('')
                }}
                variant="outline"
                size="sm"
                className="border-gray-700 text-gray-300"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || newReview.trim().length < 10}
                size="sm"
                className="bg-gradient-to-r from-rose-700 to-violet-700 hover:from-rose-600 hover:to-violet-600"
              >
                {isSubmitting ? (
                  'Submitting...'
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Submit Review
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* Reviews List */}
      {isLoading ? (
        <div className="text-center py-8 text-gray-500">Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 bg-gray-900/30 border border-gray-800 rounded-xl">
          <MessageSquare className="h-12 w-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 mb-2">No reviews yet</p>
          <p className="text-sm text-gray-500">Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-600 to-violet-600 flex items-center justify-center text-white font-bold text-sm">
                    {review.userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{review.userName}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed">{review.content}</p>
            </div>
          ))}
        </div>
      )}

      {!isAuthenticated && (
        <div className="text-center py-6 bg-violet-950/20 border border-violet-700/30 rounded-xl">
          <p className="text-gray-400 mb-3">Want to leave a review?</p>
          <a
            href="/login"
            className="inline-block px-4 py-2 bg-gradient-to-r from-rose-700 to-violet-700 hover:from-rose-600 hover:to-violet-600 text-white rounded-lg font-medium transition-all"
          >
            Sign In to Review
          </a>
        </div>
      )}
    </div>
  )
}
