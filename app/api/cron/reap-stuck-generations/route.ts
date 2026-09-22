import { NextRequest, NextResponse } from 'next/server'
import { reapStuckGenerations } from '@/lib/generation-watchdog'

// Backstop for accounts that never revisit a page that triggers the lazy
// check in reapStuckGenerations (my-stories, story status routes). Vercel
// signs cron requests with this bearer token automatically when CRON_SECRET
// is set as an env var - see https://vercel.com/docs/cron-jobs/manage-cron-jobs#securing-cron-jobs
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const reaped = await reapStuckGenerations()
  return NextResponse.json({ reaped })
}
