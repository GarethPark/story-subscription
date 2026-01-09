'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Settings, X, Type, Palette, LineChart } from 'lucide-react'

export interface ReadingSettings {
  fontSize: 'small' | 'medium' | 'large' | 'extra-large'
  fontFamily: 'serif' | 'sans-serif'
  backgroundColor: 'light' | 'dark' | 'sepia'
  lineHeight: 'compact' | 'normal' | 'relaxed'
}

const DEFAULT_SETTINGS: ReadingSettings = {
  fontSize: 'medium',
  fontFamily: 'serif',
  backgroundColor: 'dark',
  lineHeight: 'normal',
}

interface ReadingSettingsProps {
  onSettingsChange: (settings: ReadingSettings) => void
}

export function ReadingSettingsPanel({ onSettingsChange }: ReadingSettingsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [settings, setSettings] = useState<ReadingSettings>(DEFAULT_SETTINGS)

  // Load settings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('readingSettings')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setSettings(parsed)
        onSettingsChange(parsed)
      } catch (e) {
        console.error('Failed to parse reading settings')
      }
    } else {
      onSettingsChange(DEFAULT_SETTINGS)
    }
  }, [onSettingsChange])

  const updateSetting = <K extends keyof ReadingSettings>(
    key: K,
    value: ReadingSettings[K]
  ) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    localStorage.setItem('readingSettings', JSON.stringify(newSettings))
    onSettingsChange(newSettings)
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="sm"
        className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg border-gray-700 bg-gray-800 hover:bg-gray-700 z-50"
      >
        <Settings className="h-5 w-5" />
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-6 right-6 w-80 bg-gray-900 border-gray-700 shadow-2xl z-50">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-white flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Reading Settings
          </h3>
          <Button
            onClick={() => setIsOpen(false)}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Font Size */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
            <Type className="h-4 w-4" />
            Font Size
          </label>
          <div className="grid grid-cols-4 gap-2">
            {(['small', 'medium', 'large', 'extra-large'] as const).map((size) => (
              <button
                key={size}
                onClick={() => updateSetting('fontSize', size)}
                className={`py-2 px-3 rounded-lg text-xs font-medium transition-colors ${
                  settings.fontSize === size
                    ? 'bg-rose-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {size === 'extra-large' ? 'XL' : size.charAt(0).toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Font Family */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-300 mb-2 block">
            Font Style
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(['serif', 'sans-serif'] as const).map((font) => (
              <button
                key={font}
                onClick={() => updateSetting('fontFamily', font)}
                className={`py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  settings.fontFamily === font
                    ? 'bg-rose-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
                style={{ fontFamily: font === 'serif' ? 'Georgia, serif' : 'Inter, sans-serif' }}
              >
                {font === 'serif' ? 'Serif' : 'Sans'}
              </button>
            ))}
          </div>
        </div>

        {/* Background Color */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Background
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['light', 'dark', 'sepia'] as const).map((bg) => (
              <button
                key={bg}
                onClick={() => updateSetting('backgroundColor', bg)}
                className={`py-2 px-3 rounded-lg text-xs font-medium transition-colors ${
                  settings.backgroundColor === bg
                    ? 'ring-2 ring-rose-600'
                    : 'hover:ring-2 hover:ring-gray-600'
                } ${
                  bg === 'light'
                    ? 'bg-white text-gray-900'
                    : bg === 'dark'
                    ? 'bg-gray-900 text-white'
                    : 'bg-[#f4ecd8] text-gray-900'
                }`}
              >
                {bg.charAt(0).toUpperCase() + bg.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Line Height */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            Line Spacing
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['compact', 'normal', 'relaxed'] as const).map((height) => (
              <button
                key={height}
                onClick={() => updateSetting('lineHeight', height)}
                className={`py-2 px-3 rounded-lg text-xs font-medium transition-colors ${
                  settings.lineHeight === height
                    ? 'bg-rose-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {height.charAt(0).toUpperCase() + height.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Reset Button */}
        <Button
          onClick={() => {
            setSettings(DEFAULT_SETTINGS)
            localStorage.setItem('readingSettings', JSON.stringify(DEFAULT_SETTINGS))
            onSettingsChange(DEFAULT_SETTINGS)
          }}
          variant="outline"
          size="sm"
          className="w-full border-gray-700 text-gray-300"
        >
          Reset to Defaults
        </Button>
      </div>
    </Card>
  )
}
