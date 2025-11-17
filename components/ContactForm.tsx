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

    try {
      // Submit via API route (server-side handles Web3Forms with WEB3FORMS_ACCESS_KEY)
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: formEmail.trim(),
          message: message.trim(),
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
    <div className="relative space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
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
          <label htmlFor="name" className="block text-sm font-medium text-white/90 mb-2">
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
              'w-full px-4 py-3 rounded-md',
              'bg-white/10 border border-white/20 backdrop-blur-sm',
              'focus:border-accent-2 focus:outline-none focus:ring-2 focus:ring-accent-2/30',
              'text-white placeholder:text-white/50',
              'transition-colors',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'min-h-[44px]'
            )}
            placeholder="Your name"
          />
        </div>

        <div>
          <label htmlFor="form-email" className="block text-sm font-medium text-white/90 mb-2">
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
              'w-full px-4 py-3 rounded-md',
              'bg-white/10 border border-white/20 backdrop-blur-sm',
              'focus:border-accent-2 focus:outline-none focus:ring-2 focus:ring-accent-2/30',
              'text-white placeholder:text-white/50',
              'transition-colors',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'min-h-[44px]'
            )}
            placeholder="your.email@example.com"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-white/90 mb-2">
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
            rows={6}
            className={cn(
              'w-full px-4 py-3 rounded-md',
              'bg-white/10 border border-white/20 backdrop-blur-sm',
              'focus:border-accent-2 focus:outline-none focus:ring-2 focus:ring-accent-2/30',
              'text-white placeholder:text-white/50',
              'transition-colors resize-none',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
            placeholder="Your message... (Press Enter to send, Shift+Enter for new line)"
          />
        </div>

        <button
          type="submit"
          disabled={status === 'submitting'}
          className={cn(
            'w-full md:w-auto px-8 py-4 rounded-md',
            'bg-accent text-text font-bold text-base',
            'hover:bg-accent/90 transition-colors shadow-md',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'flex items-center justify-center gap-2',
            'min-h-[44px]'
          )}
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
              'fixed bottom-24 left-1/2 -translate-x-1/2 z-modal',
              'px-6 py-4 rounded-md shadow-md',
              'flex items-center gap-3',
              'min-w-[280px] max-w-md',
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
            <p className="text-sm font-medium">{toast.message}</p>
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

