import { getCurrentUser } from '@/lib/auth/session'
import { redirect } from 'next/navigation'
import { CustomStoryGenerationForm } from '@/components/generate/custom-story-form'
import { Sparkles, Coins } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Generate Story',
  description: 'Create your perfect personalized romance story with AI. Customize characters, choose tropes, and generate your dream romance in minutes.'
}

export default async function GeneratePage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login?redirect=/generate')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-12">
      <div className="container max-w-5xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mb-10">
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-950/30 backdrop-blur-sm rounded-full border border-rose-800/30 mb-4">
              <Sparkles className="h-4 w-4 text-rose-400" />
              <span className="text-sm text-rose-200 font-medium">AI Story Generation</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-3 font-['Playfair_Display'] bg-gradient-to-r from-rose-400 via-pink-300 to-violet-400 bg-clip-text text-transparent">
              Create Your Perfect Story
            </h1>
          </div>
          <p className="text-gray-300 text-lg text-center max-w-3xl mx-auto leading-relaxed">
            Personalize every detail - from character names to plot twists. Your story, your way.
          </p>
        </div>

        {/* Credits Display */}
        <div className="bg-gradient-to-r from-rose-900/30 to-violet-900/30 border border-rose-700/30 rounded-2xl p-6 mb-8 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-rose-600 to-violet-600 flex items-center justify-center shadow-lg">
                <Coins className="h-7 w-7 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">
                  Your Story Credits
                </h2>
                <p className="text-sm text-gray-400">
                  Each story generation uses 1 credit
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-black bg-gradient-to-r from-rose-400 to-violet-400 bg-clip-text text-transparent">
                {user.credits}
              </div>
              <div className="text-sm text-gray-400">remaining</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {user.credits === 0 ? (
          <div className="bg-gray-900/50 border border-rose-900/50 rounded-2xl p-10 text-center backdrop-blur-sm">
            <div className="w-20 h-20 rounded-full bg-rose-950/50 flex items-center justify-center mx-auto mb-6">
              <Coins className="h-10 w-10 text-rose-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 font-['Playfair_Display']">
              Out of Credits
            </h3>
            <p className="text-gray-300 mb-6 max-w-md mx-auto">
              Upgrade to Premium for 3 credits per month, or purchase additional credits to continue generating custom stories.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/#pricing"
                className="px-6 py-3 bg-gradient-to-r from-rose-700 to-violet-700 hover:from-rose-600 hover:to-violet-600 text-white rounded-lg font-bold shadow-lg transition-all"
              >
                View Pricing
              </Link>
              <Link
                href="/dashboard"
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium border border-gray-700 transition-all"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-gray-900/50 border border-rose-900/30 rounded-2xl p-8 md:p-10 mb-6 backdrop-blur-sm">
              <CustomStoryGenerationForm userCredits={user.credits} />
            </div>

            {/* How it Works */}
            <div className="bg-violet-950/30 border border-violet-700/30 rounded-xl p-6 backdrop-blur-sm">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-violet-400" />
                How It Works
              </h3>
              <ol className="text-sm text-gray-300 space-y-2.5">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-violet-600 text-white text-xs flex items-center justify-center font-bold">1</span>
                  <span>Choose your genre, heat level, and favorite romance tropes</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-violet-600 text-white text-xs flex items-center justify-center font-bold">2</span>
                  <span>Customize character names and add specific plot details (optional)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-violet-600 text-white text-xs flex items-center justify-center font-bold">3</span>
                  <span>Click generate and wait 1-2 minutes while AI crafts your unique story</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-violet-600 text-white text-xs flex items-center justify-center font-bold">4</span>
                  <span>Read, save, and enjoy your personalized romance story!</span>
                </li>
              </ol>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
