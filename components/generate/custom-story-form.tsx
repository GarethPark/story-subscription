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
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-6 font-['Playfair_Display']">Story Configuration</h2>

        {/* Genre Selection */}
        <div className="mb-8">
          <label className="block text-sm font-semibold mb-3 text-gray-300 uppercase tracking-wider">Genre</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {GENRES.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => {
                  setGenre(g)
                  setSelectedTropes([]) // Reset tropes when genre changes
                }}
                className={`px-4 py-3 rounded-lg text-sm font-bold transition-all ${
                  genre === g
                    ? 'bg-gradient-to-r from-rose-700 to-violet-700 text-white shadow-lg scale-105'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white border border-gray-700'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Heat Level Selection */}
        <div className="mb-8">
          <label className="block text-sm font-semibold mb-3 text-gray-300 uppercase tracking-wider">Heat Level</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {HEAT_LEVELS.map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => setHeatLevel(h)}
                className={`px-4 py-3 rounded-lg text-sm font-bold transition-all ${
                  heatLevel === h
                    ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-lg scale-105'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white border border-gray-700'
                }`}
              >
                {h}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3 italic">
            {heatLevel === 'Sweet' && '❤️ Emotional connection, innocent touches, fade to black'}
            {heatLevel === 'Warm' && '💕 Sensual tension, passionate kissing, tasteful romance'}
            {heatLevel === 'Hot' && '🔥 Explicit romantic scenes, detailed intimacy'}
            {heatLevel === 'Scorching' && '🌶️ Very explicit, detailed intimate scenes'}
          </p>
        </div>

        {/* Tropes Selection */}
        <div className="mb-8">
          <label className="block text-sm font-semibold mb-3 text-gray-300 uppercase tracking-wider">
            Tropes (Select 1-3)
          </label>
          <div className="grid grid-cols-2 gap-3">
            {availableTropes.map((trope) => (
              <button
                key={trope}
                type="button"
                onClick={() => toggleTrope(trope)}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all text-left ${
                  selectedTropes.includes(trope)
                    ? 'bg-gradient-to-r from-violet-700 to-purple-700 text-white shadow-lg border-2 border-violet-400 scale-105'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white border border-gray-700'
                }`}
              >
                {trope}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3">
            {selectedTropes.length > 0 ? (
              <span>✨ Selected: <span className="text-violet-400 font-semibold">{selectedTropes.join(', ')}</span></span>
            ) : (
              <span>Please select at least one trope</span>
            )}
          </p>
        </div>

        {/* Character Names - NEW */}
        <div className="mb-8 bg-rose-950/30 border border-rose-700/40 rounded-xl p-6 backdrop-blur-sm">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <Heart className="h-5 w-5 text-rose-400" />
            Customize Character Names (Optional)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <User className="h-4 w-4 text-rose-400" />
                Protagonist Name
              </label>
              <input
                type="text"
                value={protagonistName}
                onChange={(e) => setProtagonistName(e.target.value)}
                placeholder="e.g., Zara, Marcus, Elara"
                className="w-full px-4 py-3 border border-gray-700 bg-gray-800/50 rounded-lg text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Heart className="h-4 w-4 text-rose-400" />
                Love Interest Name
              </label>
              <input
                type="text"
                value={loveInterestName}
                onChange={(e) => setLoveInterestName(e.target.value)}
                placeholder="e.g., Phoenix, Isabella, Kai"
                className="w-full px-4 py-3 border border-gray-700 bg-gray-800/50 rounded-lg text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:border-transparent"
              />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3 italic">
            💡 Leave blank for AI-generated names
          </p>
        </div>

        {/* Custom Scenario - NEW */}
        <div className="mb-8 bg-violet-950/30 border border-violet-700/40 rounded-xl p-6 backdrop-blur-sm">
          <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-violet-400" />
            Plot Details (Optional)
          </h3>
          <textarea
            value={customScenario}
            onChange={(e) => setCustomScenario(e.target.value)}
            placeholder="Describe any specific plot points, settings, or scenarios you'd like in your story... e.g., 'Set in a cozy bookstore in Seattle during Christmas' or 'They meet during a blackout in New York City'"
            className="w-full px-4 py-3 border border-gray-700 bg-gray-800/50 rounded-lg text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent"
            rows={4}
            maxLength={500}
          />
          <p className="text-xs text-gray-400 mt-2">
            {customScenario.length}/500 characters
          </p>
        </div>

        {/* Word Count */}
        <div className="mb-8">
          <label className="block text-sm font-semibold mb-3 text-gray-300 uppercase tracking-wider">
            Target Word Count: <span className="text-rose-400">{wordCount.toLocaleString()}</span>
          </label>
          <input
            type="range"
            min="2000"
            max="8000"
            step="500"
            value={wordCount}
            onChange={(e) => setWordCount(Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-rose-600"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>📖 2,000 (quick read)</span>
            <span>📚 8,000 (full story)</span>
          </div>
        </div>

        {/* Cover Image Option */}
        <div className="mb-8">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={generateCover}
              onChange={(e) => setGenerateCover(e.target.checked)}
              className="w-5 h-5 rounded bg-gray-800 border-gray-700 text-rose-600 focus:ring-rose-600 focus:ring-offset-gray-900"
            />
            <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
              Generate AI cover image with DALL-E 3
            </span>
          </label>
          <p className="text-xs text-gray-500 mt-2 ml-8 italic">
            {generateCover ? '🎨 AI will create a unique cover for your story' : 'Using gradient fallback'}
          </p>
        </div>
      </div>

      {/* Progress Display */}
      {isGenerating && (
        <div className="bg-gradient-to-r from-violet-950/50 to-blue-950/50 border border-violet-600/40 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <Loader2 className="h-8 w-8 text-violet-400 animate-spin flex-shrink-0" />
            <div>
              <p className="text-base font-bold text-white mb-1">{progress}</p>
              <p className="text-xs text-gray-400">
                {wordCount > 4000
                  ? '⏱️ Longer stories take 1-2 minutes. You can close this tab and check "My Stories" later!'
                  : '⚡ This will take 30-90 seconds. Feel free to wait or check back soon!'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex gap-4 pt-4">
        <Button
          type="submit"
          disabled={isGenerating || selectedTropes.length === 0 || userCredits < 1}
          className="flex-1 h-14 text-base font-bold bg-gradient-to-r from-rose-700 to-violet-700 hover:from-rose-600 hover:to-violet-600 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Generating Your Story...
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5 mr-2" />
              Generate My Story (1 credit)
            </>
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isGenerating}
          className="h-14 px-6 bg-gray-800 hover:bg-gray-700 text-white border-gray-700 disabled:opacity-50"
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
