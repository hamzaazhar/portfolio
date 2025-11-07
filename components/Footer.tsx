'use client'

import { Linkedin, Mail, Phone } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FooterProps {
  contact: {
    phone: string
    email: string
    linkedin: string
  }
}

export function Footer({ contact }: FooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer 
      className="fixed bottom-0 left-0 right-0 z-header border-t-2 border-gray-400 bg-bg-dark text-white backdrop-blur-xl shadow-2xl transform-none opacity-100 visible" 
      style={{ 
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        opacity: 1,
        visibility: 'visible',
        transform: 'none',
        borderTopColor: '#9ca3af', 
        borderTopWidth: '2px' 
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2">
          <div className="text-center md:text-left">
            <p className="text-xs text-white/70">
              © {currentYear} Rana Muhammad Hamza
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={`tel:${contact.phone}`}
              className="flex items-center gap-1.5 text-xs text-white/70 hover:text-accent-yellow transition-colors"
              aria-label="Phone"
            >
              <Phone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{contact.phone}</span>
            </a>
            <a
              href={`mailto:${contact.email}`}
              className="flex items-center gap-1.5 text-xs text-white/70 hover:text-accent-yellow transition-colors"
              aria-label="Email"
            >
              <Mail className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{contact.email}</span>
            </a>
            <a
              href={contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-white/70 hover:text-accent-yellow transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">LinkedIn</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

