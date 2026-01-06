import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/session'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Heart, BookOpen, Sparkles, Star, Menu } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Your personal romance story dashboard. Generate custom stories, browse your library, and manage your account.'
}

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream via-white to-cream">
      {/* Elegant Header */}
      <header className="border-b border-rose-100/50 bg-white/95 backdrop-blur-lg shadow-sm">
        <div className="container mx-auto px-4 md:px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/" className="flex items-center space-x-2 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-700 to-violet-600 flex items-center justify-center shadow-md">
                  <Heart className="h-5 w-5 text-white fill-white" />
                </div>
                <span className="font-bold text-2xl font-['Playfair_Display'] bg-gradient-to-r from-rose-700 to-violet-600 bg-clip-text text-transparent">
                  Silk
                </span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <nav className="hidden md:flex items-center gap-6 mr-4">
                <Link href="/stories" className="text-sm font-semibold text-gray-600 hover:text-rose-700 transition-colors">
                  Browse Stories
                </Link>
                <Link href="/my-stories" className="text-sm font-semibold text-gray-600 hover:text-rose-700 transition-colors">
                  My Stories
                </Link>
                <Link href="/library" className="text-sm font-semibold text-gray-600 hover:text-rose-700 transition-colors">
                  Favorites
                </Link>
              </nav>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200/50 rounded-full">
                <Star className="h-4 w-4 text-amber-600 fill-amber-600" />
                <span className="text-sm font-semibold text-amber-900">{user.credits}</span>
              </div>
              <span className="hidden md:block text-sm text-gray-600">{user.email}</span>
              <form action="/api/auth/logout" method="POST">
                <Button type="submit" variant="ghost" size="sm">
                  Logout
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 md:px-6 py-10">
        {/* Welcome Hero */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold font-['Playfair_Display'] text-gray-900 mb-3">
            Welcome back{user.name ? `, ${user.name}` : ''}
          </h1>
          <p className="text-lg text-gray-600">
            Your personal romance library awaits
          </p>
        </div>

        {/* Create Story CTA */}
        <div className="relative bg-gradient-to-br from-rose-700 via-rose-600 to-violet-600 rounded-3xl p-8 md:p-10 mb-10 text-white overflow-hidden shadow-2xl">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-rose-500/20 rounded-full blur-3xl" />

          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold font-['Playfair_Display'] mb-3">
                Create Your Perfect Romance
              </h2>
              <p className="text-rose-100 text-lg mb-4 max-w-2xl">
                Personalize every detail - from character names to plot twists. Your story, your way.
              </p>
              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                  <Star className="h-4 w-4 text-amber-300 fill-amber-300" />
                  <span className="font-semibold">{user.credits} credits available</span>
                </div>
              </div>
            </div>
            <Button size="lg" className="bg-white text-rose-700 hover:bg-rose-50 shadow-xl" asChild>
              <Link href="/generate">
                <Sparkles className="h-5 w-5 mr-2" />
                Generate Story
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Quick Actions */}
          <Card className="border-rose-100/50 hover:shadow-none">
            <CardHeader>
              <CardTitle className="text-2xl font-['Playfair_Display']">Quick Actions</CardTitle>
              <CardDescription className="text-base">Jump to your favorite sections</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start text-base" asChild>
                <Link href="/my-stories">
                  <Sparkles className="h-5 w-5 mr-3" />
                  My Stories
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start text-base" asChild>
                <Link href="/stories">
                  <BookOpen className="h-5 w-5 mr-3" />
                  Browse Library
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start text-base" asChild>
                <Link href="/library">
                  <Heart className="h-5 w-5 mr-3" />
                  My Favorites
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Credits Card */}
          <Card className="border-amber-200/50 bg-gradient-to-br from-amber-50 via-white to-amber-50/50 hover:shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl font-['Playfair_Display']">
                <Star className="h-6 w-6 text-amber-600 fill-amber-600" />
                Your Credits
              </CardTitle>
              <CardDescription className="text-base">Story generation credits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <div className="text-6xl font-bold font-['Playfair_Display'] bg-gradient-to-br from-amber-600 to-amber-800 bg-clip-text text-transparent mb-2">
                  {user.credits}
                </div>
                <p className="text-sm text-gray-600 mb-6">credits remaining</p>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/pricing">Get More Credits</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Account Info Card */}
          <Card className="border-rose-100/50 hover:shadow-none">
            <CardHeader>
              <CardTitle className="text-2xl font-['Playfair_Display']">Your Account</CardTitle>
              <CardDescription className="text-base">
                {user.email}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                Ready to dive into your next romance adventure? Create a custom story or explore our curated library.
              </p>
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex items-center gap-3 px-4 py-2 bg-emerald-50 border border-emerald-200/50 rounded-lg">
                  <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                  <span className="text-emerald-800 font-medium">All systems operational</span>
                </div>
                {user.isAdmin && (
                  <div className="flex items-center gap-3 px-4 py-2 bg-violet-50 border border-violet-200/50 rounded-lg">
                    <div className="h-2 w-2 rounded-full bg-violet-500"></div>
                    <span className="text-violet-800 font-medium">Admin access enabled</span>
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
