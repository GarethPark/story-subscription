'use client'

import { useState, useTransition } from 'react'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface FavoriteButtonProps {
  storyId: string
  initialIsFavorited: boolean
  isAuthenticated: boolean
}

export function FavoriteButton({
  storyId,
  initialIsFavorited,
  isAuthenticated,
}: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/stories/' + storyId)
      return
    }

    startTransition(async () => {
      try {
        if (isFavorited) {
          // Remove from favorites
          const response = await fetch(`/api/favorites?storyId=${storyId}`, {
            method: 'DELETE',
          })

          if (!response.ok) {
            throw new Error('Failed to remove favorite')
          }

          setIsFavorited(false)
        } else {
          // Add to favorites
          const response = await fetch('/api/favorites', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ storyId }),
          })

          if (!response.ok) {
            const data = await response.json()
            throw new Error(data.error || 'Failed to add favorite')
          }

          setIsFavorited(true)
        }

        router.refresh()
      } catch (error) {
        console.error('Favorite toggle error:', error)
        // Revert optimistic update
        setIsFavorited(!isFavorited)
        alert(error instanceof Error ? error.message : 'Something went wrong')
      }
    })
  }

  return (
    <Button
      variant={isFavorited ? 'default' : 'outline'}
      size="sm"
      onClick={handleToggleFavorite}
      disabled={isPending}
    >
      <Heart
        className={`h-4 w-4 mr-2 ${isFavorited ? 'fill-current' : ''}`}
      />
      {isFavorited ? 'Saved' : 'Save to Favorites'}
    </Button>
  )
}
