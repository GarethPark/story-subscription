import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/session'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StoryGenerationForm } from '@/components/admin/story-generation-form'

export default async function GenerateStoryPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login?redirect=/admin/generate')
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
            <div className="flex items-center gap-4">
              <Link href="/admin" className="text-slate-600 hover:text-slate-900">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Generate AI Story</h1>
                <p className="text-sm text-slate-600">Create a new romance story with AI</p>
              </div>
            </div>
            <span className="text-sm text-slate-600">{user.email}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Card className="p-6">
            <StoryGenerationForm />
          </Card>
        </div>
      </main>
    </div>
  )
}
