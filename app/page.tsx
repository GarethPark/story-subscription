import { Navbar } from '@/components/landing/navbar'
import { Hero } from '@/components/landing/hero'
import { Features } from '@/components/landing/features'
import { Testimonials } from '@/components/landing/testimonials'
import { Pricing } from '@/components/landing/pricing'
import { Footer } from '@/components/landing/footer'
import { Heart, Sparkles, BookOpen, Wand2, Library, Flame } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        logo="Silk"
        links={[
          { href: '/stories', label: 'Browse Stories' },
          { href: '#features', label: 'Features' },
          { href: '#pricing', label: 'Pricing' },
        ]}
      />

      <main className="flex-1">
        <Hero
          title="Surrender to Desire"
          subtitle="Indulge in stories where passion ignites, boundaries blur, and every moment leaves you craving more."
          ctaText="Start Reading Free"
          ctaLink="/stories"
          secondaryCtaText="Create Your Fantasy"
          secondaryCtaLink="/signup"
        />

        <Features
          title="Fall in Love with Every Story"
          subtitle="Experience romance storytelling reimagined for the modern reader"
          features={[
            {
              icon: <Library className="h-10 w-10 text-rose-700" />,
              title: 'Curated Library',
              description: 'Access dozens of expertly crafted romance stories across all genres and heat levels'
            },
            {
              icon: <Wand2 className="h-10 w-10 text-violet-600" />,
              title: 'Custom Generation',
              description: 'Create personalized stories with your dream characters, favorite tropes, and unique scenarios'
            },
            {
              icon: <Flame className="h-10 w-10 text-amber-500" />,
              title: 'All Heat Levels',
              description: 'From sweet kisses to scorching passion - find the perfect temperature for your mood'
            },
            {
              icon: <Heart className="h-10 w-10 text-pink-500" />,
              title: 'Favorite Tropes',
              description: 'Enemies to lovers, second chance, forced proximity - all your beloved romance tropes'
            },
            {
              icon: <BookOpen className="h-10 w-10 text-indigo-600" />,
              title: 'Quality Writing',
              description: 'Every story crafted by advanced AI to deliver professional romance novel quality'
            },
            {
              icon: <Sparkles className="h-10 w-10 text-amber-400" />,
              title: 'Instant Access',
              description: 'New stories generated in minutes, available immediately on any device'
            }
          ]}
        />

        <Testimonials
          title="Real Readers, Real Stories"
          subtitle="See how Silk Stories is transforming reading experiences"
          testimonials={[
            {
              id: '1',
              name: 'Sarah M.',
              quote: 'I used to dread my daily commute on the tube, but now it\'s my favorite part of the day. These stories make the journey fly by!',
              impact: 'Takes the boredom out of train rides'
            },
            {
              id: '2',
              name: 'Jessica T.',
              quote: 'As a busy mum, I barely had time for myself. Now I get 20 minutes before bed to escape into these amazing stories. It\'s my little indulgence.',
              impact: 'Helps me get excited again before bed'
            },
            {
              id: '3',
              name: 'Emma K.',
              quote: 'My husband and I were stuck in a rut. I started sharing some of the steamier stories with him and... wow. It\'s like we\'re newlyweds again!',
              impact: 'Breathes life back into marriage'
            },
            {
              id: '4',
              name: 'Rachel P.',
              quote: 'I\'ve read romance novels for years, but the custom stories here are on another level. Being able to create exactly what I want to read? Game changer.',
              impact: 'My perfect stories, every time'
            },
            {
              id: '5',
              name: 'Lauren W.',
              quote: 'The quality is incredible. I was skeptical about AI-written stories, but these have genuine emotion, chemistry, and heat. I\'m hooked!',
              impact: 'Professional quality, instant gratification'
            },
            {
              id: '6',
              name: 'Amanda H.',
              quote: 'Long-haul flights used to be torture. Now I look forward to them because I can binge read guilt-free. Downloaded 10 stories for my last trip!',
              impact: 'Makes travel time enjoyable'
            }
          ]}
        />

        <div id="pricing">
          <Pricing
            title="Choose Your Romance Journey"
            subtitle="Start free, upgrade anytime for custom stories"
            tiers={[
              {
                name: 'Free',
                price: '$0',
                description: 'Perfect for discovering your new favorite stories',
                features: [
                  'Access to curated story library',
                  'All genres and heat levels',
                  'New stories added weekly',
                  'Save favorites',
                  'Reading history'
                ],
                cta: 'Start Reading',
                ctaLink: '/signup'
              },
              {
                name: 'Premium',
                price: '$9.99',
                period: '/month',
                description: 'For readers who want their own personalized stories',
                features: [
                  'Everything in Free',
                  '3 custom story credits per month',
                  'Personalize characters & scenarios',
                  '6,000-8,000 word stories',
                  'Priority generation',
                  'Early access to new features'
                ],
                cta: 'Go Premium',
                ctaLink: '/signup',
                popular: true
              },
              {
                name: 'Add-On Credits',
                price: '$4.99',
                period: '/story',
                description: 'Need more custom stories?',
                features: [
                  'One-time purchase',
                  'Never expires',
                  'Full customization',
                  'Same premium quality',
                  'Stack unlimited credits'
                ],
                cta: 'Buy Credits',
                ctaLink: '/signup'
              }
            ]}
          />
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
              { label: 'Features', href: '#features' },
              { label: 'Pricing', href: '#pricing' },
              { label: 'Feedback', href: '/feedback' }
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
