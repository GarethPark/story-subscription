'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowLeft, MessageSquare, Mail, User, Calendar, Filter } from 'lucide-react'

interface Feedback {
  id: string
  name: string | null
  email: string | null
  subject: string | null
  message: string
  status: 'PENDING' | 'REVIEWED' | 'RESOLVED'
  createdAt: string
  user: {
    email: string
    name: string | null
  } | null
}

export default function AdminFeedbackPage() {
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'REVIEWED' | 'RESOLVED'>('ALL')

  useEffect(() => {
    fetchFeedback()
  }, [])

  const fetchFeedback = async () => {
    try {
      const response = await fetch('/api/admin/feedback')
      const data = await response.json()
      setFeedback(data.feedback)
    } catch (error) {
      console.error('Failed to fetch feedback:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/feedback/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        // Update local state
        setFeedback(feedback.map(f => f.id === id ? { ...f, status: status as any } : f))
      }
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  const filteredFeedback = filter === 'ALL'
    ? feedback
    : feedback.filter(f => f.status === filter)

  const statusCounts = {
    PENDING: feedback.filter(f => f.status === 'PENDING').length,
    REVIEWED: feedback.filter(f => f.status === 'REVIEWED').length,
    RESOLVED: feedback.filter(f => f.status === 'RESOLVED').length,
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      PENDING: 'bg-yellow-900/30 text-yellow-400 border-yellow-700/30',
      REVIEWED: 'bg-blue-900/30 text-blue-400 border-blue-700/30',
      RESOLVED: 'bg-green-900/30 text-green-400 border-green-700/30',
    }
    return styles[status as keyof typeof styles] || styles.PENDING
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Header */}
      <div className="border-b border-rose-900/30 bg-gray-900/95 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-6">
          <Link
            href="/admin"
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admin
          </Link>
          <div className="flex items-center gap-3">
            <MessageSquare className="h-8 w-8 text-violet-500" />
            <div>
              <h1 className="text-3xl font-bold text-white font-['Playfair_Display']">
                Feedback Management
              </h1>
              <p className="text-gray-400">Review and manage user feedback</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Status Filter */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <Filter className="h-5 w-5 text-gray-500" />
          <button
            onClick={() => setFilter('ALL')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'ALL'
                ? 'bg-gradient-to-r from-rose-700 to-violet-700 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            All ({feedback.length})
          </button>
          <button
            onClick={() => setFilter('PENDING')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'PENDING'
                ? 'bg-gradient-to-r from-rose-700 to-violet-700 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Pending ({statusCounts.PENDING})
          </button>
          <button
            onClick={() => setFilter('REVIEWED')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'REVIEWED'
                ? 'bg-gradient-to-r from-rose-700 to-violet-700 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Reviewed ({statusCounts.REVIEWED})
          </button>
          <button
            onClick={() => setFilter('RESOLVED')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'RESOLVED'
                ? 'bg-gradient-to-r from-rose-700 to-violet-700 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Resolved ({statusCounts.RESOLVED})
          </button>
        </div>

        {/* Feedback List */}
        {isLoading ? (
          <div className="text-center py-12 text-gray-500">Loading feedback...</div>
        ) : filteredFeedback.length === 0 ? (
          <Card className="p-12 text-center bg-gray-900/30 border-gray-800">
            <MessageSquare className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No feedback found</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredFeedback.map((item) => (
              <Card key={item.id} className="bg-gray-900/50 border-gray-800 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-600 to-violet-600 flex items-center justify-center text-white font-bold">
                      {(item.name || item.user?.name || item.email || item.user?.email || 'A').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-white">
                          {item.name || item.user?.name || 'Anonymous'}
                        </p>
                        <Badge className={getStatusBadge(item.status)}>
                          {item.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                        {(item.email || item.user?.email) && (
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {item.email || item.user?.email}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(item.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Actions */}
                  <div className="flex items-center gap-2">
                    {item.status !== 'PENDING' && (
                      <button
                        onClick={() => updateStatus(item.id, 'PENDING')}
                        className="px-3 py-1 text-xs bg-yellow-900/30 text-yellow-400 border border-yellow-700/30 rounded hover:bg-yellow-900/50 transition-colors"
                      >
                        Mark Pending
                      </button>
                    )}
                    {item.status !== 'REVIEWED' && (
                      <button
                        onClick={() => updateStatus(item.id, 'REVIEWED')}
                        className="px-3 py-1 text-xs bg-blue-900/30 text-blue-400 border border-blue-700/30 rounded hover:bg-blue-900/50 transition-colors"
                      >
                        Mark Reviewed
                      </button>
                    )}
                    {item.status !== 'RESOLVED' && (
                      <button
                        onClick={() => updateStatus(item.id, 'RESOLVED')}
                        className="px-3 py-1 text-xs bg-green-900/30 text-green-400 border border-green-700/30 rounded hover:bg-green-900/50 transition-colors"
                      >
                        Mark Resolved
                      </button>
                    )}
                  </div>
                </div>

                {/* Subject */}
                {item.subject && (
                  <div className="mb-3">
                    <span className="text-xs font-semibold text-gray-500 uppercase">Subject:</span>
                    <p className="text-sm text-gray-300 mt-1">{item.subject}</p>
                  </div>
                )}

                {/* Message */}
                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                  <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">
                    {item.message}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
