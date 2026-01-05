import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/session'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Heart, BookOpen, Sparkles, Star } from 'lucide-react'

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <div className="flex items-center gap-4">
              <nav className="hidden md:flex items-center gap-4 mr-4">
                <Link href="/stories" className="text-sm text-slate-600 hover:text-slate-900">
                  Browse Stories
                </Link>
                <Link href="/my-stories" className="text-sm text-slate-600 hover:text-slate-900">
                  My Stories
                </Link>
                <Link href="/library" className="text-sm text-slate-600 hover:text-slate-900">
                  Favorites
                </Link>
              </nav>
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
        {/* Create Story CTA */}
        <div className="bg-gradient-to-r from-rose-500 to-purple-600 rounded-xl p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-2">Create Your Perfect Romance</h2>
              <p className="text-rose-100 mb-4">
                Personalize every detail - from character names to plot twists
              </p>
              <div className="flex items-center gap-2 text-sm">
                <Star className="h-4 w-4 text-yellow-300" />
                <span className="font-semibold">{user.credits} credits available</span>
              </div>
            </div>
            <Button size="lg" className="bg-white text-rose-600 hover:bg-rose-50" asChild>
              <Link href="/generate">
                <Sparkles className="h-5 w-5 mr-2" />
                Generate Story
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Credits Card */}
          <Card className="border-rose-200 bg-gradient-to-br from-rose-50 to-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-rose-600" />
                Your Credits
              </CardTitle>
              <CardDescription>Story generation credits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <div className="text-5xl font-bold text-rose-600 mb-2">{user.credits}</div>
                <p className="text-sm text-slate-600 mb-4">credits remaining</p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/pricing">Get More Credits</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Jump to your favorite sections</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" asChild>
                <Link href="/my-stories">
                  <Sparkles className="h-4 w-4 mr-2" />
                  My Stories
                </Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/stories">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Browse Library
                </Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/library">
                  <Heart className="h-4 w-4 mr-2" />
                  My Favorites
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Welcome Card */}
          <Card>
            <CardHeader>
              <CardTitle>Welcome back!</CardTitle>
              <CardDescription>
                {user.name ? `Hi ${user.name}` : user.email}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 mb-4">
                Ready to dive into your next romance adventure? Create a custom story or explore our curated library.
              </p>
              <div className="flex flex-col gap-2 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span>All systems operational</span>
                </div>
                {user.isAdmin && (
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                    <span>Admin access enabled</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
