'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Lock, Loader2, CheckCircle, XCircle } from 'lucide-react'
import { Heart } from 'lucide-react'
import Link from 'next/link'

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong')
      }

      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <Card className="w-full border-rose-900/50 bg-gray-900/90 backdrop-blur-xl shadow-2xl shadow-rose-900/20">
        <CardContent className="pt-8 pb-8 text-center">
          <div className="w-16 h-16 rounded-full bg-red-900/50 border border-red-700 flex items-center justify-center mx-auto mb-6">
            <XCircle className="h-8 w-8 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-3 font-['Playfair_Display']">
            Invalid Reset Link
          </h1>
          <p className="text-gray-400 mb-6">
            This password reset link is invalid or has expired.
          </p>
          <Link href="/forgot-password">
            <Button className="bg-gradient-to-r from-rose-700 to-violet-700 hover:from-rose-600 hover:to-violet-600">
              Request New Link
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full border-rose-900/50 bg-gray-900/90 backdrop-blur-xl shadow-2xl shadow-rose-900/20">
      <CardContent className="pt-8 pb-8">
        {success ? (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-green-900/50 border border-green-700 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-3 font-['Playfair_Display']">
              Password Reset!
            </h1>
            <p className="text-gray-400 mb-6">
              Your password has been successfully reset. You can now sign in with your new password.
            </p>
            <Link href="/login">
              <Button className="bg-gradient-to-r from-rose-700 to-violet-700 hover:from-rose-600 hover:to-violet-600">
                Sign In
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-black text-white mb-2 font-['Playfair_Display']">
                Reset Password
              </h1>
              <p className="text-gray-400">
                Enter your new password below.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-200 flex items-center gap-2">
                  <Lock className="h-4 w-4 text-gray-400" />
                  New Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter new password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-rose-600 h-12 text-base"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-200 flex items-center gap-2">
                  <Lock className="h-4 w-4 text-gray-400" />
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-rose-600 h-12 text-base"
                />
              </div>

              <p className="text-xs text-gray-500">
                Password must be at least 8 characters long.
              </p>

              {error && (
                <div className="text-sm text-red-200 bg-red-950/50 border border-red-900/50 p-4 rounded-xl">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 text-base font-bold bg-gradient-to-r from-rose-700 to-violet-700 hover:from-rose-600 hover:to-violet-600 shadow-lg shadow-rose-900/30 hover:shadow-rose-900/50 transition-all"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  'Reset Password'
                )}
              </Button>
            </form>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-950/20 via-transparent to-purple-950/20" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
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

          <Suspense fallback={
            <Card className="w-full border-rose-900/50 bg-gray-900/90 backdrop-blur-xl shadow-2xl shadow-rose-900/20">
              <CardContent className="pt-8 pb-8 text-center">
                <Loader2 className="h-8 w-8 animate-spin text-rose-400 mx-auto" />
              </CardContent>
            </Card>
          }>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
