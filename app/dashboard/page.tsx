import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/session'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Heart, BookOpen, Sparkles, Star, LayoutDashboard, Library, Clock, ChevronRight } from 'lucide-react'
import type { Metadata } from 'next'
import { prisma } from '@/lib/db'
import { Badge } from '@/components/ui/badge'
import { SubscriptionCard } from '@/components/stripe/subscription-card'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Your personal romance story dashboard. Generate custom stories, browse your library, and manage your account.'
}

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch recently read stories
  const recentlyRead = await prisma.readingHistory.findMany({
    where: {
      userId: user.id,
    },
    include: {
      story: true,
    },
    orderBy: {
      lastReadAt: 'desc',
    },
    take: 5,
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Elegant Header */}
      <header className="border-b border-rose-900/30 bg-gray-900/95 backdrop-blur-lg shadow-sm">
        <div className="w-full mx-auto px-5 py-5" style={{ maxWidth: '1200px' }}>
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
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200/50 rounded-full">
                <Star className="h-4 w-4 text-amber-600 fill-amber-600" />
                <span className="text-sm font-semibold text-amber-900">{user.credits}</span>
              </div>
              <span className="hidden md:block text-sm text-gray-300">{user.email}</span>
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
      <main className="w-full mx-auto px-5 py-10" style={{ maxWidth: '1200px' }}>
        {/* Navigation */}
        <nav className="mb-8 flex items-center gap-2 flex-wrap">
          <Link href="/dashboard" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-gradient-to-r from-rose-700 to-violet-700 text-white rounded-lg">
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Link href="/generate" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors">
            <Sparkles className="h-4 w-4" />
            Generate
          </Link>
          <Link href="/stories" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors">
            <Library className="h-4 w-4" />
            Browse Stories
          </Link>
          <Link href="/my-stories" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors">
            <BookOpen className="h-4 w-4" />
            My Stories
          </Link>
          <Link href="/library" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors">
            <Heart className="h-4 w-4" />
            Favorites
          </Link>
        </nav>

        {/* Welcome Hero */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold font-['Playfair_Display'] text-white mb-3">
            Welcome back{user.name ? `, ${user.name}` : ''}
          </h1>
          <p className="text-lg text-gray-300">
            Your personal romance library awaits
          </p>
        </div>

        {/* Create Story CTA */}
        <div className="relative bg-gradient-to-br from-rose-700 via-rose-600 to-violet-600 rounded-3xl p-8 md:p-10 mb-10 text-white overflow-hidden shadow-2xl">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-rose-500/20 rounded-full blur-3xl" />

          <div className="relative">
            <div className="mb-6">
              <h2 className="text-3xl md:text-4xl font-bold font-['Playfair_Display'] mb-3">
                Create Your Perfect Romance
              </h2>
              <p className="text-rose-100 text-lg mb-4" style={{ maxWidth: '600px' }}>
                Personalize every detail - from character names to plot twists. Your story, your way.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 text-sm">
                <Star className="h-4 w-4 text-amber-300 fill-amber-300" />
                <span className="font-semibold">{user.credits} credits available</span>
              </div>
              <Button size="lg" className="bg-white text-rose-700 hover:bg-rose-50 shadow-xl" asChild>
                <Link href="/generate">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Generate Story
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Recently Read Section */}
        {recentlyRead.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold font-['Playfair_Display'] text-white flex items-center gap-2">
                  <Clock className="h-6 w-6 text-rose-400" />
                  Recently Read
                </h2>
                <p className="text-gray-400 mt-1">Pick up where you left off</p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {recentlyRead.map((history) => (
                <Link
                  key={history.id}
                  href={`/stories/${history.story.id}`}
                  className="group block bg-gray-900/50 border border-gray-800 hover:border-rose-700 rounded-xl overflow-hidden transition-all hover:shadow-lg hover:shadow-rose-900/20"
                >
                  {history.story.coverImage && (
                    <div className="relative h-48 bg-gray-800 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={history.story.coverImage}
                        alt={history.story.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      {/* Progress bar */}
                      {history.progress > 0 && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
                          <div
                            className="h-full bg-gradient-to-r from-rose-500 to-violet-500"
                            style={{ width: `${history.progress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="genre" className="text-xs">
                        {history.story.genre}
                      </Badge>
                      {history.progress > 0 && (
                        <span className="text-xs text-gray-500">
                          {Math.round(history.progress)}% read
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-white mb-1 line-clamp-2 group-hover:text-rose-400 transition-colors">
                      {history.story.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(history.lastReadAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Quick Actions */}
          <Card className="border-rose-900/30 bg-gray-900/50 backdrop-blur-sm hover:shadow-none">
            <CardHeader>
              <CardTitle className="text-2xl font-['Playfair_Display'] text-white">Quick Actions</CardTitle>
              <CardDescription className="text-base text-gray-400">Jump to your favorite sections</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/my-stories" className="block w-full">
                <Button className="w-full justify-start text-base">
                  <Sparkles className="h-5 w-5 mr-3" />
                  My Stories
                </Button>
              </Link>
              <Link href="/stories" className="block w-full">
                <Button variant="outline" className="w-full justify-start text-base">
                  <BookOpen className="h-5 w-5 mr-3" />
                  Browse Library
                </Button>
              </Link>
              <Link href="/library" className="block w-full">
                <Button variant="outline" className="w-full justify-start text-base">
                  <Heart className="h-5 w-5 mr-3" />
                  My Favorites
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Credits Card */}
          <Card className="border-amber-700/30 bg-gradient-to-br from-amber-950/50 via-gray-900/50 to-amber-950/30 backdrop-blur-sm hover:shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl font-['Playfair_Display'] text-white">
                <Star className="h-6 w-6 text-amber-400 fill-amber-400" />
                Your Credits
              </CardTitle>
              <CardDescription className="text-base text-gray-400">Story generation credits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <div className="text-6xl font-bold font-['Playfair_Display'] bg-gradient-to-br from-amber-400 to-amber-600 bg-clip-text text-transparent mb-2">
                  {user.credits}
                </div>
                <p className="text-sm text-gray-400 mb-6">credits remaining</p>
                <Button variant="outline" className="w-full border-amber-700/30 hover:bg-amber-950/30 text-gray-200" asChild>
                  <Link href="/pricing">Get More Credits</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Subscription Card */}
          <SubscriptionCard
            tier={user.subscriptionTier}
            monthlyCredits={user.monthlyCredits}
            creditsResetAt={user.creditsResetAt}
            stripeCustomerId={user.stripeCustomerId}
          />

          {/* Account Info Card */}
          <Card className="border-rose-900/30 bg-gray-900/50 backdrop-blur-sm hover:shadow-none">
            <CardHeader>
              <CardTitle className="text-2xl font-['Playfair_Display'] text-white">Your Account</CardTitle>
              <CardDescription className="text-base text-gray-400">
                {user.email}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300 mb-6 leading-relaxed">
                Ready to dive into your next romance adventure? Create a custom story or explore our curated library.
              </p>
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex items-center gap-3 px-4 py-2 bg-emerald-950/50 border border-emerald-700/30 rounded-lg">
                  <div className="h-2 w-2 rounded-full bg-emerald-400"></div>
                  <span className="text-emerald-300 font-medium">All systems operational</span>
                </div>
                {user.isAdmin && (
                  <div className="flex items-center gap-3 px-4 py-2 bg-violet-950/50 border border-violet-700/30 rounded-lg">
                    <div className="h-2 w-2 rounded-full bg-violet-400"></div>
                    <span className="text-violet-300 font-medium">Admin access enabled</span>
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
