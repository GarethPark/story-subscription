'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { CheckCircle, Trash2, Loader2, Sparkles } from 'lucide-react'

interface StoryReviewActionsProps {
  storyId: string
  isPublished: boolean
  title: string
}

export function StoryReviewActions({ storyId, isPublished, title }: StoryReviewActionsProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handlePublish = async () => {
    if (!confirm(`Publish "${title}" and make it visible to all users?`)) {
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/stories/${storyId}/publish`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to publish story')
      }

      router.push('/admin?published=true')
      router.refresh()
    } catch (error) {
      console.error('Publish error:', error)
      alert('Failed to publish story')
      setIsLoading(false)
    }
  }

  const handleUnpublish = async () => {
    if (!confirm(`Unpublish "${title}" and make it a draft again?`)) {
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/stories/${storyId}/unpublish`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to unpublish story')
      }

      router.refresh()
    } catch (error) {
      console.error('Unpublish error:', error)
      alert('Failed to unpublish story')
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm(`Delete "${title}" permanently? This action cannot be undone.`)) {
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/stories/${storyId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete story')
      }

      router.push('/admin?deleted=true')
      router.refresh()
    } catch (error) {
      console.error('Delete error:', error)
      alert('Failed to delete story')
      setIsLoading(false)
    }
  }

  const handleRegenerate = () => {
    if (confirm('Generate a new story? The current draft will remain unchanged.')) {
      router.push('/admin/generate')
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {!isPublished ? (
          <Button
            onClick={handlePublish}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Publish Story
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={handleUnpublish}
            disabled={isLoading}
            variant="outline"
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Unpublishing...
              </>
            ) : (
              <>
                Unpublish Story
              </>
            )}
          </Button>
        )}

        <Button
          onClick={handleRegenerate}
          disabled={isLoading}
          variant="outline"
          className="w-full"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Generate New Story
        </Button>
      </div>

      <Button
        onClick={handleDelete}
        disabled={isLoading}
        variant="destructive"
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Deleting...
          </>
        ) : (
          <>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Story
          </>
        )}
      </Button>

      <div className="text-xs text-slate-500 space-y-1">
        <p>• Published stories are visible to all users in the story library</p>
        <p>• Draft stories are only visible to admins for review</p>
        <p>• Deleted stories cannot be recovered</p>
      </div>
    </div>
  )
}
