import { Navbar } from '@/components/landing/navbar'
import { Footer } from '@/components/landing/footer'
import { Shield } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Read our privacy policy to learn how Silk collects, uses, and protects your personal information.'
}

export default function PrivacyPage() {
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
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-950/30 backdrop-blur-sm rounded-full border border-rose-800/30 mb-6">
              <Shield className="h-4 w-4 text-rose-400" />
              <span className="text-sm text-rose-200 font-medium">Legal</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black mb-4 font-['Playfair_Display'] bg-gradient-to-r from-rose-400 via-pink-300 to-violet-400 bg-clip-text text-transparent">
              Privacy Policy
            </h1>
            <p className="text-gray-400">
              Last updated: January 6, 2026
            </p>
          </div>

          {/* Content */}
          <div className="text-left">
            <div className="bg-gray-900/50 border border-rose-900/30 rounded-2xl p-8 md:p-10 backdrop-blur-sm space-y-8">

              <section>
                <h2 className="text-2xl font-bold text-white mb-4 font-['Playfair_Display']">
                  Introduction
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  Welcome to Silk. We respect your privacy and are committed to protecting your personal data.
                  This privacy policy explains how we collect, use, and safeguard your information when you use
                  our romance story platform.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4 font-['Playfair_Display']">
                  Information We Collect
                </h2>
                <div className="space-y-4 text-gray-300">
                  <div>
                    <h3 className="text-lg font-semibold text-rose-400 mb-2">Account Information</h3>
                    <p className="leading-relaxed">
                      When you create an account, we collect your email address, name (optional), and password
                      (stored securely using industry-standard encryption).
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-rose-400 mb-2">Story Preferences</h3>
                    <p className="leading-relaxed">
                      We store your story generation requests, including character names, plot scenarios, genre
                      preferences, and heat level choices to provide our custom story service.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-rose-400 mb-2">Usage Data</h3>
                    <p className="leading-relaxed">
                      We collect information about how you interact with our platform, including stories read,
                      favorites saved, and generation history.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-rose-400 mb-2">Payment Information</h3>
                    <p className="leading-relaxed">
                      If you purchase a premium subscription or credits, payment processing is handled securely
                      by Stripe. We do not store your full credit card details.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4 font-['Playfair_Display']">
                  How We Use Your Information
                </h2>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  <li>To provide and maintain our story generation and reading services</li>
                  <li>To personalize your experience and generate custom stories</li>
                  <li>To process payments and manage your subscription</li>
                  <li>To send you important updates about your account or service changes</li>
                  <li>To improve our AI models and story quality (using anonymized data)</li>
                  <li>To prevent fraud and ensure platform security</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4 font-['Playfair_Display']">
                  Data Sharing and Third Parties
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  We do not sell your personal information. We may share data with:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  <li>
                    <strong className="text-white">Anthropic (Claude AI):</strong> Story generation requests are
                    sent to Claude's API to generate your custom stories. Anthropic's privacy policy applies to
                    this processing.
                  </li>
                  <li>
                    <strong className="text-white">OpenAI (DALL-E 3):</strong> Cover image generation requests
                    for visual story covers.
                  </li>
                  <li>
                    <strong className="text-white">Stripe:</strong> Payment processing for subscriptions and
                    credit purchases.
                  </li>
                  <li>
                    <strong className="text-white">Hosting providers:</strong> To store and deliver your content
                    securely.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4 font-['Playfair_Display']">
                  Your Privacy Rights
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  <li>Access your personal data and story generation history</li>
                  <li>Request correction of inaccurate information</li>
                  <li>Delete your account and associated data</li>
                  <li>Export your custom stories and favorites</li>
                  <li>Opt out of marketing communications</li>
                  <li>Withdraw consent for data processing</li>
                </ul>
                <p className="text-gray-300 leading-relaxed mt-4">
                  To exercise these rights, contact us at privacy@silk-stories.com
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4 font-['Playfair_Display']">
                  Data Security
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  We implement industry-standard security measures to protect your data, including encryption
                  in transit (HTTPS/TLS), encrypted password storage (bcrypt), secure session management, and
                  regular security audits. However, no method of transmission over the internet is 100% secure,
                  and we cannot guarantee absolute security.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4 font-['Playfair_Display']">
                  Data Retention
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  We retain your account data and generated stories as long as your account is active. If you
                  delete your account, we will permanently remove your personal information within 30 days,
                  except where we are legally required to retain it.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4 font-['Playfair_Display']">
                  Cookies and Tracking
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  We use essential cookies for authentication and session management. We do not use third-party
                  advertising cookies or tracking pixels. You can control cookies through your browser settings,
                  but disabling essential cookies may affect platform functionality.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4 font-['Playfair_Display']">
                  Children's Privacy
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  Silk is intended for users 18 years and older. We do not knowingly collect information from
                  minors. If we discover that a minor has provided personal information, we will delete it
                  immediately.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4 font-['Playfair_Display']">
                  International Users
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  Your information may be transferred to and processed in countries other than your own. By using
                  Silk, you consent to such transfers. We ensure appropriate safeguards are in place for
                  international data transfers.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4 font-['Playfair_Display']">
                  Changes to This Policy
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  We may update this privacy policy from time to time. We will notify you of significant changes
                  by email or through a prominent notice on our platform. Continued use of Silk after changes
                  constitutes acceptance of the updated policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4 font-['Playfair_Display']">
                  Contact Us
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  If you have questions about this privacy policy or our data practices, please contact us at:
                </p>
                <div className="mt-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                  <p className="text-gray-300">
                    Email: <a href="mailto:privacy@silk-stories.com" className="text-rose-400 hover:text-rose-300">privacy@silk-stories.com</a>
                  </p>
                  <p className="text-gray-300 mt-2">
                    Silk Romance Stories<br />
                    AI-Powered Storytelling Platform
                  </p>
                </div>
              </section>

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
