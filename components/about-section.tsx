"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Code, Mic, Users, Award, Zap } from "lucide-react"

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
  return (
    <section id="about" className="py-12 sm:py-16 md:py-20 bg-gray-900 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(120,119,198,0.1),transparent)]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12 md:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 md:mb-6">About Me</h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto px-2 sm:px-4">
            Passionate AI engineer with 4+ years of experience building intelligent solutions that transform businesses
            and enhance human capabilities.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 max-w-6xl mx-auto">
          {/* Left Column - Story */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-4 sm:space-y-6"
          >
            <div className="prose prose-sm sm:prose-base lg:prose-lg prose-invert">
              <p className="text-gray-300 leading-relaxed text-sm sm:text-base md:text-lg">
                I'm a dedicated AI Software Engineer with a passion for creating intelligent solutions that make a real
                difference. My journey in AI began with a fascination for how machines can understand and interact with
                humans naturally.
              </p>
              <p className="text-gray-300 leading-relaxed text-sm sm:text-base md:text-lg">
                Over the past 4+ years, I've specialized in developing cutting-edge AI applications, from voice-powered
                healthcare assistants to conversational AI platforms. I believe in the power of AI to augment human
                capabilities and solve complex real-world problems.
              </p>
              <p className="text-gray-300 leading-relaxed text-sm sm:text-base md:text-lg">
                My expertise spans across Generative AI, Voice Processing, and Conversational Systems, with a strong
                focus on creating solutions that are not just technically advanced but also user-friendly and impactful.
              </p>
            </div>

            {/* Achievements - Mobile Optimized */}
            <div className="space-y-3 sm:space-y-4 mt-6 sm:mt-8">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.title}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-indigo-500/30 transition-colors duration-300"
                >
                  <div className={`${achievement.color} flex-shrink-0`}>{achievement.icon}</div>
                  <div>
                    <h4 className="text-white font-semibold text-xs sm:text-sm md:text-base">{achievement.title}</h4>
                    <p className="text-gray-400 text-xs sm:text-sm">{achievement.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Skills */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-4 sm:space-y-6"
          >
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6 md:mb-8">Technical Expertise</h3>

            {skills.map((skillGroup, index) => (
              <motion.div
                key={skillGroup.category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 hover:border-indigo-500/30 transition-all duration-300">
                  <CardContent className="p-3 sm:p-4 md:p-6">
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <div
                        className={`p-1.5 sm:p-2 bg-gradient-to-r ${skillGroup.color} rounded-lg text-white group-hover:scale-110 transition-transform duration-300`}
                      >
                        {skillGroup.icon}
                      </div>
                      <h4 className="text-sm sm:text-base md:text-lg font-semibold text-white">{skillGroup.category}</h4>
                    </div>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
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
          </motion.div>
        </div>
      </div>
    </section>
  )
}
