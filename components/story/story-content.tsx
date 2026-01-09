'use client'

import { useState } from 'react'
import { ReadingSettingsPanel, ReadingSettings } from './reading-settings'

interface StoryContentProps {
  content: string
}

export function StoryContent({ content }: StoryContentProps) {
  const [settings, setSettings] = useState<ReadingSettings>({
    fontSize: 'medium',
    fontFamily: 'serif',
    backgroundColor: 'dark',
    lineHeight: 'normal',
  })

  const fontSizeMap = {
    small: '16px',
    medium: '18px',
    large: '20px',
    'extra-large': '24px',
  }

  const fontFamilyMap = {
    serif: 'Georgia, "Times New Roman", serif',
    'sans-serif': 'Inter, var(--font-geist-sans), sans-serif',
  }

  const backgroundColorMap = {
    light: '#ffffff',
    dark: 'rgb(31 41 55 / 0.4)', // gray-900/40
    sepia: '#f4ecd8',
  }

  const textColorMap = {
    light: '#1f2937',
    dark: '#f3f4f6',
    sepia: '#1f2937',
  }

  const lineHeightMap = {
    compact: '1.5',
    normal: '1.75',
    relaxed: '2',
  }

  return (
    <>
      <div
        className="border border-gray-800/50 rounded-xl p-5 sm:p-8 md:p-10 backdrop-blur-sm transition-colors duration-300"
        style={{
          backgroundColor: backgroundColorMap[settings.backgroundColor],
        }}
      >
        <div
          className="whitespace-pre-wrap"
          style={{
            fontFamily: fontFamilyMap[settings.fontFamily],
            fontSize: fontSizeMap[settings.fontSize],
            lineHeight: lineHeightMap[settings.lineHeight],
            letterSpacing: '0.01em',
            color: textColorMap[settings.backgroundColor],
          }}
        >
          {content}
        </div>
      </div>

      <ReadingSettingsPanel onSettingsChange={setSettings} />
    </>
  )
}
