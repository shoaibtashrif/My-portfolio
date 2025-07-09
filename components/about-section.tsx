"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Code, Mic, Users, Award, Zap } from "lucide-react"

const aboutSlides = [
  {
    title: "Bio",
    content: (
      <>
        <p className="text-gray-300 leading-relaxed text-base sm:text-lg mb-2">
          I'm Shoaib, an AI Software Engineer passionate about building intelligent solutions that make a real difference. My journey in AI began with a fascination for how machines can understand and interact with humans naturally.
        </p>
      </>
    ),
  },
  {
    title: "Experience",
    content: (
      <>
        <p className="text-gray-300 leading-relaxed text-base sm:text-lg mb-2">
          4+ years of experience developing cutting-edge AI applications, from voice-powered healthcare assistants to conversational AI platforms. Specialized in Generative AI, Voice Processing, and Conversational Systems.
        </p>
      </>
    ),
  },
  {
    title: "Expertise",
    content: (
      <>
        <p className="text-gray-300 leading-relaxed text-base sm:text-lg mb-2">
          Skills: Python, Langchain, OpenAI GPT, Hugging Face, TensorFlow, React, Next.js, FastAPI, AWS. Focused on user-friendly, impactful solutions for real-world problems.
        </p>
      </>
    ),
  },
]

const skills = [
  {
    category: "AI & Machine Learning",
    icon: <Brain className="h-5 w-5 sm:h-6 sm:w-6" />,
    items: ["Generative AI", "LangChain", "LangGraph", "OpenAI GPT", "Hugging Face", "TensorFlow"],
    color: "from-purple-500 to-pink-500",
  },
  {
    category: "Voice & Audio AI",
    icon: <Mic className="h-5 w-5 sm:h-6 sm:w-6" />,
    items: ["Speech Recognition", "Text-to-Speech", "Voice Cloning", "Audio Processing", "Real-time Voice"],
    color: "from-blue-500 to-cyan-500",
  },
  {
    category: "Development",
    icon: <Code className="h-5 w-5 sm:h-6 sm:w-6" />,
    items: ["Python", "JavaScript", "React", "Next.js", "FastAPI", "Docker", "AWS"],
    color: "from-green-500 to-emerald-500",
  },
  {
    category: "Conversational AI",
    icon: <Users className="h-5 w-5 sm:h-6 sm:w-6" />,
    items: ["Chatbots", "Virtual Assistants", "Multi-turn Conversations", "Context Management"],
    color: "from-orange-500 to-red-500",
  },
]

const achievements = [
  {
    icon: <Award className="h-6 w-6 sm:h-8 sm:w-8" />,
    title: "4+ Years Experience",
    description: "Specialized in AI engineering and development",
    color: "text-yellow-400",
  },
  {
    icon: <Zap className="h-6 w-6 sm:h-8 sm:w-8" />,
    title: "10+ Projects Delivered",
    description: "Successfully completed AI solutions across industries",
    color: "text-blue-400",
  },
  {
    icon: <Users className="h-6 w-6 sm:h-8 sm:w-8" />,
    title: "Healthcare AI Specialist",
    description: "Expert in medical AI applications and patient management",
    color: "text-green-400",
  },
]

export default function AboutSection() {
  const [slide, setSlide] = useState(0)
  // Auto-advance every 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setSlide((s) => (s + 1) % aboutSlides.length)
    }, 5000)
    return () => clearTimeout(timer)
  }, [slide])

  return (
    <section id="about" className="py-16 sm:py-20 bg-gray-900 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(120,119,198,0.08),transparent)]" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">About Me</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-start">
          {/* Left: Carousel + Achievements */}
          <div className="space-y-8">
            {/* Carousel */}
            <div className="relative w-full min-h-[120px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={slide}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="bg-gray-800/70 rounded-xl p-6 shadow-lg min-h-[120px] flex flex-col items-center justify-center"
                >
                  <h3 className="text-xl font-semibold text-indigo-400 mb-2">{aboutSlides[slide].title}</h3>
                  {aboutSlides[slide].content}
                </motion.div>
              </AnimatePresence>
              {/* Dots */}
              <div className="flex justify-center gap-2 mt-4">
                {aboutSlides.map((_, idx) => (
                  <button
                    key={idx}
                    className={`w-3 h-3 rounded-full border-2 ${slide === idx ? "bg-indigo-400 border-indigo-400" : "bg-gray-700 border-gray-500"}`}
                    aria-label={`Go to slide ${idx + 1}`}
                    onClick={() => setSlide(idx)}
                  />
                ))}
              </div>
            </div>
            {/* Achievements Timeline */}
            <div className="relative pl-6 border-l-2 border-indigo-500/30 space-y-8">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.title}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-4 group"
                >
                  <div className={`absolute -left-6 flex items-center justify-center w-12 h-12 rounded-full bg-indigo-700/20 border-2 border-indigo-500/40 group-hover:border-indigo-400 transition-colors duration-300 ${achievement.color}`}>
                    {achievement.icon}
                  </div>
                  <div className="ml-8">
                    <h4 className="text-white font-semibold text-base sm:text-lg mb-1">{achievement.title}</h4>
                    <p className="text-gray-400 text-sm sm:text-base">{achievement.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          {/* Right: Skills Grid */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Technical Expertise</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {skills.map((skillGroup, index) => (
                <motion.div
                  key={skillGroup.category}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="bg-gray-800/60 backdrop-blur-sm border-indigo-500/20 hover:border-indigo-400/40 transition-all duration-300">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className={`p-2 bg-gradient-to-r ${skillGroup.color} rounded-lg text-white group-hover:scale-110 transition-transform duration-300`}
                        >
                          {skillGroup.icon}
                        </div>
                        <h4 className="text-lg font-semibold text-white">{skillGroup.category}</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {skillGroup.items.map((skill) => (
                          <Badge
                            key={skill}
                            variant="secondary"
                            className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 hover:bg-indigo-500/30 transition-colors duration-200 text-xs sm:text-sm"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
