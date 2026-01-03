import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getCurrentUser } from '@/lib/auth/session'

// Mock Prisma
const mockUser = {
  id: 'test-user-id',
  email: 'test@test.com',
  name: 'Test User',
  isAdmin: true,
  createdAt: new Date(),
}

vi.mock('@/lib/db', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
    session: {
      findUnique: vi.fn(),
    },
  },
}))

vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
    get: vi.fn(),
    set: vi.fn(),
    delete: vi.fn(),
  })),
}))

vi.mock('jsonwebtoken', () => ({
  default: {
    sign: vi.fn(() => 'mocked-token'),
    verify: vi.fn(() => ({
      userId: 'test-user-id',
      email: 'test@test.com',
    })),
  },
  sign: vi.fn(() => 'mocked-token'),
  verify: vi.fn(() => ({
    userId: 'test-user-id',
    email: 'test@test.com',
  })),
}))

describe('Session Management', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getCurrentUser', () => {
    it('should include isAdmin field in user data', async () => {
      // This test ensures that the isAdmin field is properly selected
      // and prevents the Prisma schema mismatch error
      const { prisma } = await import('@/lib/db')
      const { cookies } = await import('next/headers')

      // Mock authenticated session
      vi.mocked(cookies).mockReturnValue({
        get: vi.fn(() => ({ value: 'valid-token' })),
        set: vi.fn(),
        delete: vi.fn(),
      } as any)

      vi.mocked(prisma.session.findUnique).mockResolvedValue({
        id: 'session-id',
        userId: 'test-user-id',
        token: 'valid-token',
        expiresAt: new Date(Date.now() + 1000000),
        createdAt: new Date(),
      } as any)

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as any)

      const user = await getCurrentUser()

      expect(user).toBeDefined()
      expect(user).toHaveProperty('id')
      expect(user).toHaveProperty('email')
      expect(user).toHaveProperty('name')
      expect(user).toHaveProperty('isAdmin')
      expect(user).toHaveProperty('createdAt')

      // Verify Prisma was called with correct select clause
      expect(prisma.user.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({
          select: expect.objectContaining({
            id: true,
            email: true,
            name: true,
            isAdmin: true,
            createdAt: true,
          }),
        })
      )
    })

    it('should return null when not authenticated', async () => {
      const { cookies } = await import('next/headers')

      vi.mocked(cookies).mockReturnValue({
        get: vi.fn(() => undefined),
        set: vi.fn(),
        delete: vi.fn(),
      } as any)

      const user = await getCurrentUser()

      expect(user).toBeNull()
    })

    it('should handle admin and non-admin users correctly', async () => {
      const { prisma } = await import('@/lib/db')
      const { cookies } = await import('next/headers')

      vi.mocked(cookies).mockReturnValue({
        get: vi.fn(() => ({ value: 'valid-token' })),
        set: vi.fn(),
        delete: vi.fn(),
      } as any)

      vi.mocked(prisma.session.findUnique).mockResolvedValue({
        id: 'session-id',
        userId: 'test-user-id',
        token: 'valid-token',
        expiresAt: new Date(Date.now() + 1000000),
        createdAt: new Date(),
      } as any)

      // Test admin user
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        ...mockUser,
        isAdmin: true,
      } as any)

      let user = await getCurrentUser()
      expect(user?.isAdmin).toBe(true)

      // Test non-admin user
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        ...mockUser,
        isAdmin: false,
      } as any)

      user = await getCurrentUser()
      expect(user?.isAdmin).toBe(false)
    })
  })
})
