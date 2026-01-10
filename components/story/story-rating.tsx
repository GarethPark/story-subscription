'use client'

import { useState, useEffect } from 'react'
import { Star } from 'lucide-react'

interface StoryRatingProps {
  storyId: string
  isAuthenticated: boolean
}

export function StoryRating({ storyId, isAuthenticated }: StoryRatingProps) {
  const [userRating, setUserRating] = useState<number | null>(null)
  const [hoverRating, setHoverRating] = useState<number | null>(null)
  const [averageRating, setAverageRating] = useState<number>(0)
  const [ratingCount, setRatingCount] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchRatings()
  }, [storyId])

  const fetchRatings = async () => {
    try {
      const response = await fetch(`/api/stories/${storyId}/rate`)
      const data = await response.json()
      setAverageRating(data.averageRating)
      setRatingCount(data.ratingCount)
      setUserRating(data.userRating)
    } catch (error) {
      console.error('Failed to fetch ratings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRate = async (rating: number) => {
    if (!isAuthenticated) {
      alert('Please sign in to rate this story')
      return
    }

    try {
      const response = await fetch(`/api/stories/${storyId}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating }),
      })

      if (!response.ok) {
        throw new Error('Failed to save rating')
      }

      const data = await response.json()
      setUserRating(data.rating)
      setAverageRating(data.averageRating)
      setRatingCount(data.ratingCount)
    } catch (error) {
      console.error('Failed to rate:', error)
      alert('Failed to save rating. Please try again.')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className="h-5 w-5 text-gray-600" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Average Rating Display */}
      {ratingCount > 0 && (
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-5 w-5 ${
                  star <= Math.round(averageRating)
                    ? 'fill-rose-500 text-rose-500'
                    : 'text-gray-600'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-300">
            {averageRating.toFixed(1)} ({ratingCount} {ratingCount === 1 ? 'rating' : 'ratings'})
          </span>
        </div>
      )}

      {/* User Rating Input */}
      {isAuthenticated && (
        <div>
          <p className="text-sm text-gray-400 mb-2">
            {userRating ? 'Your rating:' : 'Rate this story:'}
          </p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRate(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(null)}
                className="transition-transform hover:scale-110 focus:outline-none"
              >
                <Star
                  className={`h-6 w-6 cursor-pointer ${
                    star <= (hoverRating || userRating || 0)
                      ? 'fill-rose-500 text-rose-500'
                      : 'text-gray-600 hover:text-rose-400'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {!isAuthenticated && ratingCount === 0 && (
        <p className="text-sm text-gray-500">No ratings yet. Be the first to rate!</p>
      )}
    </div>
  )
}
