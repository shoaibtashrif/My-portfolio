"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Star, Users, Briefcase } from "lucide-react"
import Image from "next/image"
import CVModal from "./cv-modal"

const keyPoints = [
  {
    icon: <Briefcase className="h-5 w-5" />,
    label: "4+ Years Experience",
    description: "AI Engineering",
  },
  {
    icon: <Star className="h-5 w-5" />,
    label: "10+ Projects",
    description: "Successfully Delivered",
  },
  {
    icon: <Users className="h-5 w-5" />,
    label: "Voice AI Specialist",
    description: "Conversational Systems",
  },
  {
    icon: <FileText className="h-5 w-5" />,
    label: "Agentic AI Expert",
    description: "Multi-Agent Systems",
  },
]

export default function HeroSection() {
  const [isCVModalOpen, setIsCVModalOpen] = useState(false)

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden">
      {/* Download CV Button - Top Right Corner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="absolute top-6 right-6 z-20"
      >
        <Button
          asChild
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <a href="/shoaib-tashrif-cv.pdf" download="Shoaib_Tashrif_Resume.pdf">
            Download CV
          </a>
        </Button>
      </motion.div>

      {/* Subtle Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.08),transparent)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.06),transparent)] pointer-events-none" />

      {/* Minimal Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-indigo-400/20 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
              x: [null, Math.random() * window.innerWidth],
            }}
            transition={{
              duration: Math.random() * 15 + 20,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left space-y-8"
          >
            {/* Main Heading */}
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Badge className="bg-indigo-500/10 text-indigo-300 border-indigo-500/20 mb-4">
                  AI Software Engineer
                </Badge>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight"
              >
                Shoaib
                <span className="text-indigo-400"> Tashrif</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-xl md:text-2xl text-gray-300 leading-relaxed"
              >
                Transforming ideas into intelligent AI solutions with expertise in
                <span className="text-indigo-400"> Generative AI</span>,
                <span className="text-blue-400"> Voice Processing</span>, and
                <span className="text-cyan-400"> Conversational Systems</span>
              </motion.p>
            </div>

            {/* Key Points */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="grid grid-cols-2 gap-4"
            >
              {keyPoints.map((point, index) => (
                <motion.div
                  key={point.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 hover:border-indigo-500/30 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-indigo-500/20 rounded-lg group-hover:scale-110 transition-transform duration-300">
                      {point.icon}
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm">{point.label}</div>
                      <div className="text-gray-400 text-xs">{point.description}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex justify-center lg:justify-start"
            >
              <Button
                onClick={() => setIsCVModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <FileText className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                View Resume
              </Button>
            </motion.div>
          </motion.div>

          {/* Right Column - Profile Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Subtle Glow Effect */}
              <div className="absolute inset-0 bg-indigo-500/10 rounded-full blur-3xl scale-110" />

              {/* Profile Image Container */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="relative w-80 h-80 md:w-96 md:h-96 rounded-full overflow-hidden border-2 border-indigo-500/30 shadow-2xl"
              >
                <div className="absolute inset-0 bg-indigo-500/20 p-1 rounded-full">
                  <div className="w-full h-full rounded-full overflow-hidden bg-gray-900">
                    <Image
                      src="/profile-image-new.png"
                      alt="Shoaib Tashrif"
                      width={400}
                      height={400}
                      className="w-full h-full object-cover object-center"
                      priority
                    />
                  </div>
                </div>
              </motion.div>

              {/* Floating Elements */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="absolute -top-4 -right-4 w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg"
              >
                <span className="text-white font-bold text-lg">AI</span>
              </motion.div>

              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                className="absolute -bottom-4 -left-4 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg"
              >
                <span className="text-white font-bold">🤖</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      <CVModal isOpen={isCVModalOpen} onClose={() => setIsCVModalOpen(false)} />
    </section>
  )
}
