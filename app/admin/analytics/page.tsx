import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/session'
import { prisma } from '@/lib/db'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowLeft, BookOpen, Users, CreditCard, Eye, Heart, TrendingUp, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminAnalyticsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login?redirect=/admin/analytics')
  }

  if (!user.isAdmin) {
    redirect('/dashboard')
  }

  // Fetch analytics data in parallel
  const [
    totalStories,
    publishedStories,
    unpublishedStories,
    totalUsers,
    totalCreditsConsumed,
    totalViews,
    totalFavorites,
    usersWithReadingHistory,
    topStoriesByViews,
    topStoriesByFavorites,
    recentGenerations,
    genreDistribution,
  ] = await Promise.all([
    prisma.story.count(),
    prisma.story.count({ where: { published: true } }),
    prisma.story.count({ where: { published: false } }),
    prisma.user.count(),
    prisma.user.aggregate({
      _sum: {
        creditsUsed: true,
      },
    }),
    prisma.story.aggregate({
      _sum: {
        viewCount: true,
      },
    }),
    prisma.favorite.count(),
    prisma.user.count({
      where: {
        readingHistory: {
          some: {},
        },
      },
    }),
    prisma.story.findMany({
      where: { published: true },
      orderBy: { viewCount: 'desc' },
      take: 5,
      select: {
        id: true,
        title: true,
        viewCount: true,
        genre: true,
      },
    }),
    prisma.story.findMany({
      where: { published: true },
      orderBy: {
        favorites: {
          _count: 'desc',
        },
      },
      take: 5,
      include: {
        _count: {
          select: { favorites: true },
        },
      },
      select: {
        id: true,
        title: true,
        genre: true,
        _count: true,
      },
    }),
    prisma.story.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        title: true,
        genre: true,
        createdAt: true,
        isCustom: true,
      },
    }),
    prisma.story.groupBy({
      by: ['genre'],
      where: { published: true },
      _count: {
        genre: true,
      },
    }),
  ])

  const creditsConsumed = totalCreditsConsumed._sum.creditsUsed || 0
  const totalViewsCount = totalViews._sum.viewCount || 0
  const engagementRate = totalUsers > 0 ? ((usersWithReadingHistory / totalUsers) * 100).toFixed(1) : '0'

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Header */}
      <div className="border-b border-rose-900/30 bg-gradient-to-r from-black via-gray-900 to-black">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/admin"
              className="inline-flex items-center text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin
            </Link>
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white font-['Playfair_Display'] mb-2">Analytics Dashboard</h1>
            <p className="text-gray-400">Platform insights and performance metrics</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Key Metrics Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {/* Total Stories */}
          <Card className="bg-gray-900/50 border-rose-900/30">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-400">Total Stories</CardTitle>
                <BookOpen className="h-4 w-4 text-rose-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{totalStories}</div>
              <p className="text-xs text-gray-500 mt-1">
                {publishedStories} published, {unpublishedStories} draft
              </p>
            </CardContent>
          </Card>

          {/* Total Users */}
          <Card className="bg-gray-900/50 border-rose-900/30">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-400">Total Users</CardTitle>
                <Users className="h-4 w-4 text-violet-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{totalUsers}</div>
              <p className="text-xs text-gray-500 mt-1">
                {engagementRate}% with reading history
              </p>
            </CardContent>
          </Card>

          {/* Credits Consumed */}
          <Card className="bg-gray-900/50 border-rose-900/30">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-400">Credits Used</CardTitle>
                <CreditCard className="h-4 w-4 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{creditsConsumed}</div>
              <p className="text-xs text-gray-500 mt-1">
                Across all users
              </p>
            </CardContent>
          </Card>

          {/* Total Views */}
          <Card className="bg-gray-900/50 border-rose-900/30">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-400">Total Views</CardTitle>
                <Eye className="h-4 w-4 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{totalViewsCount.toLocaleString()}</div>
              <p className="text-xs text-gray-500 mt-1">
                {totalFavorites} favorites
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          {/* Top Stories by Views */}
          <Card className="bg-gray-900/50 border-rose-900/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-rose-500" />
                Top Stories by Views
              </CardTitle>
              <CardDescription className="text-gray-400">Most popular stories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topStoriesByViews.map((story, index) => (
                  <div key={story.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-rose-900/30 flex items-center justify-center text-xs font-bold text-rose-400">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/stories/${story.id}`}
                          className="text-sm font-medium text-white hover:text-rose-400 transition-colors truncate block"
                        >
                          {story.title}
                        </Link>
                        <p className="text-xs text-gray-500">{story.genre}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400 flex-shrink-0 ml-2">
                      <Eye className="h-3 w-3" />
                      <span className="text-sm font-medium">{story.viewCount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Stories by Favorites */}
          <Card className="bg-gray-900/50 border-rose-900/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Heart className="h-5 w-5 text-rose-500" />
                Top Stories by Favorites
              </CardTitle>
              <CardDescription className="text-gray-400">Most loved stories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topStoriesByFavorites.map((story, index) => (
                  <div key={story.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-rose-900/30 flex items-center justify-center text-xs font-bold text-rose-400">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/stories/${story.id}`}
                          className="text-sm font-medium text-white hover:text-rose-400 transition-colors truncate block"
                        >
                          {story.title}
                        </Link>
                        <p className="text-xs text-gray-500">{story.genre}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400 flex-shrink-0 ml-2">
                      <Heart className="h-3 w-3" />
                      <span className="text-sm font-medium">{story._count.favorites}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Sections */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Genre Distribution */}
          <Card className="bg-gray-900/50 border-rose-900/30">
            <CardHeader>
              <CardTitle className="text-white">Genre Distribution</CardTitle>
              <CardDescription className="text-gray-400">Stories by genre</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {genreDistribution.map((genre) => {
                  const percentage = ((genre._count.genre / publishedStories) * 100).toFixed(0)
                  return (
                    <div key={genre.genre}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-white">{genre.genre}</span>
                        <span className="text-sm text-gray-400">{genre._count.genre} ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-rose-600 to-violet-600 h-2 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recent Generations */}
          <Card className="bg-gray-900/50 border-rose-900/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calendar className="h-5 w-5 text-violet-500" />
                Recent Story Generations
              </CardTitle>
              <CardDescription className="text-gray-400">Latest published stories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentGenerations.map((story) => (
                  <div key={story.id} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/stories/${story.id}`}
                        className="text-sm font-medium text-white hover:text-rose-400 transition-colors truncate block"
                      >
                        {story.title}
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">{story.genre}</span>
                        {story.isCustom && (
                          <span className="text-xs px-2 py-0.5 bg-violet-900/30 text-violet-400 rounded">
                            Custom
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                      {new Date(story.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
