import { Navbar } from '@/components/landing/navbar'
import { Footer } from '@/components/landing/footer'
import { FileText } from 'lucide-react'

export default function TermsPage() {
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
              <FileText className="h-4 w-4 text-rose-400" />
              <span className="text-sm text-rose-200 font-medium">Legal</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black mb-4 font-['Playfair_Display'] bg-gradient-to-r from-rose-400 via-pink-300 to-violet-400 bg-clip-text text-transparent">
              Terms of Service
            </h1>
            <p className="text-gray-400">
              Last updated: January 6, 2026
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-invert prose-rose max-w-none">
            <div className="bg-gray-900/50 border border-rose-900/30 rounded-2xl p-8 md:p-10 backdrop-blur-sm space-y-8">

              <section>
                <h2 className="text-2xl font-bold text-white mb-4 font-['Playfair_Display']">
                  Agreement to Terms
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  By accessing or using Silk, you agree to be bound by these Terms of Service and our Privacy Policy.
                  If you do not agree to these terms, you may not use our service. These terms apply to all users,
                  including free and premium subscribers.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4 font-['Playfair_Display']">
                  Eligibility
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  You must be at least 18 years old to use Silk. By creating an account, you represent that you meet
                  this age requirement. Silk contains mature romantic content that may not be suitable for minors.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4 font-['Playfair_Display']">
                  Account Registration
                </h2>
                <div className="space-y-4 text-gray-300">
                  <p className="leading-relaxed">
                    To access certain features, you must create an account. You agree to:
                  </p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Provide accurate and complete information</li>
                    <li>Maintain the security of your account credentials</li>
                    <li>Notify us immediately of any unauthorized access</li>
                    <li>Be responsible for all activity under your account</li>
                    <li>Not share your account with others</li>
                  </ul>
                  <p className="leading-relaxed">
                    We reserve the right to suspend or terminate accounts that violate these terms.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4 font-['Playfair_Display']">
                  Subscription and Payments
                </h2>
                <div className="space-y-4 text-gray-300">
                  <div>
                    <h3 className="text-lg font-semibold text-rose-400 mb-2">Free Tier</h3>
                    <p className="leading-relaxed">
                      The free tier provides unlimited access to our curated story library. No payment information
                      is required for free access.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-rose-400 mb-2">Premium Subscription</h3>
                    <p className="leading-relaxed">
                      Premium subscriptions are billed monthly at $9.99/month and include 3 custom story generation
                      credits per month. Subscriptions automatically renew unless canceled. You may cancel anytime,
                      and cancellation takes effect at the end of your current billing period.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-rose-400 mb-2">Add-On Credits</h3>
                    <p className="leading-relaxed">
                      Additional story generation credits can be purchased for $4.99 per credit. Credits never expire
                      and remain available even if you downgrade to free tier.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-rose-400 mb-2">Refund Policy</h3>
                    <p className="leading-relaxed">
                      If a story generation fails due to technical issues on our end, the credit will be automatically
                      refunded to your account. Subscription fees are non-refundable except as required by law. If you
                      experience issues with story quality, please contact support at support@silk-stories.com.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4 font-['Playfair_Display']">
                  Content and Intellectual Property
                </h2>
                <div className="space-y-4 text-gray-300">
                  <div>
                    <h3 className="text-lg font-semibold text-rose-400 mb-2">Curated Stories</h3>
                    <p className="leading-relaxed">
                      All stories in our curated library remain the property of Silk. You may read and enjoy these
                      stories for personal use but may not reproduce, distribute, or create derivative works without
                      written permission.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-rose-400 mb-2">Custom Generated Stories</h3>
                    <p className="leading-relaxed">
                      Stories you generate using our custom story feature are yours to keep and use for personal,
                      non-commercial purposes. You may not sell, publish commercially, or claim sole authorship of
                      AI-generated content. You acknowledge that similar stories may be generated for other users
                      based on similar prompts.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-rose-400 mb-2">Your Input</h3>
                    <p className="leading-relaxed">
                      By submitting custom story requests (character names, scenarios, etc.), you grant us the right
                      to use this input to generate your story. We will not share your specific custom requests with
                      other users, but we may use anonymized data to improve our AI models.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4 font-['Playfair_Display']">
                  Prohibited Uses
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  You agree not to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  <li>Use Silk for any illegal purpose or in violation of any laws</li>
                  <li>Generate content depicting minors in romantic or sexual situations</li>
                  <li>Generate content promoting violence, hate speech, or discrimination</li>
                  <li>Attempt to reverse engineer, hack, or compromise our systems</li>
                  <li>Use automated tools to scrape or download content in bulk</li>
                  <li>Resell, redistribute, or commercially exploit generated stories without permission</li>
                  <li>Impersonate others or provide false information</li>
                  <li>Interfere with other users' enjoyment of the service</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4 font-['Playfair_Display']">
                  Content Moderation
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  We reserve the right to review, moderate, or refuse custom story generation requests that violate
                  these terms or our content policies. Repeated violations may result in account suspension or
                  termination without refund.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4 font-['Playfair_Display']">
                  AI-Generated Content Disclaimer
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  All stories on Silk are generated using artificial intelligence (Claude Sonnet 4 and DALL-E 3).
                  While we strive for quality, AI-generated content may occasionally contain errors, inconsistencies,
                  or unexpected outputs. We do not guarantee that every story will meet your expectations. Stories
                  are provided "as is" without warranties of any kind.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4 font-['Playfair_Display']">
                  Limitation of Liability
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  To the maximum extent permitted by law, Silk and its operators shall not be liable for any indirect,
                  incidental, special, consequential, or punitive damages arising from your use of the service. Our
                  total liability for any claim related to Silk shall not exceed the amount you paid us in the past
                  12 months, or $100, whichever is greater.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4 font-['Playfair_Display']">
                  Service Availability
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  We strive to maintain continuous service availability but cannot guarantee uninterrupted access.
                  We may suspend service temporarily for maintenance, updates, or due to circumstances beyond our
                  control. We are not liable for any losses resulting from service interruptions.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4 font-['Playfair_Display']">
                  Termination
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  You may terminate your account at any time through your account settings. We may suspend or
                  terminate your account immediately if you violate these terms, without prior notice or refund.
                  Upon termination, your right to access Silk ceases immediately.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4 font-['Playfair_Display']">
                  Changes to Terms
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  We may modify these terms at any time. We will provide notice of material changes by email or
                  through the platform. Continued use of Silk after changes constitutes acceptance of the modified
                  terms. If you do not agree to the changes, you should discontinue use and cancel your subscription.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4 font-['Playfair_Display']">
                  Governing Law
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  These terms are governed by and construed in accordance with the laws of the jurisdiction where
                  Silk operates, without regard to conflict of law principles. Any disputes shall be resolved in
                  the courts of that jurisdiction.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4 font-['Playfair_Display']">
                  Severability
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  If any provision of these terms is found to be invalid or unenforceable, the remaining provisions
                  will continue in full force and effect.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4 font-['Playfair_Display']">
                  Contact Information
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  If you have questions about these Terms of Service, please contact us:
                </p>
                <div className="mt-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                  <p className="text-gray-300">
                    Email: <a href="mailto:legal@silk-stories.com" className="text-rose-400 hover:text-rose-300">legal@silk-stories.com</a>
                  </p>
                  <p className="text-gray-300 mt-2">
                    Support: <a href="mailto:support@silk-stories.com" className="text-rose-400 hover:text-rose-300">support@silk-stories.com</a>
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
