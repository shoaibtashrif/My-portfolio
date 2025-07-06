"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { X, Download } from "lucide-react"

interface CVModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CVModal({ isOpen, onClose }: CVModalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    if (isOpen) {
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  if (!mounted) return null
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur effect */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal content */}
      <div className="relative z-10 w-full max-w-4xl h-[90vh] bg-white rounded-lg shadow-xl overflow-hidden mx-4">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-bold text-gray-900">Shoaib Tashrif - Resume</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-gray-300 text-gray-700 hover:bg-gray-100 bg-transparent"
              asChild
            >
              <a href="/shoaib-tashrif-cv.pdf" download="Shoaib_Tashrif_Resume.pdf">
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </a>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="h-[calc(90vh-80px)] overflow-y-auto p-6 bg-white">
          {/* Resume Content */}
          <div className="max-w-3xl mx-auto text-gray-900">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Shoaib Tashrif</h1>
              <h2 className="text-xl text-blue-600 mb-4">AI Software Engineer | Generative AI Developer</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Experienced and Dynamic AI software engineer with excellence in developing AI applications,
                multithreaded systems, multi-calling voice agents and intelligent solutions using python, Langraph,
                Langchain, LLMs and using different AI tools like bland AI.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
                <span>📧 shoaib.tashrif@gmail.com</span>
                <span>📱 +923040610720</span>
                <span>📍 Satellite town Rawalpindi</span>
                <span>💼 shoaibtashrif</span>
              </div>
            </div>

            {/* Skills */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4 text-blue-600 border-b-2 border-blue-200 pb-2">SKILLS</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                <span className="bg-blue-50 px-3 py-1 rounded">Generative AI</span>
                <span className="bg-blue-50 px-3 py-1 rounded">RAG</span>
                <span className="bg-blue-50 px-3 py-1 rounded">Chatbot Development</span>
                <span className="bg-blue-50 px-3 py-1 rounded">Python</span>
                <span className="bg-blue-50 px-3 py-1 rounded">OpenAI API</span>
                <span className="bg-blue-50 px-3 py-1 rounded">AI Integration</span>
                <span className="bg-blue-50 px-3 py-1 rounded">NLP</span>
                <span className="bg-blue-50 px-3 py-1 rounded">LLMs Fine tuning</span>
                <span className="bg-blue-50 px-3 py-1 rounded">Cloud solutions</span>
                <span className="bg-blue-50 px-3 py-1 rounded">Langraph</span>
                <span className="bg-blue-50 px-3 py-1 rounded">Langchain</span>
                <span className="bg-blue-50 px-3 py-1 rounded">Multi-threaded Development</span>
                <span className="bg-blue-50 px-3 py-1 rounded">Voice Processing</span>
                <span className="bg-blue-50 px-3 py-1 rounded">AI workflow design</span>
                <span className="bg-blue-50 px-3 py-1 rounded">Hugging Face</span>
                <span className="bg-blue-50 px-3 py-1 rounded">Ollama</span>
                <span className="bg-blue-50 px-3 py-1 rounded">MERN Stack</span>
                <span className="bg-blue-50 px-3 py-1 rounded">AI voice agents</span>
                <span className="bg-blue-50 px-3 py-1 rounded">Linux</span>
                <span className="bg-blue-50 px-3 py-1 rounded">CNN</span>
                <span className="bg-blue-50 px-3 py-1 rounded">Computer Vision (YOLO)</span>
                <span className="bg-blue-50 px-3 py-1 rounded">OpenCV</span>
                <span className="bg-blue-50 px-3 py-1 rounded">AWS</span>
                <span className="bg-blue-50 px-3 py-1 rounded">GitHub</span>
                <span className="bg-blue-50 px-3 py-1 rounded">Conversational AI Expert</span>
                <span className="bg-blue-50 px-3 py-1 rounded">Prompt Engineering</span>
                <span className="bg-blue-50 px-3 py-1 rounded">Docker</span>
              </div>
            </div>

            {/* Work Experience */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4 text-blue-600 border-b-2 border-blue-200 pb-2">WORK EXPERIENCE</h3>

              <div className="mb-6">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-lg">AI Software Engineer</h4>
                  <span className="text-sm text-gray-600">Oct 2024 - Jan 2025</span>
                </div>
                <p className="text-blue-600 font-medium mb-2">Wosler Corp - Canada-Remote</p>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Delivered End-to-end Artificial Intelligence software products for Nexus AI</li>
                  <li>Designed and implemented a voice-To-Voice AI assistance system for Nexus</li>
                  <li>Architected and optimized the code structure for Nexus VTC Core Chatbot</li>
                  <li>Configured and deployed LLMs (Llama, GPT, Faster Whisper, ElevenLabs) Locally on the server</li>
                </ul>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-lg">Backend Developer - Generative AI Developer</h4>
                  <span className="text-sm text-gray-600">Feb 2024 – Aug 2024</span>
                </div>
                <p className="text-blue-600 font-medium mb-2">Stealth Startup</p>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Created workflow, algorithms for a product preference base system</li>
                  <li>Integrated API and fine tune system and designed prompt</li>
                  <li>Worked on WMS Pakistan (web management system) at PTA (Pakistan Telecommunication Authority)</li>
                  <li>Management of URLs Classification with AI</li>
                  <li>Built an AI system for spammer detection through Voice</li>
                </ul>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-lg">AI Software Engineer</h4>
                  <span className="text-sm text-gray-600">Nov 2021 – Dec 2024</span>
                </div>
                <p className="text-blue-600 font-medium mb-2">
                  Valyrian System Inc. - Pakistan Islamabad-Onsite / US-Remote
                </p>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Built workflows for each agent, database models and APIs</li>
                  <li>Deployed System on AWS(EC2)</li>
                  <li>Technologies: Langchain, langraph, Twilio, ollama, python VAD, STT, TTS</li>
                  <li>worked on Backend development in Python and Node.js</li>
                  <li>APIs integration</li>
                </ul>
              </div>
            </div>

            {/* Projects */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4 text-blue-600 border-b-2 border-blue-200 pb-2">PROJECTS</h3>

              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-bold">Hilum AI (Voice Assistant)</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Voice-to-voice calling AI bot for booking, modification/cancelation of existing booking, customer
                    support, services inquiry regarding health
                  </p>
                  <p className="text-sm">
                    delivered whole functionality of the slots booking, APIs building, pipeline setup, database models
                    and system deployment on AWS (EC2)
                  </p>
                </div>

                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-bold">ControlshiftAI</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    A platform where users can create AI agents without any code just by drag and drop
                  </p>
                  <p className="text-sm">Role: Backend Developer - Built the core infrastructure and API systems https://api.dev.controlshiftai.com/docs#/ </p>
                </div>

                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-bold">Intelli Firewall</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Real-time internet traffic monitoring with rule-based blocking, spam detection, and identification
                    of unknown traffic
                  </p>
                  <p className="text-sm">Python | React | Django | Tensorflow | Scapy | Linux</p>
                </div>

                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-bold">Student Interest Analysis based on Images Processing</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    System which takes pictures of class and calculates student interest using image processing
                  </p>
                  <p className="text-sm">python | OpenCV | Tensorflow | Image Processing</p>
                </div>

                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-bold">Object Detection System</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Detects Objects Based on their Unique features. Can recognize and differentiate Human and other
                    objects
                  </p>
                  <p className="text-sm">python | YOLO 5 | Model tuning | Generative AI</p>
                </div>

                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-bold">Spammer ID</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    AI base Voice recognition system to identify the person with its voice. Helps in detection of
                    spammer voice based on unique features
                  </p>
                  <p className="text-sm">Python | AI | Linux | LLM</p>
                </div>
              </div>
            </div>

            {/* Education */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4 text-blue-600 border-b-2 border-blue-200 pb-2">EDUCATION</h3>
              <div>
                <h4 className="font-bold">BS Software Engineering</h4>
                <p className="text-blue-600">
                  Information technology Campus-PMAS Arid Agriculture University Rawalpindi, Pakistan
                </p>
                <p className="text-sm text-gray-600">3.4/4 CGPA</p>
              </div>
            </div>

            {/* Certifications */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4 text-blue-600 border-b-2 border-blue-200 pb-2">CERTIFICATION</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>AI Automation with Python 2022
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>MERN Stack Development 2021
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>Generative AI 2023
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
