'use client'

import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { Menu, X, Heart } from 'lucide-react'

interface NavbarProps {
  logo?: string
  links?: { href: string; label: string }[]
}

export function Navbar({ logo = 'Logo', links = [] }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-rose-100/50 bg-white/95 backdrop-blur-lg shadow-sm supports-[backdrop-filter]:bg-white/80">
      <div className="container flex h-20 items-center px-4 md:px-6">
        <div className="mr-8 flex">
          <a href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-700 to-violet-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
              <Heart className="h-5 w-5 text-white fill-white" />
            </div>
            <span className="font-bold text-2xl font-['Playfair_Display'] bg-gradient-to-r from-rose-700 to-violet-600 bg-clip-text text-transparent">
              {logo}
            </span>
          </a>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:flex-1 md:items-center md:justify-between">
          <nav className="flex items-center space-x-8 text-sm font-medium">
            {links.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="transition-colors hover:text-rose-700 text-gray-600 font-semibold"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center space-x-3">
            <Button asChild variant="ghost" size="sm">
              <a href="/login">Log in</a>
            </Button>
            <Button asChild size="sm">
              <a href="/signup">Start Free</a>
            </Button>
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="flex flex-1 items-center justify-end md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-700"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-rose-100/50 bg-white">
          <div className="container px-4 py-6 space-y-4">
            {links.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="block py-3 text-gray-700 hover:text-rose-700 font-medium text-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="pt-4 space-y-3 border-t border-rose-100/50">
              <Button asChild variant="outline" className="w-full" size="lg">
                <a href="/login">Log in</a>
              </Button>
              <Button asChild className="w-full" size="lg">
                <a href="/signup">Start Free</a>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
