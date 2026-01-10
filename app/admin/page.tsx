import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/session'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Sparkles, BookOpen, Users, BarChart3, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function AdminPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login?redirect=/admin')
  }

  if (!user.isAdmin) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Admin Panel</h1>
              <p className="text-sm text-slate-600">Content management and AI generation</p>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-sm text-slate-600 hover:text-slate-900">
                Dashboard
              </Link>
              <span className="text-sm text-slate-600">{user.email}</span>
              <form action="/api/auth/logout" method="POST">
                <Button type="submit" variant="outline" size="sm">
                  Logout
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Sparkles className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <CardTitle>AI Story Generation</CardTitle>
                  <CardDescription>Create new stories with AI</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 mb-4">
                Generate high-quality romance stories using Claude AI with customizable genres, tropes, and heat levels.
              </p>
              <Button className="w-full" asChild>
                <Link href="/admin/generate">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Story
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle>Manage Stories</CardTitle>
                  <CardDescription>Edit and publish stories</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 mb-4">
                View, edit, and manage all stories in the system. Control publishing status and featured stories.
              </p>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/stories">
                  <BookOpen className="h-4 w-4 mr-2" />
                  View Stories
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-100 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-rose-600" />
                </div>
                <div>
                  <CardTitle>Analytics Dashboard</CardTitle>
                  <CardDescription>Platform insights & metrics</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 mb-4">
                View platform performance, user engagement, popular stories, and content distribution metrics.
              </p>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/admin/analytics">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Analytics
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-violet-100 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-violet-600" />
                </div>
                <div>
                  <CardTitle>User Feedback</CardTitle>
                  <CardDescription>Review & manage feedback</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 mb-4">
                View and respond to user feedback, feature requests, and bug reports.
              </p>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/admin/feedback">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  View Feedback
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage users & credits</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 mb-4">
                View all users, manage credits, and monitor user activity and engagement.
              </p>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/admin/users">
                  <Users className="h-4 w-4 mr-2" />
                  Manage Users
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
