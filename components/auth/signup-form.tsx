'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

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
    <Card className="w-full border-rose-900/50 bg-gray-900/90 backdrop-blur-xl shadow-2xl">
      <CardHeader className="space-y-3 pb-6">
        <CardTitle className="text-3xl font-['Playfair_Display'] text-white">Create Your Account</CardTitle>
        <CardDescription className="text-gray-300 text-base">Start your journey into irresistible romance</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-gray-200">
              Name (optional)
            </label>
            <Input
              id="name"
              type="text"
              placeholder="Your name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-rose-600"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-200">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-rose-600"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-200">
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
              className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-rose-600"
            />
          </div>

          {error && (
            <div className="text-sm text-red-200 bg-red-950/50 border border-red-900/50 p-3 rounded-xl">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full h-12 text-base font-bold" disabled={loading}>
            {loading ? 'Creating your account...' : 'Start Reading'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <a href="/login" className="text-rose-400 font-semibold hover:text-rose-300 transition-colors">
            Log in
          </a>
        </div>
      </CardContent>
    </Card>
  )
}
