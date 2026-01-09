import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { filename: string } }
) {
  const filename = params.filename

  // Fetch from GitHub
  const githubUrl = `https://raw.githubusercontent.com/GarethPark/story-subscription/main/public/covers/${filename}`

  const response = await fetch(githubUrl)

  if (!response.ok) {
    return new NextResponse('Image not found', { status: 404 })
  }

  const imageBuffer = await response.arrayBuffer()

  return new NextResponse(imageBuffer, {
    headers: {
      'Content-Type': response.headers.get('content-type') || 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
