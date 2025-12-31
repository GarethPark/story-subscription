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
    <footer className="w-full border-t bg-slate-50">
      <div className="container px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">{logo}</h3>
            <p className="text-sm text-slate-500">
              {description}
            </p>
          </div>

          {sections.map((section, index) => (
            <div key={index} className="space-y-3">
              <h4 className="text-sm font-semibold">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t pt-8">
          <p className="text-center text-sm text-slate-500">
            © {new Date().getFullYear()} {logo}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
