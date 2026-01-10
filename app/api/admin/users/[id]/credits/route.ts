import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth/session'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const { credits } = await request.json()

    if (typeof credits !== 'number' || credits < 0) {
      return NextResponse.json(
        { error: 'Invalid credits value' },
        { status: 400 }
      )
    }

    const user = await prisma.user.update({
      where: { id },
      data: { credits },
      select: {
        id: true,
        email: true,
        credits: true,
      },
    })

    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error('Update credits error:', error)
    return NextResponse.json(
      { error: 'Failed to update credits' },
      { status: 500 }
    )
  }
}
