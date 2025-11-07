'use client'

import { motion } from 'framer-motion'

interface Role {
  title: string
  start: string
  end: string
}

interface Experience {
  company: string
  location: string
  roles: Role[]
}

interface ExperienceTimelineProps {
  experience: Experience[]
}

function formatDate(dateStr: string): string {
  if (!dateStr || dateStr === 'present') return 'Present'
  const [year, month] = dateStr.split('-')
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${monthNames[parseInt(month, 10) - 1]} ${year}`
}

export function ExperienceTimeline({ experience }: ExperienceTimelineProps) {
  return (
    <div className="space-y-12">
      {experience.map((exp, expIndex) => (
        <motion.div
          key={expIndex}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: expIndex * 0.1 }}
          className="relative pl-8 border-l-2 border-fg-muted/20"
        >
          <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-accent-yellow border-2 border-bg-light" />
          <div className="mb-2">
            <h3 className="text-2xl font-heading font-bold text-fg">{exp.company}</h3>
            <p className="text-fg-muted">{exp.location}</p>
          </div>
          <div className="space-y-4 mt-4">
            {exp.roles.map((role, roleIndex) => (
              <div key={roleIndex} className="pb-4 last:pb-0">
                <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                  <h4 className="text-xl font-heading font-semibold text-fg">{role.title}</h4>
                  <span className="text-sm text-fg-muted">
                    {formatDate(role.start)} → {formatDate(role.end)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

