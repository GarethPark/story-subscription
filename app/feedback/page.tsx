'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowLeft, MessageSquare, Send, Heart, CheckCircle } from 'lucide-react'

const SUBJECTS = [
  'General Feedback',
  'Feature Request',
  'Bug Report',
  'Story Quality',
  'User Experience',
  'Other',
]

export default function FeedbackPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('General Feedback')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (message.trim().length < 10) {
      alert('Please enter at least 10 characters')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name || undefined,
          email: email || undefined,
          subject,
          message,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit feedback')
      }

      setIsSubmitted(true)
      setName('')
      setEmail('')
      setSubject('General Feedback')
      setMessage('')
    } catch (error) {
      console.error('Feedback error:', error)
      alert('Failed to submit feedback. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-black via-gray-900 to-black border-b border-rose-900/30">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950/20 via-transparent to-rose-950/20" />
        <div className="w-full mx-auto px-5 py-16 relative z-10" style={{ maxWidth: '800px' }}>
          <Link
            href="/dashboard"
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>

          <div className="flex items-center justify-center mb-4">
            <MessageSquare className="h-8 w-8 text-violet-500 mr-3" />
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-center mb-4 font-['Playfair_Display'] bg-gradient-to-r from-rose-400 via-pink-300 to-violet-400 bg-clip-text text-transparent">
            We Want to Hear From You
          </h1>
          <p className="text-gray-300 text-center text-xl mx-auto leading-relaxed" style={{ maxWidth: '600px' }}>
            We're passionate about making Silk Stories the best in the business. Your feedback helps us improve!
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full mx-auto px-5 py-12" style={{ maxWidth: '800px' }}>
        {isSubmitted ? (
          <Card className="bg-gradient-to-br from-green-950/30 to-violet-950/30 border-green-700/30 p-12 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4 font-['Playfair_Display']">
              Thank You!
            </h2>
            <p className="text-gray-300 text-lg mb-6">
              We've received your feedback and really appreciate you taking the time to help us improve.
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => setIsSubmitted(false)}
                variant="outline"
                className="border-gray-700 bg-gray-800 hover:bg-gray-700 text-white"
              >
                Submit Another
              </Button>
              <Button
                asChild
                className="bg-gradient-to-r from-rose-700 to-violet-700 hover:from-rose-600 hover:to-violet-600"
              >
                <Link href="/dashboard">Back to Dashboard</Link>
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="bg-gray-900/50 border-rose-900/30 p-8 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name (Optional) */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Your Name (optional)
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Sarah M."
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-600"
                />
              </div>

              {/* Email (Optional) */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Your Email (optional - for follow-up)
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sarah@example.com"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-600"
                />
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                  What's this about?
                </label>
                <select
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-rose-600"
                >
                  {SUBJECTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Your Feedback *
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what you love, what you'd like to see improved, or any ideas you have..."
                  className="w-full h-40 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-600 resize-none"
                  maxLength={2000}
                  required
                />
                <p className="text-xs text-gray-500 mt-2">
                  {message.length}/2000 characters (minimum 10)
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting || message.trim().length < 10}
                className="w-full bg-gradient-to-r from-rose-700 to-violet-700 hover:from-rose-600 hover:to-violet-600 text-white py-6 text-lg font-bold shadow-lg"
              >
                {isSubmitting ? (
                  'Submitting...'
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    Submit Feedback
                  </>
                )}
              </Button>
            </form>
          </Card>
        )}

        {/* Info Section */}
        <div className="mt-8 bg-violet-950/20 border border-violet-700/30 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <Heart className="h-6 w-6 text-rose-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-white mb-2">Your Voice Matters</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Every piece of feedback helps us create better stories and a better experience for all our readers.
                Whether it's a feature idea, a bug you've noticed, or just sharing what you love about Silk Stories -
                we read every message and take it seriously.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
