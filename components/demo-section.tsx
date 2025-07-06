"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CustomerServiceTalkbot from "./customer-service-talkbot"
import CalendlyBadge from "./calendly-badge"
import { Phone, Volume2 } from "lucide-react"
import Image from "next/image"

export default function DemoSection() {
  const [selectedLanguage, setSelectedLanguage] = useState<"english" | "urdu">("english")

  // YouTube video IDs
  const englishVideoId = "DsCB-qiyraw"
  const urduVideoId = "DsCB-qiyraw" // Replace with actual Urdu video ID

  return (
    <section id="demo" className="py-16">
      <div className="text-center mb-16 animate-fadeIn">
        <h2 className="text-3xl font-bold mb-4 text-white">Experience My AI Solutions</h2>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Interact with my AI talkbots and chatbots to experience natural conversation flow and human-like voice
          quality.
        </p>
      </div>

      <Tabs defaultValue="chatbot" className="max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-3 mb-8 dark-glass bg-gray-800/40">
          <TabsTrigger
            value="talkbot"
            className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-primary/30"
          >
            Voice Demo
          </TabsTrigger>
          <TabsTrigger
            value="chatbot"
            className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-primary/30"
          >
            Personal Assistant
          </TabsTrigger>
          <TabsTrigger
            value="booking"
            className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-primary/30"
          >
            Book a Session
          </TabsTrigger>
        </TabsList>

        <TabsContent value="talkbot" className="animate-slideUp">
          <Card className="max-w-4xl mx-auto dark-glass bg-gray-800/40">
            <CardContent className="p-6">
              <div className="flex justify-center mb-6">
                <div className="bg-gray-900/50 rounded-full p-1 flex">
                  <Button
                    variant={selectedLanguage === "english" ? "default" : "outline"}
                    className={`rounded-full ${
                      selectedLanguage === "english"
                        ? "bg-primary hover:bg-primary/90"
                        : "bg-transparent border-gray-700 text-white"
                    }`}
                    onClick={() => setSelectedLanguage("english")}
                  >
                    English Agent
                  </Button>
                  <Button
                    variant={selectedLanguage === "urdu" ? "default" : "outline"}
                    className={`rounded-full ${
                      selectedLanguage === "urdu"
                        ? "bg-primary hover:bg-primary/90"
                        : "bg-transparent border-gray-700 text-white"
                    }`}
                    onClick={() => setSelectedLanguage("urdu")}
                  >
                    Urdu Agent
                  </Button>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="relative w-full md:w-1/2 aspect-video rounded-lg overflow-hidden bg-primary/10">
                  <div className="w-full h-full flex items-center justify-center">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${selectedLanguage === "english" ? englishVideoId : urduVideoId}?si=jK9TBmJufAofTyBl`}
                      title={`${selectedLanguage === "english" ? "English" : "Urdu"} AI Talkbot Demo`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="rounded-lg"
                    ></iframe>
                  </div>
                </div>

                <div className="w-full md:w-1/2 space-y-6">
                  <h3 className="text-2xl font-semibold text-white">
                    {selectedLanguage === "english" ? "English Customer Service" : "Urdu Customer Service"}
                  </h3>
                  <p className="text-gray-300">
                    {selectedLanguage === "english"
                      ? "This talkbot handles customer inquiries about product features, troubleshooting, and account management with a natural, friendly tone."
                      : "This Urdu talkbot provides customer support in native Urdu language, helping users with product information and technical assistance."}
                  </p>

                  <div className="space-y-4">
                    <div className="bg-gray-800/50 p-4 rounded-lg animate-pulse">
                      <p className="text-sm italic text-gray-300">
                        {selectedLanguage === "english"
                          ? '"I can provide information about our products, help troubleshoot issues, or assist with account management. How can I help you today?"'
                          : '"میں آپ کو ہمارے پروڈکٹس کے بارے میں معلومات فراہم کر سکتا ہوں، مسائل کو حل کرنے میں مدد کر سکتا ہوں، یا اکاؤنٹ مینجمنٹ میں آپ کی مدد کر سکتا ہوں۔ میں آپ کی کیسے مدد کر سکتا ہوں؟"'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Audio Demo Section */}
              <div className="mt-12 border-t border-gray-700 pt-8">
                <h3 className="text-2xl font-semibold text-white mb-6 text-center">Real Voice-to-Voice Agent Demo</h3>

                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="relative w-full md:w-1/2 aspect-video rounded-lg overflow-hidden bg-primary/10">
                    <Image
                      src="/customer-support-ai.png"
                      alt="Customer Support AI Agent"
                      width={600}
                      height={400}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent flex items-center justify-center">
                      <div className="text-center">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 mb-4">
                          <Volume2 className="h-8 w-8 text-white" />
                        </div>
                        <p className="text-white font-semibold">Voice AI Demo</p>
                      </div>
                    </div>
                  </div>

                  <div className="w-full md:w-1/2 space-y-6">
                    <h4 className="text-xl font-semibold text-white">CourierCo Voice Agent</h4>
                    <p className="text-gray-300">
                      Listen to a real conversation between a customer and Shoaib's AI voice agent for CourierCo. This
                      demo showcases natural conversation flow, intelligent responses, and professional customer
                      service.
                    </p>

                    {/* Audio Player */}
                    <div className="bg-gray-800/50 rounded-lg p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                          <Phone className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="text-white font-medium">CourierCo Customer Support</p>
                          <p className="text-gray-400 text-sm">Voice-to-Voice AI Agent Demo</p>
                        </div>
                      </div>

                      <audio controls className="w-full" preload="metadata">
                        <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CourerCo-J7a725aPPdp1ey0aKakLStvHHeBWAX.mp3" type="audio/mpeg" />
                        Your browser does not support the audio element.
                      </audio>

                      <div className="mt-4 text-sm text-gray-400">
                        <p>🎯 Features demonstrated:</p>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          <li>Natural conversation flow</li>
                          <li>Real-time voice processing</li>
                          <li>Intelligent query understanding</li>
                          <li>Professional customer service tone</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chatbot" className="animate-slideUp">
          <CustomerServiceTalkbot />
        </TabsContent>

        <TabsContent value="booking" className="animate-slideUp">
          <Card className="max-w-4xl mx-auto dark-glass bg-gray-800/40">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-2xl font-semibold text-white mb-4">Book a Session with Shoaib</h3>
                <p className="text-gray-300 mb-6">
                  Click the "Schedule time with me" button below to view my availability and book a consultation.
                </p>
                <div className="flex justify-center">
                  <Button
                    className="bg-primary hover:bg-primary/90 text-white px-6 py-3 text-lg"
                    onClick={() => {
                      if (window.Calendly) {
                        window.Calendly.showPopupWidget("https://calendly.com/shoaib-tashrif")
                      }
                    }}
                  >
                    Schedule time with me
                  </Button>
                </div>
                <p className="text-gray-400 mt-4 text-sm">
                  You can also use the floating button at the bottom right of the screen at any time.
                </p>
              </div>
              <CalendlyBadge />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  )
}
