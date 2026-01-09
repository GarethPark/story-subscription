'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { BookPlus, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ContinueStoryButtonProps {
  storyId: string
  isAuthenticated: boolean
}

export function ContinueStoryButton({ storyId, isAuthenticated }: ContinueStoryButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const router = useRouter()

  const handleContinue = async () => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    setIsGenerating(true)

    try {
      const response = await fetch(`/api/stories/${storyId}/extend`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to generate extension')
      }

      const data = await response.json()

      // Redirect to the new extension
      router.push(`/stories/${data.extension.id}`)
      router.refresh()
    } catch (error) {
      console.error('Extension generation error:', error)
      alert('Failed to generate story continuation. Please try again.')
      setIsGenerating(false)
    }
  }

  return (
    <Button
      onClick={handleContinue}
      disabled={isGenerating}
      className="bg-gradient-to-r from-violet-700 to-fuchsia-700 hover:from-violet-600 hover:to-fuchsia-600 shadow-lg"
    >
      {isGenerating ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Generating Chapter...
        </>
      ) : (
        <>
          <BookPlus className="mr-2 h-5 w-5" />
          Continue Story
        </>
      )}
    </Button>
  )
}
