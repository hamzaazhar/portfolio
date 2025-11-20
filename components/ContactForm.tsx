'use client'

import { useState, FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, AlertCircle, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ContactFormProps {
  email?: string
  linkedin?: string
}

export function ContactForm({ email, linkedin }: ContactFormProps) {
  const [name, setName] = useState('')
  const [formEmail, setFormEmail] = useState('')
  const [message, setMessage] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const WEB3FORMS_ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || ''

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    submitForm()
  }

  const submitForm = async () => {
    setStatus('submitting')
    setErrorMessage('')
    setToast(null)

    // Honeypot check
    if (honeypot) {
      return // Silent fail for bots
    }

    if (!name.trim() || !formEmail.trim() || !message.trim()) {
      setStatus('error')
      setErrorMessage('Please fill in all fields.')
      setToast({ type: 'error', message: 'Please fill in all fields.' })
      return
    }

    if (!validateEmail(formEmail)) {
      setStatus('error')
      setErrorMessage('Please enter a valid email address.')
      setToast({ type: 'error', message: 'Please enter a valid email address.' })
      return
    }

    if (!WEB3FORMS_ACCESS_KEY) {
      setStatus('error')
      setErrorMessage('Form configuration error. Please contact the site administrator.')
      setToast({ type: 'error', message: 'Form configuration error. Please contact the site administrator.' })
      return
    }

    try {
      // Submit directly to Web3Forms from client-side
      // This avoids Cloudflare challenges that block server-side requests
      // Access keys are domain-locked, so client-side exposure is safe
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          name: name.trim(),
          email: formEmail.trim(),
          message: message.trim(),
          subject: 'Portfolio Contact Form Submission',
          from_name: name.trim(),
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setStatus('success')
        setName('')
        setFormEmail('')
        setMessage('')
        setHoneypot('')
        setToast({ type: 'success', message: 'Message sent successfully! I\'ll get back to you soon.' })
        
        // Auto-dismiss toast and reset status after 5 seconds
        setTimeout(() => {
          setToast(null)
          setStatus('idle')
        }, 5000)
      } else {
        throw new Error(data.message || 'Failed to send message')
      }
    } catch (error) {
      setStatus('error')
      const errorMsg = error instanceof Error ? error.message : 'Failed to send message. Please try again.'
      setErrorMessage(errorMsg)
      setToast({ type: 'error', message: errorMsg })
      
      // Auto-dismiss toast after 5 seconds
      setTimeout(() => {
        setToast(null)
        setStatus('idle')
      }, 5000)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit form on Enter (but allow Shift+Enter for new lines)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submitForm()
    }
  }

  return (
    <div className="relative space-y-4 sm:space-y-5 md:space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
        {/* Honeypot field - hidden from users */}
        <input
          type="text"
          name="website"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          className="sr-only"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />
        <div>
          <label htmlFor="name" className="block font-medium text-white/90 mb-1.5 sm:mb-2" style={{ fontSize: 'clamp(13px, 1.1vw, 14px)' }}>
            Name <span className="text-accent">*</span>
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            aria-required="true"
            disabled={status === 'submitting'}
            className={cn(
              'w-full rounded-md',
              'bg-white/10 border border-white/20 backdrop-blur-sm',
              'focus:border-accent-2 focus:outline-none focus:ring-2 focus:ring-accent-2/30',
              'text-white placeholder:text-white/50',
              'transition-colors',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'px-3 py-2.5 sm:px-4 sm:py-3',
              'text-sm sm:text-base',
              'min-h-[44px]'
            )}
            placeholder="Your name"
          />
        </div>

        <div>
          <label htmlFor="form-email" className="block font-medium text-white/90 mb-1.5 sm:mb-2" style={{ fontSize: 'clamp(13px, 1.1vw, 14px)' }}>
            Email <span className="text-accent">*</span>
          </label>
          <input
            type="email"
            id="form-email"
            value={formEmail}
            onChange={(e) => setFormEmail(e.target.value)}
            required
            aria-required="true"
            disabled={status === 'submitting'}
            className={cn(
              'w-full rounded-md',
              'bg-white/10 border border-white/20 backdrop-blur-sm',
              'focus:border-accent-2 focus:outline-none focus:ring-2 focus:ring-accent-2/30',
              'text-white placeholder:text-white/50',
              'transition-colors',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'px-3 py-2.5 sm:px-4 sm:py-3',
              'text-sm sm:text-base',
              'min-h-[44px]'
            )}
            placeholder="your.email@example.com"
          />
        </div>

        <div>
          <label htmlFor="message" className="block font-medium text-white/90 mb-1.5 sm:mb-2" style={{ fontSize: 'clamp(13px, 1.1vw, 14px)' }}>
            Message <span className="text-accent">*</span>
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            required
            aria-required="true"
            disabled={status === 'submitting'}
            rows={5}
            className={cn(
              'w-full rounded-md',
              'bg-white/10 border border-white/20 backdrop-blur-sm',
              'focus:border-accent-2 focus:outline-none focus:ring-2 focus:ring-accent-2/30',
              'text-white placeholder:text-white/50',
              'transition-colors resize-none',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'px-3 py-2.5 sm:px-4 sm:py-3',
              'text-sm sm:text-base'
            )}
            placeholder="Your message... (Press Enter to send, Shift+Enter for new line)"
          />
        </div>

        <button
          type="submit"
          disabled={status === 'submitting'}
          className={cn(
            'w-full sm:w-auto rounded-md',
            'bg-accent text-text font-bold',
            'hover:bg-accent/90 transition-colors shadow-md',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'flex items-center justify-center gap-2',
            'px-6 py-3 sm:px-8 sm:py-3.5 md:px-8 md:py-4',
            'text-sm sm:text-base',
            'min-h-[44px]'
          )}
          aria-label={status === 'submitting' ? 'Sending message' : 'Send message'}
        >
          {status === 'submitting' ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-4 h-4 border-2 border-text border-t-transparent rounded-full"
              />
              Sending...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Send Message
            </>
          )}
        </button>
      </form>

      {/* Toast notifications */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'fixed left-1/2 -translate-x-1/2 z-modal',
              'rounded-md shadow-md',
              'flex items-center gap-2 sm:gap-3',
              'px-4 py-3 sm:px-6 sm:py-4',
              'w-[calc(100%-2rem)] sm:w-auto sm:min-w-[280px] sm:max-w-md',
              'bottom-20 sm:bottom-24',
              toast.type === 'success'
                ? 'bg-accent text-text'
                : 'bg-accent-red text-surface'
            )}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <p className="font-medium" style={{ fontSize: 'clamp(12px, 1vw, 14px)' }}>{toast.message}</p>
            <button
              onClick={() => setToast(null)}
              className="ml-auto text-current opacity-70 hover:opacity-100"
              aria-label="Dismiss"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

