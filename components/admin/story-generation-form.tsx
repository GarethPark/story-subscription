'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Loader2, Sparkles } from 'lucide-react'

const GENRES = ['Romantasy', 'Contemporary', 'Small Town', 'Sports Romance', 'Historical', 'Dark Romance', 'Romantic Suspense'] as const
const HEAT_LEVELS = ['Sweet', 'Warm', 'Hot', 'Scorching'] as const

const TROPES_BY_GENRE = {
  Romantasy: ['fated mates', 'enemies to lovers', 'morally gray hero', 'chosen one', 'dragon shifter', 'vampire romance', 'rival courts', 'magic bond', 'forbidden supernatural love', 'royal romance'],
  Contemporary: ['enemies to lovers', 'second chance', 'fake relationship', 'friends to lovers', 'grumpy sunshine', 'office romance', 'forced proximity', 'one bed', 'billionaire', 'secret baby'],
  'Small Town': ['return to hometown', 'grumpy sunshine', 'second chance', 'small business romance', 'city person moves to town', 'friends to lovers', 'enemies to lovers', 'fake dating', 'single parent'],
  'Sports Romance': ['hockey romance', 'football romance', 'basketball romance', 'baseball romance', 'MMA fighter', 'rival teams', 'athlete & trainer', 'athlete & journalist', 'grumpy athlete'],
  Historical: ['arranged marriage', 'marriage of convenience', 'forbidden love', 'regency romance', 'victorian romance', 'highland romance', 'secret identity', 'redemption', 'enemies to lovers'],
  'Dark Romance': ['mafia romance', 'morally gray hero', 'forbidden love', 'enemies to lovers', 'captive', 'antihero', 'revenge', 'possessive love', 'forced proximity'],
  'Romantic Suspense': ['bodyguard', 'detective romance', 'witness protection', 'undercover', 'protector romance', 'spy romance', 'FBI agent', 'enemies to lovers', 'forced proximity'],
}

export function StoryGenerationForm() {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState('')
  const [genre, setGenre] = useState<typeof GENRES[number]>('Romantasy')
  const [heatLevel, setHeatLevel] = useState<typeof HEAT_LEVELS[number]>('Hot')
  const [selectedTropes, setSelectedTropes] = useState<string[]>([])
  const [wordCount, setWordCount] = useState(8000) // Maximum length for curated stories
  const [generateCover] = useState(false) // Skip AI cover generation - will add custom images later

  const availableTropes = TROPES_BY_GENRE[genre]

  const toggleTrope = (trope: string) => {
    setSelectedTropes(prev =>
      prev.includes(trope)
        ? prev.filter(t => t !== trope)
        : [...prev, trope]
    )
  }

  const checkStatus = async (storyId: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/admin/stories/${storyId}/status`)
      const data = await response.json()

      if (data.generationStatus === 'COMPLETED') {
        setProgress('Story generated successfully!')
        return true
      } else if (data.generationStatus === 'FAILED') {
        throw new Error(data.generationError || 'Generation failed')
      } else if (data.generationStatus === 'GENERATING') {
        setProgress('Generating story... This takes 1-2 minutes for longer stories.')
      } else {
        setProgress('Starting generation...')
      }

      return false
    } catch (error) {
      throw error
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (selectedTropes.length === 0) {
      alert('Please select at least one trope')
      return
    }

    setIsGenerating(true)
    setProgress('Starting story generation...')

    try {
      // Start generation
      const response = await fetch('/api/admin/generate-story', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          genre,
          heatLevel,
          tropes: selectedTropes,
          wordCount,
          generateCover,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to generate story')
      }

      const data = await response.json()
      const storyId = data.storyId

      setProgress('Generation started! Waiting for completion...')

      // Poll for status every 3 seconds
      const pollInterval = setInterval(async () => {
        try {
          const isComplete = await checkStatus(storyId)
          if (isComplete) {
            clearInterval(pollInterval)
            // Wait a moment before redirect to show success message
            setTimeout(() => {
              router.push(`/admin/review/${storyId}`)
            }, 1000)
          }
        } catch (error) {
          clearInterval(pollInterval)
          console.error('Status check error:', error)
          alert(error instanceof Error ? error.message : 'Generation failed')
          setIsGenerating(false)
          setProgress('')
        }
      }, 3000)

      // Safety timeout after 3 minutes
      setTimeout(() => {
        clearInterval(pollInterval)
        setProgress('Generation is taking longer than expected. Check the admin panel for the story status.')
        setIsGenerating(false)
      }, 180000)

    } catch (error) {
      console.error('Generation error:', error)
      alert(error instanceof Error ? error.message : 'Failed to start generation')
      setIsGenerating(false)
      setProgress('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Story Configuration</h2>

        {/* Genre Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Genre</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {GENRES.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => {
                  setGenre(g)
                  setSelectedTropes([]) // Reset tropes when genre changes
                }}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  genre === g
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Heat Level Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Heat Level</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {HEAT_LEVELS.map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => setHeatLevel(h)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  heatLevel === h
                    ? 'bg-rose-500 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {h}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {heatLevel === 'Sweet' && 'Emotional connection, innocent touches, fade to black'}
            {heatLevel === 'Warm' && 'Sensual tension, passionate kissing, tasteful romance'}
            {heatLevel === 'Hot' && 'Explicit romantic scenes, detailed intimacy'}
            {heatLevel === 'Scorching' && 'Very explicit, detailed intimate scenes'}
          </p>
        </div>

        {/* Tropes Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Tropes (Select 1-3)
          </label>
          <div className="grid grid-cols-2 gap-2">
            {availableTropes.map((trope) => (
              <button
                key={trope}
                type="button"
                onClick={() => toggleTrope(trope)}
                className={`px-3 py-2 rounded-md text-sm transition-colors text-left ${
                  selectedTropes.includes(trope)
                    ? 'bg-purple-100 text-purple-900 border-2 border-purple-500'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-2 border-transparent'
                }`}
              >
                {trope}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Selected: {selectedTropes.length > 0 ? selectedTropes.join(', ') : 'None'}
          </p>
        </div>

        {/* Word Count */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Target Word Count: {wordCount.toLocaleString()}
          </label>
          <input
            type="range"
            min="2000"
            max="8000"
            step="500"
            value={wordCount}
            onChange={(e) => setWordCount(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>2,000</span>
            <span>8,000</span>
          </div>
        </div>

        {/* Note about covers */}
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-slate-700">
            <strong>Note:</strong> Cover images will be added manually after generation using your custom genre/trope image library.
          </p>
        </div>
      </div>

      {/* Progress Display */}
      {isGenerating && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
            <div>
              <p className="text-sm font-medium text-blue-900">{progress}</p>
              <p className="text-xs text-blue-600 mt-1">
                {wordCount > 4000
                  ? 'Longer stories take 1-2 minutes. You can close this tab and check back later!'
                  : 'This will take 30-90 seconds. Feel free to wait or check back soon!'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={isGenerating || selectedTropes.length === 0}
          className="flex-1"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating Story...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Story
            </>
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isGenerating}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
