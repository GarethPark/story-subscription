import { SignupForm } from '@/components/auth/signup-form'
import { Heart, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black p-4 relative overflow-hidden">
      {/* Dramatic background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-950/20 via-transparent to-purple-950/20" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo/Brand */}
        <Link href="/" className="flex items-center justify-center space-x-3 mb-8 group">
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
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-950/30 backdrop-blur-sm rounded-full border border-rose-800/30 mb-4">
            <Sparkles className="h-4 w-4 text-rose-400" />
            <span className="text-sm text-rose-200 font-medium">Start Your Journey</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 font-['Playfair_Display']">
            Join Silk Today
          </h1>
          <p className="text-gray-400">
            Unlimited access to our curated collection of romance stories
          </p>
        </div>

        <SignupForm />

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-4">
            By signing up, you agree to our{' '}
            <Link href="/terms" className="text-rose-400 hover:text-rose-300 transition-colors">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-rose-400 hover:text-rose-300 transition-colors">
              Privacy Policy
            </Link>
          </p>

          {/* Social Proof */}
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-700 to-violet-700 border-2 border-gray-900 flex items-center justify-center text-white text-xs font-bold"
                >
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <span>Join thousands of romance readers</span>
          </div>
        </div>
      </div>
    </div>
  )
}
