import { z } from 'zod'

export const profileSchema = z.object({
  name: z.string(),
  title: z.string(),
  branding: z.object({
    identity: z.string(),
  }).optional(),
  hero: z.object({
    headline: z.string(),
    subhead: z.string(),
    microProof: z.string(),
    metrics: z.array(
      z.object({
        label: z.string(),
        value: z.string(),
      })
    ),
    ctas: z.object({
      primary: z.object({
        text: z.string(),
        href: z.string(),
      }),
      secondary: z.object({
        text: z.string(),
        href: z.string(),
      }),
    }),
  }).optional(),
  pillars: z.array(
    z.object({
      title: z.string(),
      statement: z.string(),
    })
  ).optional(),
  caseStudies: z.array(
    z.object({
      title: z.string(),
      context: z.string(),
      built: z.string(),
      outcome: z.string(),
      stack: z.array(z.string()),
    })
  ).optional(),
  expertiseClusters: z.array(
    z.object({
      title: z.string(),
      items: z.array(z.string()),
    })
  ).optional(),
  growthTimeline: z.array(
    z.object({
      year: z.string(),
      label: z.string(),
    })
  ).optional(),
  contactCopy: z.object({
    heading: z.string(),
    subtext: z.string(),
  }).optional(),
  summary: z.array(z.string()),
  contact: z.object({
    phone: z.string(),
    email: z.string().email(),
    linkedin: z.string(),
  }),
  skills: z.object({
    methodologies: z.array(z.string()),
    techniques: z.array(z.string()),
    tools: z.array(z.string()),
  }),
  experience: z.array(
    z.object({
      company: z.string(),
      location: z.string(),
      roles: z.array(
        z.object({
          title: z.string(),
          start: z.string(),
          end: z.string(),
          bullets: z.array(z.string()),
        })
      ),
    })
  ),
  education: z.array(
    z.object({
      degree: z.string(),
      institution: z.string(),
      start: z.string(),
      end: z.string().optional(),
      location: z.string().optional(),
    })
  ),
  certifications: z.array(
    z.object({
      title: z.string(),
      issuer: z.string(),
      date: z.string(),
      url: z.string().optional(),
    })
  ),
  projects: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      start: z.string().optional(),
      end: z.string().optional(),
      institution: z.string().optional(),
      tags: z.array(z.string()).optional(),
      url: z.string().optional(),
    })
  ),
  volunteering: z.array(
    z.object({
      organization: z.string(),
      role: z.string(),
      start: z.string(),
      end: z.string(),
      location: z.string().optional(),
      bullets: z.array(z.string()).optional(),
    })
  ),
})

export type Profile = z.infer<typeof profileSchema>

