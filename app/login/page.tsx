import { LoginForm } from '@/components/auth/login-form'
import { Heart, BookOpen } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your Silk account to access your favorite romance stories and continue your reading journey.'
}

export default function LoginPage() {
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
              Welcome back to{' '}
              <span className="bg-gradient-to-r from-rose-400 to-violet-400 bg-clip-text text-transparent">
                your stories
              </span>
            </h2>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              Continue your journey through worlds of passion, romance, and unforgettable characters.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-900/50 border border-rose-900/30 rounded-xl p-6 backdrop-blur-sm">
                <BookOpen className="h-8 w-8 text-rose-400 mb-3" />
                <div className="text-2xl font-bold text-white mb-1">1000+</div>
                <div className="text-sm text-gray-400">Stories Available</div>
              </div>
              <div className="bg-gray-900/50 border border-violet-900/30 rounded-xl p-6 backdrop-blur-sm">
                <Heart className="h-8 w-8 text-violet-400 mb-3 fill-violet-400" />
                <div className="text-2xl font-bold text-white mb-1">50K+</div>
                <div className="text-sm text-gray-400">Happy Readers</div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
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

            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  )
}
