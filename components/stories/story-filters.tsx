'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Search, X, SlidersHorizontal, ChevronDown } from 'lucide-react'

const GENRES = ['Contemporary', 'Dark Romance', 'Romantasy']
const HEAT_LEVELS = ['Sweet', 'Warm', 'Spicy', 'Steamy', 'Extra Spicy']
const STORY_LENGTHS = [
  { label: 'Quick Read (< 3k words)', value: 'short' },
  { label: 'Medium (3k-5k words)', value: 'medium' },
  { label: 'Long (> 5k words)', value: 'long' },
]
const SORT_OPTIONS = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Most Viewed', value: 'views' },
  { label: 'Most Favorited', value: 'favorites' },
  { label: 'Highest Rated', value: 'rating' },
]

interface StoryFiltersProps {
  totalCount: number
}

export function StoryFilters({ totalCount }: StoryFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [showFilters, setShowFilters] = useState(false)

  const currentGenre = searchParams.get('genre')
  const currentHeatLevel = searchParams.get('heatLevel')
  const currentLength = searchParams.get('length')
  const currentSort = searchParams.get('sort') || 'newest'

  const updateFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })

    router.push(`/stories?${params.toString()}`)
  }

  const clearAllFilters = () => {
    setSearchQuery('')
    router.push('/stories')
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilters({ search: searchQuery || null })
  }

  const hasActiveFilters = currentGenre || currentHeatLevel || currentLength || searchQuery

  return (
    <div className="mb-6">
      {/* Search Bar */}
      <div className="flex gap-3 mb-4">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, author, or description..."
            className="w-full pl-10 pr-3 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-600 focus:border-transparent text-white placeholder:text-gray-500"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('')
                updateFilters({ search: null })
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <X className="h-4 w-4 text-gray-500 hover:text-white" />
            </button>
          )}
        </form>
        <Button
          onClick={() => setShowFilters(!showFilters)}
          variant="outline"
          className="border-gray-700 bg-gray-800/50 hover:bg-gray-700/50"
        >
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filters
          {hasActiveFilters && (
            <span className="ml-2 h-5 w-5 rounded-full bg-rose-600 text-white text-xs flex items-center justify-center">
              {[currentGenre, currentHeatLevel, currentLength, searchQuery].filter(Boolean).length}
            </span>
          )}
        </Button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <Card className="bg-gray-900/50 border-gray-700 p-4 mb-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Genre Filter */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Genre</label>
              <select
                value={currentGenre || ''}
                onChange={(e) => updateFilters({ genre: e.target.value || null })}
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-rose-600"
              >
                <option value="">All Genres</option>
                {GENRES.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>

            {/* Heat Level Filter */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Heat Level</label>
              <select
                value={currentHeatLevel || ''}
                onChange={(e) => updateFilters({ heatLevel: e.target.value || null })}
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-rose-600"
              >
                <option value="">All Levels</option>
                {HEAT_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

            {/* Length Filter */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Story Length</label>
              <select
                value={currentLength || ''}
                onChange={(e) => updateFilters({ length: e.target.value || null })}
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-rose-600"
              >
                <option value="">All Lengths</option>
                {STORY_LENGTHS.map((length) => (
                  <option key={length.value} value={length.value}>
                    {length.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Options */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Sort By</label>
              <select
                value={currentSort}
                onChange={(e) => updateFilters({ sort: e.target.value })}
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-rose-600"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="mt-4 flex justify-end">
              <Button
                onClick={clearAllFilters}
                variant="outline"
                size="sm"
                className="border-gray-700 text-gray-300"
              >
                <X className="h-4 w-4 mr-2" />
                Clear All Filters
              </Button>
            </div>
          )}
        </Card>
      )}

      {/* Results Count */}
      <div className="flex items-center justify-between text-sm text-gray-400">
        <span>
          <span className="text-rose-400 font-semibold">{totalCount}</span>{' '}
          {totalCount === 1 ? 'story' : 'stories'} found
        </span>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-rose-400 hover:text-rose-300 transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  )
}
