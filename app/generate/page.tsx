import { getCurrentUser } from '@/lib/auth/session'
import { redirect } from 'next/navigation'
import { CustomStoryGenerationForm } from '@/components/generate/custom-story-form'

export default async function GeneratePage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login?redirect=/generate')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Create Your Story
          </h1>
          <p className="text-slate-600">
            Customize every detail of your perfect romance story
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="flex items-center justify-between mb-6 pb-6 border-b">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Your Story Credits
              </h2>
              <p className="text-sm text-slate-600">
                Each story generation uses 1 credit
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-rose-600">
                {user.credits}
              </div>
              <div className="text-sm text-slate-600">credits remaining</div>
            </div>
          </div>

          {user.credits === 0 ? (
            <div className="bg-rose-50 border border-rose-200 rounded-lg p-6 text-center">
              <p className="text-rose-900 font-medium mb-4">
                You're out of credits!
              </p>
              <p className="text-rose-700 text-sm mb-4">
                Upgrade to Premium for 3 credits per month, or purchase additional credits.
              </p>
              <div className="flex gap-4 justify-center">
                <a
                  href="/pricing"
                  className="px-6 py-2 bg-rose-600 text-white rounded-lg font-medium hover:bg-rose-700 transition-colors"
                >
                  View Pricing
                </a>
                <a
                  href="/dashboard"
                  className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-300 transition-colors"
                >
                  Back to Dashboard
                </a>
              </div>
            </div>
          ) : (
            <CustomStoryGenerationForm userCredits={user.credits} />
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">How it works:</h3>
          <ol className="text-sm text-blue-800 space-y-1">
            <li>1. Choose your genre, heat level, and favorite tropes</li>
            <li>2. Customize character names and add plot details (optional)</li>
            <li>3. Click generate and wait 1-2 minutes for your unique story</li>
            <li>4. Read, save, and share your personalized romance!</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
