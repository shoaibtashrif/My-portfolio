import HeroSection from "@/components/hero-section"
import AboutSection from "@/components/about-section"
import ProjectsSection from "@/components/projects-section"
import WorkProcessSection from "@/components/work-process-section"
import DemoSection from "@/components/demo-section"
import ContactSection from "@/components/contact-section"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900">
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <WorkProcessSection />
      <DemoSection />
      <ContactSection />
    </main>
  )
}
