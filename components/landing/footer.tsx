import { Heart } from 'lucide-react'

interface FooterLink {
  label: string
  href: string
}

interface FooterSection {
  title: string
  links: FooterLink[]
}

interface FooterProps {
  logo?: string
  description?: string
  sections?: FooterSection[]
}

export function Footer({
  logo = 'Logo',
  description = 'Your description here',
  sections = []
}: FooterProps) {
  return (
    <footer className="w-full border-t border-rose-100/50 bg-gradient-to-b from-white to-pink-50/30">
      <div className="container px-4 py-16 md:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-700 to-violet-600 flex items-center justify-center shadow-md">
                <Heart className="h-5 w-5 text-white fill-white" />
              </div>
              <h3 className="text-xl font-bold font-['Playfair_Display'] bg-gradient-to-r from-rose-700 to-violet-600 bg-clip-text text-transparent">
                {logo}
              </h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              {description}
            </p>
          </div>

          {sections.map((section, index) => (
            <div key={index} className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="text-sm text-gray-600 hover:text-rose-700 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-rose-100/50">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} {logo}. Made with{' '}
            <Heart className="inline h-3.5 w-3.5 text-rose-700 fill-rose-700" />{' '}
            for romance readers everywhere.
          </p>
        </div>
      </div>
    </footer>
  )
}
