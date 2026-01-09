'use client'

import { useEffect } from 'react'

interface ReadingTrackerProps {
  storyId: string
  isAuthenticated: boolean
}

export function ReadingTracker({ storyId, isAuthenticated }: ReadingTrackerProps) {
  useEffect(() => {
    if (!isAuthenticated) return

    // Track that user opened the story
    const trackReading = async () => {
      try {
        await fetch('/api/reading-history', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ storyId, progress: 0 }),
        })
      } catch (error) {
        console.error('Failed to track reading:', error)
      }
    }

    trackReading()

    // Track scroll progress
    let scrollTimeout: NodeJS.Timeout
    const handleScroll = () => {
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(async () => {
        const windowHeight = window.innerHeight
        const documentHeight = document.documentElement.scrollHeight
        const scrollTop = window.scrollY
        const progress = Math.min(
          100,
          Math.round(((scrollTop + windowHeight) / documentHeight) * 100)
        )

        try {
          await fetch('/api/reading-history', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ storyId, progress }),
          })
        } catch (error) {
          console.error('Failed to update progress:', error)
        }
      }, 1000) // Debounce for 1 second
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(scrollTimeout)
    }
  }, [storyId, isAuthenticated])

  return null // This component doesn't render anything
}
