import { getProfile } from '@/lib/getProfile'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Heading } from '@/components/Heading'
import { ProjectCard } from '@/components/ProjectCard'

export default function ProjectsPage() {
  const { profile } = getProfile()

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16 pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-12">
            <p className="text-sm font-medium text-fg-muted uppercase tracking-wider mb-4">Projects</p>
            <Heading>Projects & Portfolio</Heading>
            <p className="text-fg-muted mt-4 max-w-2xl">
              A collection of projects showcasing expertise in data science, machine learning, and digital transformation.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {profile.projects.map((project, index) => (
              <ProjectCard
                key={index}
                title={project.title}
                description={project.description}
                tags={project.tags}
                url={project.url}
                start={project.start}
                end={project.end}
                institution={project.institution}
              />
            ))}
          </div>
        </div>
      </main>
      <Footer contact={profile.contact} />
    </>
  )
}

