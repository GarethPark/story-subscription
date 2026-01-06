import { SignupForm } from '@/components/auth/signup-form'
import { Heart } from 'lucide-react'
import Link from 'next/link'

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black p-4">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-950/20 via-transparent to-purple-950/20" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo/Brand */}
        <Link href="/" className="flex items-center justify-center space-x-2 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-700 to-violet-600 flex items-center justify-center shadow-xl">
            <Heart className="h-6 w-6 text-white fill-white" />
          </div>
          <span className="font-bold text-3xl font-['Playfair_Display'] bg-gradient-to-r from-rose-500 to-violet-500 bg-clip-text text-transparent">
            Silk
          </span>
        </Link>

        <SignupForm />
      </div>
    </div>
  )
}
