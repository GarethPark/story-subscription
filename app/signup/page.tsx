import { SignupForm } from '@/components/auth/signup-form'
import { Heart, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Dramatic background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-950/20 via-transparent to-purple-950/20" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-6xl grid md:grid-cols-2 gap-12 items-center">
          {/* Left Side - Branding */}
          <div className="hidden md:block">
            <Link href="/" className="inline-flex items-center space-x-3 mb-8 group">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-700 to-violet-600 flex items-center justify-center shadow-2xl shadow-rose-900/50 group-hover:scale-110 transition-transform">
                <Heart className="h-8 w-8 text-white fill-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-5xl font-['Playfair_Display'] bg-gradient-to-r from-rose-400 to-violet-400 bg-clip-text text-transparent">
                  Silk
                </span>
                <span className="text-sm text-gray-400 tracking-widest uppercase">Irresistible Romance</span>
              </div>
            </Link>

            <h2 className="text-4xl font-black text-white mb-4 font-['Playfair_Display'] leading-tight">
              Your next favorite <br/>
              <span className="bg-gradient-to-r from-rose-400 to-violet-400 bg-clip-text text-transparent">
                love story
              </span>{' '}
              awaits
            </h2>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              Join thousands of romance readers discovering personalized stories crafted by AI,
              from sweet kisses to scorching passion.
            </p>

            {/* Features List */}
            <div className="space-y-4">
              {[
                'Unlimited access to curated story library',
                'All genres and heat levels included',
                'New stories added weekly',
                'Save favorites and track your reading'
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-rose-600 to-violet-600 flex items-center justify-center">
                    <Heart className="h-3 w-3 text-white fill-white" />
                  </div>
                  <span className="text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Signup Form */}
          <div className="w-full">
            {/* Mobile Logo */}
            <Link href="/" className="flex md:hidden items-center justify-center space-x-3 mb-8 group">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-700 to-violet-600 flex items-center justify-center shadow-2xl shadow-rose-900/50 group-hover:scale-110 transition-transform">
                <Heart className="h-7 w-7 text-white fill-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-4xl font-['Playfair_Display'] bg-gradient-to-r from-rose-400 to-violet-400 bg-clip-text text-transparent">
                  Silk
                </span>
                <span className="text-xs text-gray-400 -mt-1 tracking-widest uppercase">Irresistible Romance</span>
              </div>
            </Link>

            {/* Welcome Message */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-950/30 backdrop-blur-sm rounded-full border border-rose-800/30 mb-4">
                <Sparkles className="h-4 w-4 text-rose-400" />
                <span className="text-sm text-rose-200 font-medium">Start Your Journey</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white mb-3 font-['Playfair_Display']">
                Join Silk Today
              </h1>
              <p className="text-gray-400 text-lg">
                Create your free account in seconds
              </p>
            </div>

            <SignupForm />

            {/* Additional Info */}
            <div className="mt-8">
              <p className="text-sm text-gray-500 mb-6 text-center">
                By signing up, you agree to our{' '}
                <Link href="/terms" className="text-rose-400 hover:text-rose-300 transition-colors underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-rose-400 hover:text-rose-300 transition-colors underline">
                  Privacy Policy
                </Link>
              </p>

              {/* Social Proof */}
              <div className="flex items-center justify-center gap-3 text-sm text-gray-400 border-t border-gray-800 pt-6">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-700 to-violet-700 border-2 border-gray-900 flex items-center justify-center text-white text-xs font-bold"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <span className="font-medium">Join thousands of romance readers</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
