'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, Lock, User, Loader2 } from 'lucide-react'

export function SignupForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
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
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Signup failed')
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
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Field */}
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-gray-200 flex items-center gap-2">
              <User className="h-4 w-4 text-gray-400" />
              Name (optional)
            </label>
            <Input
              id="name"
              type="text"
              placeholder="Your name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-rose-600 h-12 text-base"
            />
          </div>

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
            <label htmlFor="password" className="text-sm font-medium text-gray-200 flex items-center gap-2">
              <Lock className="h-4 w-4 text-gray-400" />
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="At least 8 characters"
              required
              minLength={8}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-rose-600 h-12 text-base"
            />
            <p className="text-xs text-gray-500">
              Must be at least 8 characters long
            </p>
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
                Creating your account...
              </>
            ) : (
              'Start Reading for Free'
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <a href="/login" className="text-rose-400 font-semibold hover:text-rose-300 transition-colors">
            Log in
          </a>
        </div>

        {/* Benefits List */}
        <div className="mt-6 pt-6 border-t border-gray-800">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">What you get:</p>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-rose-500" />
              Unlimited access to curated stories
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-rose-500" />
              All genres and heat levels
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-rose-500" />
              New stories added weekly
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-rose-500" />
              Save your favorites
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
