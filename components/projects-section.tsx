"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github, Lock, Calendar } from "lucide-react"
import Image from "next/image"
import PrivateRepoModal from "./private-repo-modal"

const projects = [
  {
    title: "Hilum AI (Nexus AI Voice Assistant)",
    description:
      "Voice-to-voice calling AI bot for booking, modification/cancelation of existing booking, customer support, and services inquiry regarding health. Delivered whole functionality of the slots booking, APIs building, pipeline setup, database models and system deployment on AWS (EC2).",
    image: "/hilum-ai-image.png",
    tags: ["Voice AI", "Python", "Langchain", "AWS", "Medical"],
    demoUrl: "https://hilum.wosler.ca/",
    githubUrl: "private",
    isPrivate: true,
    features: ["Voice Recognition", "Natural Language Processing", "Appointment Booking", "Customer Support"],
  },
  {
    title: "ControlshiftAI Platform",
    description:
      "A comprehensive AI platform that makes work easy, fast, and reliable. Features dashboard insights, bot management, and extensive guides to help users build and deploy AI assistants efficiently.",
    image: "/controlshift-ai-image.png",
    tags: ["No-Code", "Backend", "API", "AI Agents", "Platform"],
    demoUrl: "https://app.controlshiftai.com/auth",
    githubUrl: "private",
    isPrivate: true,
    features: ["No-Code Interface", "AI Agent Builder", "Backend APIs", "User Management"],
  },
  {
    title: "VoxEnt AI (Multi-lingual AI Talkbot)",
    description:
      "SDK to create multi-agent and multilingual chatbots and talkbots. Simplifies conversational AI development, creates custom AI agents, and offers the flexibility to integrate personalized tools on the fly. Deployed on Hyperstack A100.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop&auto=format",
    tags: ["Talkbot", "NLP", "Multi-language", "SDK", "Voice AI"],
    demoUrl: "#",
    githubUrl: "private",
    isPrivate: true,
    features: ["Multi-language Support", "Custom Integration", "Voice Processing", "Real-time Processing"],
  },
  {
    title: "Cabee (AI Ride Booking)",
    description:
      "AI-powered ride booking system used in the UK to book rides through AI calling. Users can book, schedule, and cancel rides seamlessly using natural voice commands.",
    image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&h=200&fit=crop&auto=format",
    tags: ["Voice AI", "Ride Booking", "AI Calling", "UK Market"],
    demoUrl: "https://agent.cabex.co.uk/",
    githubUrl: "private",
    isPrivate: true,
    features: ["AI Calling", "Ride Scheduling", "Booking Management", "Voice Interface"],
  },
  {
    title: "Intelli Firewall",
    description:
      "Real-time internet traffic monitoring system with AI-powered rule-based blocking, spam detection, and unknown traffic identification for enhanced cybersecurity. Offers controls for monitoring user activity within organizations.",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=200&fit=crop&auto=format",
    tags: ["Cybersecurity", "AI", "Python", "React", "Django"],
    demoUrl: "#",
    githubUrl: "private",
    isPrivate: true,
    features: ["Real-time Monitoring", "AI Detection", "Rule-based Blocking", "Traffic Analysis"],
  },
  {
    title: "Spammer ID",
    description:
      "AI-based Voice recognition system to identify persons by their voice. Helps in detection of spammer voices based on unique voice features.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop&auto=format",
    tags: ["Voice Recognition", "AI", "Python", "Linux", "LLM"],
    demoUrl: "#",
    githubUrl: "private",
    isPrivate: true,
    features: ["Voice Identification", "Spammer Detection", "Feature Extraction", "Security"],
  },
  {
    title: "Howkeye-100",
    description:
      "Internet traffic management system responsible for URL classification through AI. Handles backend processing for efficient traffic analysis and categorization.",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=200&fit=crop&auto=format",
    tags: ["Traffic Management", "AI Classification", "Python", "Node.js"],
    demoUrl: "#",
    githubUrl: "private",
    isPrivate: true,
    features: ["URL Classification", "Traffic Management", "Backend Processing", "AI Analysis"],
  },
]

export default function ProjectsSection() {
  const [selectedProject, setSelectedProject] = useState<(typeof projects)[0] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleGithubClick = (project: (typeof projects)[0]) => {
    if (project.isPrivate) {
      setSelectedProject(project)
      setIsModalOpen(true)
    } else {
      window.open(project.githubUrl, "_blank")
    }
  }

  return (
    <section id="projects" className="py-20 bg-gray-800 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(120,119,198,0.1),transparent)]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">Featured Projects</h2>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
            Showcasing innovative AI solutions that solve real-world problems
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-700 hover:border-purple-500/50 transition-all duration-300 h-full hover:shadow-xl hover:shadow-purple-500/10">
                <CardHeader className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <Image
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      width={400}
                      height={200}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                    {project.isPrivate && (
                      <div className="absolute top-4 right-4 bg-yellow-500/20 backdrop-blur-sm border border-yellow-500/30 rounded-full p-2">
                        <Lock className="h-4 w-4 text-yellow-400" />
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <CardTitle className="text-lg sm:text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors duration-300">
                    {project.title}
                  </CardTitle>
                  <CardDescription className="text-gray-300 mb-4 leading-relaxed text-sm sm:text-base">
                    {project.description}
                  </CardDescription>

                  {/* Features */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">Key Features:</h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      {project.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center">
                          <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-purple-500/20 text-purple-300 border-purple-500/30 hover:bg-purple-500/30 transition-colors duration-300 text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-gray-600 text-gray-300 hover:bg-purple-500/20 hover:border-purple-500/50 hover:text-white transition-all duration-300 bg-transparent"
                      onClick={() => handleGithubClick(project)}
                    >
                      {project.isPrivate ? <Lock className="mr-2 h-4 w-4" /> : <Github className="mr-2 h-4 w-4" />}
                      {project.isPrivate ? "Private Repo" : "View Code"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-600 text-gray-300 hover:bg-purple-500/20 hover:border-purple-500/50 hover:text-white transition-all duration-300 bg-transparent p-2"
                      onClick={() => {
                        if (project.demoUrl !== "#") {
                          window.open(project.demoUrl, "_blank")
                        } else {
                          const demoSection = document.getElementById("demo")
                          if (demoSection) {
                            demoSection.scrollIntoView({ behavior: "smooth" })
                          }
                        }
                      }}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-gray-300 mb-6 text-lg">
            Interested in seeing more projects or discussing a custom solution?
          </p>
          <Button
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 sm:px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() => {
              const contactSection = document.getElementById("contact")
              if (contactSection) {
                contactSection.scrollIntoView({ behavior: "smooth" })
              }
            }}
          >
            <Calendar className="mr-2 h-5 w-5" />
            Schedule a Discussion
          </Button>
        </motion.div>
      </div>

      <PrivateRepoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} project={selectedProject} />
    </section>
  )
}
