'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Mail, Lock, Loader2, LogIn } from 'lucide-react'

export function LoginForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Login failed')
      }

      // Redirect to dashboard
      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full border-rose-900/50 bg-gray-900/90 backdrop-blur-xl shadow-2xl shadow-rose-900/20">
      <CardContent className="pt-8 pb-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2 font-['Playfair_Display']">
            Welcome Back
          </h1>
          <p className="text-gray-400 text-lg">
            Sign in to continue your story
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-200 flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-400" />
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-rose-600 h-12 text-base"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium text-gray-200 flex items-center gap-2">
                <Lock className="h-4 w-4 text-gray-400" />
                Password
              </label>
              <a href="/forgot-password" className="text-sm text-rose-400 hover:text-rose-300 transition-colors">
                Forgot password?
              </a>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-rose-600 h-12 text-base"
            />
          </div>

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
                Signing in...
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-5 w-5" />
                Sign In
              </>
            )}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-400">
            Don&apos;t have an account?{' '}
            <a href="/signup" className="text-rose-400 hover:text-rose-300 font-medium transition-colors underline">
              Sign up for free
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
