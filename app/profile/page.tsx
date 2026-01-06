import { getCurrentUser } from '@/lib/auth/session'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { User, Mail, Shield, CreditCard, BookOpen, Heart, Settings, LogOut, Coins } from 'lucide-react'

export default async function ProfilePage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-12">
      <div className="container max-w-6xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-rose-700 to-violet-600 flex items-center justify-center shadow-lg">
              <User className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-white font-['Playfair_Display']">
                Account Settings
              </h1>
              <p className="text-gray-400">Manage your profile and preferences</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Account Info */}
            <Card className="bg-gray-900/50 border-rose-900/30 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <User className="h-6 w-6 text-rose-400" />
                  <h2 className="text-2xl font-bold text-white font-['Playfair_Display']">
                    Profile Information
                  </h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Full Name
                    </label>
                    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-white">
                      {user.name || 'Not set'}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Email Address
                    </label>
                    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-white flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      {user.email}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Account Type
                    </label>
                    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-white flex items-center gap-2">
                      {user.isAdmin ? (
                        <>
                          <Shield className="h-4 w-4 text-violet-400" />
                          <span className="font-semibold">Administrator</span>
                        </>
                      ) : (
                        <>
                          <User className="h-4 w-4 text-rose-400" />
                          <span>Free Account</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Member Since
                    </label>
                    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-white">
                      {new Date(user.createdAt).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button
                      variant="outline"
                      disabled
                      className="w-full md:w-auto border-gray-700 bg-gray-800 text-gray-400 cursor-not-allowed"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Edit Profile (Coming Soon)
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Password & Security */}
            <Card className="bg-gray-900/50 border-violet-900/30 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Shield className="h-6 w-6 text-violet-400" />
                  <h2 className="text-2xl font-bold text-white font-['Playfair_Display']">
                    Password & Security
                  </h2>
                </div>

                <div className="space-y-4">
                  <p className="text-gray-400">
                    Your password is encrypted and secure. You can update it anytime.
                  </p>

                  <Button
                    variant="outline"
                    disabled
                    className="w-full md:w-auto border-gray-700 bg-gray-800 text-gray-400 cursor-not-allowed"
                  >
                    Change Password (Coming Soon)
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Logout */}
            <Card className="bg-gradient-to-r from-red-950/30 to-red-900/20 border-red-900/30 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2 font-['Playfair_Display']">
                      Sign Out
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Sign out of your account on this device
                    </p>
                  </div>
                  <form action="/api/auth/logout" method="POST">
                    <Button
                      type="submit"
                      variant="outline"
                      className="border-red-700 bg-red-950/50 text-red-300 hover:bg-red-900/50 hover:text-white"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Stats & Quick Actions */}
          <div className="space-y-6">
            {/* Credits Card */}
            <Card className="bg-gradient-to-br from-rose-900/30 to-violet-900/30 border-rose-700/30 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-600 to-violet-600 flex items-center justify-center shadow-lg">
                    <Coins className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Story Credits</p>
                    <p className="text-3xl font-black text-white">
                      {user.credits}
                    </p>
                  </div>
                </div>
                <p className="text-gray-400 text-sm mb-4">
                  Use credits to generate custom romance stories
                </p>
                <Link href="/generate">
                  <Button className="w-full bg-gradient-to-r from-rose-700 to-violet-700 hover:from-rose-600 hover:to-violet-600">
                    Generate Story
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-white mb-4 font-['Playfair_Display']">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <Link href="/stories">
                    <Button variant="outline" className="w-full justify-start border-gray-700 bg-gray-800 hover:bg-gray-700 text-white">
                      <BookOpen className="mr-3 h-4 w-4 text-rose-400" />
                      Browse Stories
                    </Button>
                  </Link>
                  <Link href="/my-stories">
                    <Button variant="outline" className="w-full justify-start border-gray-700 bg-gray-800 hover:bg-gray-700 text-white">
                      <Heart className="mr-3 h-4 w-4 text-rose-400" />
                      My Stories
                    </Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button variant="outline" className="w-full justify-start border-gray-700 bg-gray-800 hover:bg-gray-700 text-white">
                      <Settings className="mr-3 h-4 w-4 text-violet-400" />
                      Dashboard
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Subscription Info */}
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <CreditCard className="h-5 w-5 text-gray-400" />
                  <h3 className="text-lg font-bold text-white font-['Playfair_Display']">
                    Subscription
                  </h3>
                </div>
                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 mb-4">
                  <p className="text-white font-semibold mb-1">Free Plan</p>
                  <p className="text-gray-400 text-sm">
                    Unlimited access to story library
                  </p>
                </div>
                <Link href="/#pricing">
                  <Button variant="outline" className="w-full border-violet-700 bg-violet-950/30 text-violet-300 hover:bg-violet-900/50">
                    Upgrade to Premium
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
