"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Linkedin, Mail, Phone } from "lucide-react"
import Image from "next/image"
import CVModal from "./cv-modal"

export default function HeroSection() {
  const [showCVModal, setShowCVModal] = useState(false)

  const handleViewResume = () => {
    // Open the Google Drive CV in a new tab for viewing
    window.open("https://drive.google.com/file/d/1_oNUYyZjVM-fJSVxxb2QBLvAv3uazt0Z/view?usp=drive_link", "_blank")
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden px-4">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10" />

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        <div className="flex flex-col items-center justify-center gap-8 sm:gap-12 text-center">
          {/* Profile Image - Mobile Optimized */}
          <div className="flex-shrink-0 order-1 relative">
            <div className="relative">
              <div className="w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden shadow-2xl">
                <Image
                  src="/profile-image-new.png"
                  alt="Shoaib Tashrif - AI Engineer"
                  width={384}
                  height={384}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
              {/* Available for Projects Badge */}
              <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4">
                <Badge className="bg-green-500/90 text-white border-green-500/30 hover:bg-green-500/100 transition-colors text-xs sm:text-sm px-2 py-1">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full mr-1.5 animate-pulse" />
                  Available
                </Badge>
              </div>
              {/* Floating Tech Icons - Smaller on Mobile */}
              <div className="absolute -bottom-2 -left-2 w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-blue-500/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-blue-500/30">
                <span className="text-sm sm:text-lg md:text-2xl">🤖</span>
              </div>
              <div className="absolute -bottom-2 -left-2 w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-purple-500/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-purple-500/30">
                <span className="text-sm sm:text-lg md:text-2xl">⚡</span>
              </div>
            </div>
          </div>

          {/* Content - Mobile Optimized */}
          <div className="flex-1 text-center max-w-2xl mx-auto">
            {/* Main Heading - Mobile Optimized */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
              AI Engineer &{" "}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Innovation Expert
              </span>
            </h1>

            {/* Subheading - Mobile Optimized */}
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-6 sm:mb-8 leading-relaxed px-2">
              Transforming businesses with cutting-edge AI solutions, voice agents, and intelligent automation systems.
            </p>

            {/* Key Points - Mobile Optimized Grid */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="flex items-center justify-center text-gray-300 text-xs sm:text-sm">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full mr-2" />
                4+ Years AI Experience
              </div>
              <div className="flex items-center justify-center text-gray-300 text-xs sm:text-sm">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full mr-2" />
                10+ Projects Delivered
              </div>
              <div className="flex items-center justify-center text-gray-300 text-xs sm:text-sm">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-pink-400 rounded-full mr-2" />
                Voice AI Specialist
              </div>
              <div className="flex items-center justify-center text-gray-300 text-xs sm:text-sm">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full mr-2" />
                Enterprise Solutions
              </div>
            </div>

            {/* CTA Buttons - Mobile Optimized */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8 justify-center">
              <Button
                onClick={handleViewResume}
                size="lg"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base px-6 py-2 sm:px-8 sm:py-3"
              >
                View Resume
                <ExternalLink className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-300 bg-transparent text-sm sm:text-base px-6 py-2 sm:px-8 sm:py-3"
                onClick={() => {
                  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
                }}
              >
                Get In Touch
                <Mail className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>

            {/* Contact Links - Mobile Optimized */}
            <div className="flex flex-wrap gap-3 sm:gap-4 justify-center">
              <a
                href="mailto:shoaib.tashrif@gmail.com"
                className="flex items-center text-gray-400 hover:text-white transition-colors text-xs sm:text-sm"
              >
                <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                <span className="hidden sm:inline">shoaib.tashrif@gmail.com</span>
                <span className="sm:hidden">Email</span>
              </a>
              <a
                href="tel:+923040610720"
                className="flex items-center text-gray-400 hover:text-white transition-colors text-xs sm:text-sm"
              >
                <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                <span className="hidden sm:inline">+92 304 0610720</span>
                <span className="sm:hidden">Call</span>
              </a>
              <a
                href="https://linkedin.com/in/shoaibtashrif"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-400 hover:text-white transition-colors text-xs sm:text-sm"
              >
                <Linkedin className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                <span className="hidden sm:inline">LinkedIn</span>
                <span className="sm:hidden">LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* CV Modal */}
      <CVModal isOpen={showCVModal} onClose={() => setShowCVModal(false)} />
    </section>
  )
}
