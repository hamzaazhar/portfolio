'use client'

import { useState, useEffect } from 'react'
import { Footer } from '@/components/Footer'
import { Section } from '@/components/Section'
import { Heading } from '@/components/Heading'
import { HeroGrid } from '@/components/HeroGridEnhanced'
import { ValuePillars } from '@/components/ValuePillars'
import { CaseCardRevamped } from '@/components/CaseCardRevamped'
import { ExpertiseClusters } from '@/components/ExpertiseClusters'
import { GrowthTimeline } from '@/components/GrowthTimeline'
import { ContactForm } from '@/components/ContactForm'
import { Card } from '@/components/Card'
import { GeometricShape } from '@/components/GeometricShape'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { SectionDivider } from '@/components/SectionDivider'
import { motion } from 'framer-motion'
import type { Profile } from '@/types/profile'

function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const [year, month] = dateStr.split('-')
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${monthNames[parseInt(month, 10) - 1]} ${year}`
}

export default function Home() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Disable scroll restoration globally and prevent initial scroll to top
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
    
    // If there's a hash, prevent scroll to top immediately
    const hash = window.location.hash
    if (hash) {
      // Keep scroll at current position (0) until we can scroll to target
      window.scrollTo(0, 0)
    }
  }, [])

  useEffect(() => {
    // Fetch profile data on client side
    fetch('/api/profile')
      .then((res) => res.json())
      .then((data) => {
        setProfile(data)
        setIsLoading(false)
      })
      .catch((err) => {
        console.error('Failed to load profile:', err)
        setIsLoading(false)
      })
  }, [])

  // Handle hash navigation when coming from another page - scroll directly to target
  useEffect(() => {
    if (!isLoading && profile) {
      const hash = window.location.hash
      if (hash) {
        // Prevent any scroll to top by immediately checking and scrolling
        const scrollToTarget = () => {
          const sectionId = hash.substring(1) // Remove the #
          const element = document.getElementById(sectionId)
          if (element) {
            // Calculate position with header offset using getBoundingClientRect for accuracy
            const headerHeight = 64
            const rect = element.getBoundingClientRect()
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop
            const elementTop = rect.top + scrollTop
            const offsetPosition = Math.max(0, elementTop - headerHeight)

            // Use instant scroll (no smooth) to go directly to section without showing hero
            // Use both methods to ensure it works
            window.scrollTo(0, offsetPosition)
            document.documentElement.scrollTop = offsetPosition
            document.body.scrollTop = offsetPosition
            return true
          }
          return false
        }

        // Try immediately first
        if (scrollToTarget()) {
          return
        }

        // If not successful, try with requestAnimationFrame
        const timer1 = requestAnimationFrame(() => {
          if (scrollToTarget()) {
            return
          }
          const timer2 = requestAnimationFrame(() => {
            scrollToTarget()
          })
          return () => cancelAnimationFrame(timer2)
        })
        return () => cancelAnimationFrame(timer1)
      } else {
        // If no hash, ensure we're at the top (for direct navigation to home)
        window.scrollTo({ top: 0, behavior: 'auto' })
      }
    }
  }, [isLoading, profile])

  if (isLoading || !profile) {
    return <LoadingSpinner />
  }

  if (!profile.hero || !profile.pillars || !profile.caseStudies || !profile.expertiseClusters || !profile.growthTimeline || !profile.contactCopy) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-center">
          <div className="text-2xl font-heading font-bold text-text mb-2">Error</div>
          <div className="text-muted">Failed to load profile data</div>
        </div>
      </div>
    )
  }

  return (
    <>
      <main id="main-content" className="pb-24">
        {/* Hero Section - Light */}
        <Section id="hero" variant="light" accent="yellow" className="min-h-screen !pt-0" spacing={{ top: 24, bottom: 32 }}>
          <HeroGrid
            name={profile.name}
            headline={profile.hero.headline}
            subhead={profile.hero.subhead}
            microProof={profile.hero.microProof}
            metrics={profile.hero.metrics}
            ctas={profile.hero.ctas}
          />
        </Section>

        <SectionDivider color="light" />

        {/* Value Section - Value Pillars Only */}
        <Section id="value" variant="light" accent="yellow" eyebrow="How I Create Impact" spacing={{ top: 48, bottom: 40 }}>
          <div className="space-y-6 sm:space-y-8">
            <div className="text-center max-w-3xl mx-auto space-y-2 sm:space-y-3 px-4">
              <Heading>How I Create Organizational Impact</Heading>
              <p className="text-base sm:text-lg text-muted leading-relaxed">
                Three core approaches that drive measurable results across manufacturing operations.
              </p>
            </div>
            <ValuePillars pillars={profile.pillars} />
          </div>
        </Section>

        {/* Expertise Section - Separate */}
        <Section id="expertise" variant="light" accent="purple" eyebrow="Technical Expertise" spacing={{ top: 40, bottom: 40 }} className="bg-gradient-to-b from-bg to-bg-muted">
          <div className="space-y-6 sm:space-y-8">
            <div className="text-center max-w-3xl mx-auto space-y-2 sm:space-y-3 px-4">
              <Heading>Technical Capabilities</Heading>
              <p className="text-base sm:text-lg text-muted leading-relaxed">
                A comprehensive toolkit spanning data systems, analytics, and operational intelligence.
              </p>
            </div>
            <ExpertiseClusters clusters={profile.expertiseClusters} />
          </div>
        </Section>

        {/* Work Section - Case Studies - Revamped */}
        <Section id="work" variant="dark" accent="purple" eyebrow="Selected Projects" spacing={{ top: 40, bottom: 40 }} className="relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-1/4 left-10 w-72 h-72 bg-accent rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-accent-purple rounded-full blur-3xl" />
          </div>
          
          <div className="space-y-6 sm:space-y-8 relative z-10">
            <div className="text-center max-w-4xl mx-auto space-y-2 sm:space-y-3 px-4">
              <Heading className="text-white">Impact Case Studies</Heading>
              <p className="text-base sm:text-lg text-white/70 leading-relaxed max-w-3xl mx-auto">
                Real projects delivering measurable outcomes across manufacturing operations, from predictive analytics to workflow automation.
              </p>
            </div>
            
            <div className="grid gap-4 sm:gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto items-stretch">
              {profile.caseStudies.map((study, index) => (
                <CaseCardRevamped
                  key={index}
                  title={study.title}
                  context={study.context}
                  built={study.built}
                  outcome={study.outcome}
                  stack={study.stack}
                  accentColor={index % 3 === 0 ? 'yellow' : index % 3 === 1 ? 'purple' : 'red'}
                  delay={index * 0.08}
                />
              ))}
            </div>
          </div>
        </Section>

        {/* Growth Timeline Section - Light with subtle gradient */}
        <Section id="experience" variant="light" accent="yellow" eyebrow="Career Journey" spacing={{ top: 40, bottom: 40 }} className="bg-gradient-to-b from-bg-muted to-bg">
          <div className="space-y-6 sm:space-y-8">
            <div className="text-center max-w-3xl mx-auto space-y-2 sm:space-y-3 px-4">
              <Heading>Growth Timeline</Heading>
              <p className="text-base sm:text-lg text-muted leading-relaxed">
                A progression from foundational analytics to end-to-end digital transformation leadership.
              </p>
            </div>
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
              <GrowthTimeline items={profile.growthTimeline} />
            </div>
          </div>
        </Section>

        {/* Education Section - Dark */}
        <Section id="education" variant="dark" accent="red" eyebrow="Education" spacing={{ top: 40, bottom: 40 }}>
          <div className="space-y-6 sm:space-y-8">
            <div className="text-center max-w-3xl mx-auto space-y-2 sm:space-y-3 px-4">
              <div className="flex items-center justify-center gap-3 sm:gap-4 mb-2 sm:mb-3">
                <GeometricShape color="red" size={40} />
              </div>
              <Heading className="text-white">Education</Heading>
              <p className="text-base sm:text-lg text-white/70 leading-relaxed">
                Academic foundation in Computer Science and Data Science
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6 max-w-4xl mx-auto px-4 sm:px-6">
              {profile.education.map((edu, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="h-full"
                >
                  <Card accentColor={index % 2 === 0 ? 'yellow' : 'purple'} className="h-full bg-white/5 backdrop-blur-sm border-white/20 flex flex-col !p-4 sm:!p-5">
                    <h3 className="font-heading font-bold text-white mb-2 sm:mb-3" style={{ fontSize: 'clamp(16px, 1.8vw, 18px)' }}>
                      {edu.degree}
                    </h3>
                    <div className="mt-auto space-y-1">
                      <p className="text-white/80" style={{ fontSize: 'clamp(13px, 1.1vw, 14px)' }}>
                        {edu.institution}
                      </p>
                      <p className="text-white/70" style={{ fontSize: 'clamp(11px, 1vw, 12px)' }}>
                        {formatDate(edu.start)} - {formatDate(edu.end || '')}
                        {edu.location && ` • ${edu.location}`}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        {/* Certifications Section - Light */}
        <Section id="certifications" variant="light" accent="purple" eyebrow="Certifications" spacing={{ top: 40, bottom: 40 }}>
          <div className="space-y-6 sm:space-y-8">
            <div className="text-center max-w-3xl mx-auto space-y-2 sm:space-y-3 px-4">
              <Heading>Professional Certifications</Heading>
              <p className="text-base sm:text-lg text-muted leading-relaxed">
                Industry-recognized credentials demonstrating expertise across platforms and technologies
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 max-w-7xl mx-auto px-4 sm:px-6">
              {profile.certifications.map((cert, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="h-full"
                >
                  <Card
                    accentColor={index % 3 === 0 ? 'yellow' : index % 3 === 1 ? 'purple' : 'red'}
                    className="h-full flex flex-col !p-4 sm:!p-5"
                  >
                    <div className="flex-1 flex flex-col">
                      <h3 className="font-heading font-bold text-text mb-2 sm:mb-3 leading-tight" style={{ fontSize: 'clamp(16px, 1.8vw, 18px)' }}>
                        {cert.title}
                      </h3>
                      <div className="mt-auto space-y-1">
                        <p className="text-muted" style={{ fontSize: 'clamp(13px, 1.1vw, 14px)' }}>
                          {cert.issuer}
                        </p>
                        <p className="text-muted" style={{ fontSize: 'clamp(11px, 1vw, 12px)' }}>
                          {formatDate(cert.date)}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        <SectionDivider color="dark" />

        {/* Contact Section - Dark */}
        <Section id="contact" variant="dark" accent="purple" eyebrow="Contact" spacing={{ top: 40, bottom: 40 }} className="relative overflow-hidden">
          {/* Ambient background */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-purple rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent rounded-full blur-3xl" />
          </div>
          
          <div className="space-y-8 sm:space-y-10 md:space-y-12 max-w-3xl mx-auto relative z-10 px-4 sm:px-6">
            <motion.div 
              className="text-center space-y-3 sm:space-y-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center justify-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                <GeometricShape color="purple" size={40} />
              </div>
              <Heading className="text-white">{profile.contactCopy.heading}</Heading>
              <p className="text-white/80 leading-relaxed max-w-2xl mx-auto" style={{ fontSize: 'clamp(16px, 2vw, 20px)' }}>
                {profile.contactCopy.subtext}
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Card accentColor="purple" className="backdrop-blur-sm bg-white/5 border-white/20">
                <ContactForm email={profile.contact.email} linkedin={profile.contact.linkedin} />
              </Card>
            </motion.div>
          </div>
        </Section>
      </main>
      <Footer contact={profile.contact} />
    </>
  )
}
