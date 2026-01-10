import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { hashPassword } from '@/lib/auth/password'
import { createSession } from '@/lib/auth/session'
import { sendWelcomeEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true
      }
    })

    // Create session
    await createSession(user.id, user.email)

    // Send welcome email
    if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 'your-resend-api-key-here') {
      try {
        await sendWelcomeEmail({
          to: user.email,
          userName: user.name || 'Reader',
        })
        console.log(`Welcome email sent to ${user.email}`)
      } catch (emailError) {
        // Don't fail signup if email fails
        console.error('Failed to send welcome email:', emailError)
      }
    }

    return NextResponse.json(
      {
        success: true,
        user
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'An error occurred during signup' },
      { status: 500 }
    )
  }
}
