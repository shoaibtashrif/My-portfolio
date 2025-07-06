"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Linkedin, Mail, Phone } from "lucide-react"
import Image from "next/image"
import CVModal from "./cv-modal"

export default function HeroSection() {
  const [showCVModal, setShowCVModal] = useState(false)

  const handleDownloadCV = () => {
    const link = document.createElement("a")
    link.href = "/shoaib-tashrif-cv.pdf"
    link.download = "Shoaib_Tashrif_CV.pdf"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10" />

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

      {/* Download CV Button - Top Right */}
      <div className="absolute top-6 right-6 z-10">
        <Button
          onClick={handleDownloadCV}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Download CV
        </Button>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Content */}
          <div className="flex-1 text-left lg:text-left">
            {/* Status Badge */}
            <Badge className="mb-6 bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30 transition-colors">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
              Available for Projects
            </Badge>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              AI Engineer &{" "}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Innovation Expert
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-xl sm:text-2xl text-gray-300 mb-8 leading-relaxed">
              Transforming businesses with cutting-edge AI solutions, voice agents, and intelligent automation systems.
            </p>

            {/* Key Points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="flex items-center text-gray-300">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-3" />
                4+ Years AI Experience
              </div>
              <div className="flex items-center text-gray-300">
                <div className="w-2 h-2 bg-purple-400 rounded-full mr-3" />
                10+ Projects Delivered
              </div>
              <div className="flex items-center text-gray-300">
                <div className="w-2 h-2 bg-pink-400 rounded-full mr-3" />
                Voice AI Specialist
              </div>
              <div className="flex items-center text-gray-300">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-3" />
                Enterprise Solutions
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button
                onClick={() => setShowCVModal(true)}
                size="lg"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                View Resume
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-300 bg-transparent"
                onClick={() => {
                  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
                }}
              >
                Get In Touch
                <Mail className="ml-2 h-4 w-4" />
              </Button>
            </div>

            {/* Contact Links */}
            <div className="flex flex-wrap gap-4">
              <a
                href="mailto:shoaib.tashrif@gmail.com"
                className="flex items-center text-gray-400 hover:text-white transition-colors"
              >
                <Mail className="h-4 w-4 mr-2" />
                shoaib.tashrif@gmail.com
              </a>
              <a
                href="tel:+923040610720"
                className="flex items-center text-gray-400 hover:text-white transition-colors"
              >
                <Phone className="h-4 w-4 mr-2" />
                +92 304 0610720
              </a>
              <a
                href="https://linkedin.com/in/shoaibtashrif"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-400 hover:text-white transition-colors"
              >
                <Linkedin className="h-4 w-4 mr-2" />
                LinkedIn
              </a>
            </div>
          </div>

          {/* Right Content - Profile Image */}
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="w-80 h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden border-4 border-gradient-to-r from-blue-400 via-purple-400 to-pink-400 shadow-2xl">
                <Image
                  src="/profile-image-new.png"
                  alt="Shoaib Tashrif - AI Engineer"
                  width={384}
                  height={384}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
              {/* Floating Tech Icons */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-blue-500/30">
                <span className="text-2xl">🤖</span>
              </div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-purple-500/30">
                <span className="text-2xl">⚡</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CV Modal */}
      <CVModal isOpen={showCVModal} onClose={() => setShowCVModal(false)} />
    </section>
  )
}
