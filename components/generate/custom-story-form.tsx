'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Loader2, Sparkles, User, Heart } from 'lucide-react'

const GENRES = ['Contemporary', 'Historical', 'Paranormal', 'Fantasy', 'Suspense'] as const
const HEAT_LEVELS = ['Sweet', 'Warm', 'Hot', 'Scorching'] as const

const TROPES_BY_GENRE = {
  Contemporary: ['enemies to lovers', 'second chance', 'fake relationship', 'boss/employee', 'friends to lovers', 'forced proximity'],
  Historical: ['arranged marriage', 'forbidden love', 'secret identity', 'class difference', 'marriage of convenience', 'redemption'],
  Paranormal: ['fated mates', 'vampire romance', 'shifter romance', 'witch/warlock', 'forbidden supernatural love', 'chosen one'],
  Fantasy: ['destined lovers', 'magic bond', 'rival kingdoms', 'quest romance', 'dragon shifter', 'royal romance'],
  Suspense: ['protector romance', 'witness protection', 'undercover', 'romantic suspense', 'bodyguard', 'detective romance'],
}

interface CustomStoryGenerationFormProps {
  userCredits: number
}

export function CustomStoryGenerationForm({ userCredits }: CustomStoryGenerationFormProps) {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState('')
  const [genre, setGenre] = useState<typeof GENRES[number]>('Contemporary')
  const [heatLevel, setHeatLevel] = useState<typeof HEAT_LEVELS[number]>('Warm')
  const [selectedTropes, setSelectedTropes] = useState<string[]>([])
  const [wordCount, setWordCount] = useState(3500)
  const [generateCover, setGenerateCover] = useState(true)

  // Custom story fields
  const [protagonistName, setProtagonistName] = useState('')
  const [loveInterestName, setLoveInterestName] = useState('')
  const [customScenario, setCustomScenario] = useState('')

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
      const response = await fetch(`/api/stories/${storyId}/status`)
      const data = await response.json()

      if (data.generationStatus === 'COMPLETED') {
        setProgress('Story generated successfully!')
        return true
      } else if (data.generationStatus === 'FAILED') {
        throw new Error(data.generationError || 'Generation failed')
      } else if (data.generationStatus === 'GENERATING') {
        setProgress('Generating your story... This takes 1-2 minutes.')
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

    if (userCredits < 1) {
      alert('You do not have enough credits. Please purchase more credits or upgrade to Premium.')
      return
    }

    setIsGenerating(true)
    setProgress('Starting story generation...')

    try {
      // Start generation
      const response = await fetch('/api/generate-story', {
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
          // Custom fields
          protagonistName: protagonistName.trim() || undefined,
          loveInterestName: loveInterestName.trim() || undefined,
          customScenario: customScenario.trim() || undefined,
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
              router.push(`/stories/${storyId}`)
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
        setProgress('Generation is taking longer than expected. Check "My Stories" for the story status.')
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

        {/* Character Names - NEW */}
        <div className="mb-6 bg-rose-50 border border-rose-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-rose-900 mb-3 flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Customize Character Names (Optional)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
                <User className="h-3 w-3" />
                Protagonist Name
              </label>
              <input
                type="text"
                value={protagonistName}
                onChange={(e) => setProtagonistName(e.target.value)}
                placeholder="e.g., Zara, Marcus, Elara"
                className="w-full px-3 py-2 border border-rose-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
                <Heart className="h-3 w-3" />
                Love Interest Name
              </label>
              <input
                type="text"
                value={loveInterestName}
                onChange={(e) => setLoveInterestName(e.target.value)}
                placeholder="e.g., Phoenix, Isabella, Kai"
                className="w-full px-3 py-2 border border-rose-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>
          <p className="text-xs text-slate-600 mt-2">
            Leave blank for AI-generated names
          </p>
        </div>

        {/* Custom Scenario - NEW */}
        <div className="mb-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-purple-900 mb-2">
            Plot Details (Optional)
          </h3>
          <textarea
            value={customScenario}
            onChange={(e) => setCustomScenario(e.target.value)}
            placeholder="Describe any specific plot points, settings, or scenarios you'd like in your story... e.g., 'Set in a cozy bookstore in Seattle during Christmas' or 'They meet during a blackout in New York City'"
            className="w-full px-3 py-2 border border-purple-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows={3}
            maxLength={500}
          />
          <p className="text-xs text-slate-600 mt-1">
            {customScenario.length}/500 characters
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
            <span>2,000 (quick read)</span>
            <span>8,000 (full story)</span>
          </div>
        </div>

        {/* Cover Image Option */}
        <div className="mb-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={generateCover}
              onChange={(e) => setGenerateCover(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm font-medium">
              Generate AI cover image with DALL-E
            </span>
          </label>
          <p className="text-xs text-slate-500 mt-1 ml-6">
            Uncheck to use a gradient fallback
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
                  ? 'Longer stories take 1-2 minutes. You can close this tab and check "My Stories" later!'
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
          disabled={isGenerating || selectedTropes.length === 0 || userCredits < 1}
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
              Generate My Story (1 credit)
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
