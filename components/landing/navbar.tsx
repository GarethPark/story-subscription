'use client'

import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

interface NavbarProps {
  logo?: string
  links?: { href: string; label: string }[]
}

export function Navbar({ logo = 'Logo', links = [] }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center px-4">
        <div className="mr-4 flex">
          <a href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold text-xl">{logo}</span>
          </a>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:flex-1 md:items-center md:justify-between">
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {links.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="transition-colors hover:text-slate-900 text-slate-600"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <Button asChild variant="ghost" size="sm">
              <a href="/login">Log in</a>
            </Button>
            <Button asChild size="sm">
              <a href="/signup">Sign up</a>
            </Button>
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="flex flex-1 items-center justify-end md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container px-4 py-4 space-y-3">
            {links.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="block py-2 text-slate-600 hover:text-slate-900"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="pt-4 space-y-2">
              <Button asChild variant="outline" className="w-full">
                <a href="/login">Log in</a>
              </Button>
              <Button asChild className="w-full">
                <a href="/signup">Sign up</a>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
