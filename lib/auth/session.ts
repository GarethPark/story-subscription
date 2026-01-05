import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/db'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days

export interface SessionPayload {
  userId: string
  email: string
}

export async function createSession(userId: string, email: string): Promise<string> {
  // Create token
  const token = jwt.sign({ userId, email } as SessionPayload, JWT_SECRET, {
    expiresIn: '7d'
  })

  // Store in database
  const expiresAt = new Date(Date.now() + SESSION_DURATION)
  await prisma.session.create({
    data: {
      userId,
      token,
      expiresAt
    }
  })

  // Set cookie
  const cookieStore = await cookies()
  cookieStore.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION / 1000,
    path: '/'
  })

  return token
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('session')?.value

  if (!token) return null

  try {
    // Verify JWT
    const payload = jwt.verify(token, JWT_SECRET) as SessionPayload

    // Check if session exists in database
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true }
    })

    if (!session || session.expiresAt < new Date()) {
      await deleteSession()
      return null
    }

    return payload
  } catch (error) {
    console.error('Session verification error:', error)
    return null
  }
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies()
  const token = cookieStore.get('session')?.value

  if (token) {
    // Delete from database
    await prisma.session.deleteMany({
      where: { token }
    })
  }

  // Clear cookie
  cookieStore.delete('session')
}

export async function getCurrentUser() {
  const session = await getSession()
  if (!session) return null

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      email: true,
      name: true,
      isAdmin: true,
      credits: true,
      createdAt: true
    }
  })

  return user
}
