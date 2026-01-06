import { Navbar } from '@/components/landing/navbar'
import { Footer } from '@/components/landing/footer'
import { Heart, Sparkles, Wand2, BookOpen } from 'lucide-react'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-black via-gray-900 to-black">
      <Navbar
        logo="Silk"
        links={[
          { href: '/stories', label: 'Browse Stories' },
          { href: '/#features', label: 'Features' },
          { href: '/#pricing', label: 'Pricing' },
        ]}
      />

      <main className="flex-1 py-20">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-950/30 backdrop-blur-sm rounded-full border border-rose-800/30 mb-6">
              <Heart className="h-4 w-4 text-rose-400 fill-rose-400" />
              <span className="text-sm text-rose-200 font-medium">About Silk</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black mb-6 font-['Playfair_Display'] bg-gradient-to-r from-rose-400 via-pink-300 to-violet-400 bg-clip-text text-transparent">
              Romance Reimagined
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Where AI meets passion to create unforgettable love stories, tailored just for you
            </p>
          </div>

          {/* Story Sections */}
          <div className="space-y-12">
            {/* Our Mission */}
            <section className="bg-gray-900/50 border border-rose-900/30 rounded-2xl p-8 md:p-10 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="h-6 w-6 text-rose-500" />
                <h2 className="text-3xl font-bold text-white font-['Playfair_Display']">
                  Our Mission
                </h2>
              </div>
              <p className="text-gray-300 leading-relaxed text-lg mb-4">
                At Silk, we believe every reader deserves a romance story that speaks directly to their heart.
                Traditional publishing can't cater to every fantasy, every desire, every unique preference—but we can.
              </p>
              <p className="text-gray-300 leading-relaxed text-lg">
                We're revolutionizing romance storytelling by combining the artistry of professional romance writing
                with the power of advanced AI technology. The result? Stories that feel hand-crafted for you,
                delivered in minutes instead of months.
              </p>
            </section>

            {/* How It Works */}
            <section className="bg-gray-900/50 border border-rose-900/30 rounded-2xl p-8 md:p-10 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <Wand2 className="h-6 w-6 text-violet-500" />
                <h2 className="text-3xl font-bold text-white font-['Playfair_Display']">
                  The Magic Behind Silk
                </h2>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-rose-400 mb-2">
                    Curated Excellence
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    Our free library features carefully curated romance stories across all genres—from sweet contemporary
                    to scorching paranormal. Every story is crafted using Claude Sonnet 4, one of the most advanced AI
                    language models, trained to understand the nuances of romantic storytelling.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-rose-400 mb-2">
                    Your Story, Your Way
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    Premium members can generate custom stories tailored to their exact preferences. Choose your character
                    names, favorite tropes, plot scenarios, and heat level. Our AI understands what makes romance compelling—the
                    tension, the chemistry, the emotional depth—and delivers stories that rival traditionally published novels.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-rose-400 mb-2">
                    Quality Guaranteed
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    Each generated story is 6,000-8,000 words of professionally structured romance, complete with character
                    development, plot progression, and satisfying emotional payoffs. We even generate custom cover art using
                    DALL-E 3 to make your story feel complete.
                  </p>
                </div>
              </div>
            </section>

            {/* Our Values */}
            <section className="bg-gray-900/50 border border-rose-900/30 rounded-2xl p-8 md:p-10 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <Heart className="h-6 w-6 text-rose-500" />
                <h2 className="text-3xl font-bold text-white font-['Playfair_Display']">
                  What We Stand For
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Inclusivity</h3>
                  <p className="text-gray-400">
                    Romance is for everyone. We celebrate diversity in characters, relationships, and storylines.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Privacy</h3>
                  <p className="text-gray-400">
                    Your reading preferences are personal. We never share your data or custom story requests.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Quality</h3>
                  <p className="text-gray-400">
                    Every story meets our high standards for emotional depth, character chemistry, and narrative flow.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Innovation</h3>
                  <p className="text-gray-400">
                    We're constantly improving our AI to deliver better, more emotionally resonant stories.
                  </p>
                </div>
              </div>
            </section>

            {/* The Team */}
            <section className="bg-gray-900/50 border border-rose-900/30 rounded-2xl p-8 md:p-10 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="h-6 w-6 text-violet-500" />
                <h2 className="text-3xl font-bold text-white font-['Playfair_Display']">
                  Built by Romance Lovers
                </h2>
              </div>
              <p className="text-gray-300 leading-relaxed text-lg mb-4">
                Silk was created by a team of technologists who are also voracious romance readers. We know what makes
                a great romance story because we've read thousands of them. We built Silk because we wanted a way to
                explore new scenarios, tropes, and characters without waiting for the publishing industry to catch up
                to our imagination.
              </p>
              <p className="text-gray-300 leading-relaxed text-lg">
                We're a small team passionate about bringing cutting-edge AI technology to the romance community in a
                way that enhances—not replaces—the artistry of storytelling.
              </p>
            </section>

            {/* CTA */}
            <div className="text-center pt-8">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-rose-700 to-violet-700 hover:from-rose-600 hover:to-violet-600 text-white font-bold rounded-xl shadow-lg shadow-rose-900/30 hover:shadow-rose-900/50 transition-all"
              >
                <Heart className="h-5 w-5 fill-white" />
                Start Your Romance Journey
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer
        logo="Silk"
        description="AI-powered romance stories, perfectly crafted for you"
        sections={[
          {
            title: 'Stories',
            links: [
              { label: 'Browse Library', href: '/stories' },
              { label: 'Create Custom Story', href: '/generate' },
              { label: 'My Stories', href: '/my-stories' }
            ]
          },
          {
            title: 'Company',
            links: [
              { label: 'About', href: '/about' },
              { label: 'Features', href: '/#features' },
              { label: 'Pricing', href: '/#pricing' }
            ]
          },
          {
            title: 'Legal',
            links: [
              { label: 'Privacy Policy', href: '/privacy' },
              { label: 'Terms of Service', href: '/terms' }
            ]
          }
        ]}
      />
    </div>
  )
}
