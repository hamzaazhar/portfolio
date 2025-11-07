import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import '@testing-library/jest-dom'
import Home from '@/app/page'
import { getProfile } from '@/lib/getProfile'

jest.mock('@/lib/getProfile')

describe('Home Page', () => {
  beforeEach(() => {
    const mockProfile = {
      name: 'Rana Muhammad Hamza',
      title: 'Senior Data Scientist & Digital Transformation Specialist',
      summary: ['Test summary'],
      hero: {
        headline: 'Digital Transformation & Decision Intelligence Lead',
        subhead: 'I design AI-driven systems that remove operational friction and enable real-time execution across manufacturing teams.',
        microProof: 'Predictive intelligence, workflow automation, and decision systems that make operations measurable and manageable.',
        metrics: [
          { label: '70% reduction in HR workload', value: '70%' },
          { label: '15% reduction in machine downtime', value: '15%' },
          { label: '3–4 days faster sampling', value: '3–4 days' },
        ],
        ctas: {
          primary: { text: 'See Case Studies', href: '#work' },
          secondary: { text: 'Discuss Your Environment', href: '#contact' },
        },
      },
      pillars: [
        { title: 'Operational Flow Design', statement: 'I redesign end-to-end workflows to remove bottlenecks and manual dependencies.' },
        { title: 'Predictive Decision Systems', statement: 'I convert real-time signals into forward-biased decisions using ML and analytics.' },
        { title: 'Cross-Functional Execution', statement: 'I work across Sales, HR, Production, IT, and Leadership to land change that sticks.' },
      ],
      caseStudies: [
        {
          title: 'Machine Health + RCA Decision Engine',
          context: 'Unplanned stoppages lacked diagnosis clarity.',
          built: 'Combined stop-logs, locator history, and time-series signals into a generative RCA + machine health scoring engine.',
          outcome: 'Reduced unplanned downtime by ~15%.',
          stack: ['Python', 'SQL Server', 'MongoDB', 'Tableau'],
        },
      ],
      expertiseClusters: [
        { title: 'Decision Systems', items: ['ML Modeling', 'Time-Series Forecasting'] },
        { title: 'Data Fabric & Integration', items: ['PostgreSQL', 'MSSQL'] },
        { title: 'Operational Intelligence', items: ['Tableau', 'Power BI'] },
      ],
      growthTimeline: [
        { year: '2020', label: 'built dashboards and ML models' },
        { year: '2021', label: 'centralized databases into unified warehouse' },
      ],
      contactCopy: {
        heading: 'Discuss Operational Friction and System Design',
        subtext: 'If your organization needs clearer visibility, automated workflows, or predictive intelligence systems, let\'s talk.',
      },
      contact: {
        phone: '+1234567890',
        email: 'test@example.com',
        linkedin: 'https://linkedin.com/in/test',
      },
      education: [],
      certifications: [],
      volunteering: [],
      skills: {
        methodologies: [],
        techniques: [],
        tools: [],
      },
      experience: [],
      projects: [],
    }
    ;(getProfile as jest.MockedFunction<typeof getProfile>).mockReturnValue({ profile: mockProfile, todos: [] })
  })

  it('renders profile name', () => {
    render(<Home />)
    // @ts-expect-error - jest-dom matchers are available at runtime
    expect(screen.getByText('Rana Muhammad Hamza')).toBeInTheDocument()
  })

  it('renders hero headline', () => {
    render(<Home />)
    // @ts-expect-error - jest-dom matchers are available at runtime
    expect(screen.getByText('Digital Transformation & Decision Intelligence Lead')).toBeInTheDocument()
  })

  it('renders value section', () => {
    render(<Home />)
    // @ts-expect-error - jest-dom matchers are available at runtime
    expect(screen.getByText('How I Create Organizational Impact')).toBeInTheDocument()
  })

  it('renders contact section', () => {
    render(<Home />)
    // @ts-expect-error - jest-dom matchers are available at runtime
    expect(screen.getByText('Discuss Operational Friction and System Design')).toBeInTheDocument()
  })
})

