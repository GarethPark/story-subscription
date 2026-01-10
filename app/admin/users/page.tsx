'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowLeft, Users, Mail, Calendar, Star, BookOpen, Heart, Edit, Search } from 'lucide-react'

interface User {
  id: string
  email: string
  name: string | null
  credits: number
  creditsUsed: number
  isAdmin: boolean
  createdAt: string
  _count: {
    customStories: number
    favorites: number
    readingHistory: number
  }
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [editingCredits, setEditingCredits] = useState<{ userId: string; credits: number } | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users')
      const data = await response.json()
      setUsers(data.users)
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateCredits = async (userId: string, credits: number) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/credits`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credits }),
      })

      if (response.ok) {
        // Update local state
        setUsers(users.map(u => u.id === userId ? { ...u, credits } : u))
        setEditingCredits(null)
      } else {
        alert('Failed to update credits')
      }
    } catch (error) {
      console.error('Failed to update credits:', error)
      alert('Failed to update credits')
    }
  }

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const stats = {
    totalUsers: users.length,
    admins: users.filter(u => u.isAdmin).length,
    withStories: users.filter(u => u._count.customStories > 0).length,
    totalCreditsUsed: users.reduce((sum, u) => sum + u.creditsUsed, 0),
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
            <Users className="h-8 w-8 text-green-500" />
            <div>
              <h1 className="text-3xl font-bold text-white font-['Playfair_Display']">
                User Management
              </h1>
              <p className="text-gray-400">Manage user accounts and credits</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gray-900/50 border-gray-800 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Users</p>
                <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </Card>
          <Card className="bg-gray-900/50 border-gray-800 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Admins</p>
                <p className="text-2xl font-bold text-white">{stats.admins}</p>
              </div>
              <Star className="h-8 w-8 text-amber-500" />
            </div>
          </Card>
          <Card className="bg-gray-900/50 border-gray-800 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">With Stories</p>
                <p className="text-2xl font-bold text-white">{stats.withStories}</p>
              </div>
              <BookOpen className="h-8 w-8 text-violet-500" />
            </div>
          </Card>
          <Card className="bg-gray-900/50 border-gray-800 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Credits Used</p>
                <p className="text-2xl font-bold text-white">{stats.totalCreditsUsed}</p>
              </div>
              <Star className="h-8 w-8 text-rose-500" />
            </div>
          </Card>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by email or name..."
              className="w-full pl-10 pr-3 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-600 focus:border-transparent text-white placeholder:text-gray-500"
            />
          </div>
        </div>

        {/* Users Table */}
        {isLoading ? (
          <div className="text-center py-12 text-gray-500">Loading users...</div>
        ) : filteredUsers.length === 0 ? (
          <Card className="p-12 text-center bg-gray-900/30 border-gray-800">
            <Users className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No users found</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredUsers.map((user) => (
              <Card key={user.id} className="bg-gray-900/50 border-gray-800 p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-600 to-violet-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      {(user.name || user.email).charAt(0).toUpperCase()}
                    </div>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-white">
                          {user.name || 'No name'}
                        </h3>
                        {user.isAdmin && (
                          <Badge className="bg-amber-900/30 text-amber-400 border-amber-700/30">
                            Admin
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Joined {new Date(user.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-6 text-sm">
                        <div>
                          <span className="text-gray-500">Credits:</span>{' '}
                          {editingCredits?.userId === user.id ? (
                            <div className="inline-flex items-center gap-2">
                              <input
                                type="number"
                                value={editingCredits.credits}
                                onChange={(e) => setEditingCredits({ userId: user.id, credits: parseInt(e.target.value) || 0 })}
                                className="w-20 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-white"
                                min="0"
                              />
                              <button
                                onClick={() => updateCredits(user.id, editingCredits.credits)}
                                className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingCredits(null)}
                                className="px-2 py-1 bg-gray-700 text-white rounded text-xs hover:bg-gray-600"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <>
                              <span className="font-semibold text-amber-400">{user.credits}</span>
                              <button
                                onClick={() => setEditingCredits({ userId: user.id, credits: user.credits })}
                                className="ml-1 text-gray-500 hover:text-white"
                              >
                                <Edit className="h-3 w-3 inline" />
                              </button>
                            </>
                          )}
                        </div>
                        <div>
                          <span className="text-gray-500">Used:</span>{' '}
                          <span className="font-semibold text-gray-300">{user.creditsUsed}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Stories:</span>{' '}
                          <span className="font-semibold text-violet-400">{user._count.customStories}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Favorites:</span>{' '}
                          <span className="font-semibold text-rose-400">{user._count.favorites}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Reads:</span>{' '}
                          <span className="font-semibold text-blue-400">{user._count.readingHistory}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
