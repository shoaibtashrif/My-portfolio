"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Calendar, MessageCircle, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import CustomerServiceTalkbot from "./customer-service-talkbot"

declare global {
  interface Window {
    Calendly: any
  }
}

export default function DynamicCalendlyWidget() {
  const [currentAction, setCurrentAction] = useState(0)
  const [isWidgetOpen, setIsWidgetOpen] = useState(false)
  const [widgetType, setWidgetType] = useState<"chat" | "calendar" | null>(null)
  const [calendlyLoaded, setCalendlyLoaded] = useState(false)

  const actions = [
    {
      icon: <Calendar className="h-5 w-5" />,
      text: "Schedule a Meeting",
      type: "calendar" as const,
    },
    {
      icon: <MessageCircle className="h-5 w-5" />,
      text: "Chat with AI Assistant",
      type: "chat" as const,
    },
  ]

  // Auto-rotate actions every 5-6 seconds
  useEffect(() => {
    if (!isWidgetOpen) {
      const interval = setInterval(() => {
        setCurrentAction((prev) => (prev + 1) % actions.length)
      }, 5500)
      return () => clearInterval(interval)
    }
  }, [actions.length, isWidgetOpen])

  // Load Calendly script
  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://assets.calendly.com/assets/external/widget.js"
    script.async = true
    script.onload = () => {
      setCalendlyLoaded(true)
    }
    document.head.appendChild(script)

    // Also load CSS
    const link = document.createElement("link")
    link.href = "https://assets.calendly.com/assets/external/widget.css"
    link.rel = "stylesheet"
    document.head.appendChild(link)

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
      if (document.head.contains(link)) {
        document.head.removeChild(link)
      }
    }
  }, [])

  const handleActionClick = () => {
    const action = actions[currentAction]
    setWidgetType(action.type)
    setIsWidgetOpen(true)

    // If calendar is selected and Calendly is loaded, initialize it
    if (action.type === "calendar" && calendlyLoaded && window.Calendly) {
      setTimeout(() => {
        window.Calendly.initInlineWidget({
          url: "https://calendly.com/shoaib-tashrif",
          parentElement: document.querySelector(".calendly-inline-widget"),
          prefill: {},
          utm: {},
        })
      }, 100)
    }
  }

  const closeWidget = () => {
    setIsWidgetOpen(false)
    setWidgetType(null)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {!isWidgetOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <Button
              onClick={handleActionClick}
              className="bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-full px-6 py-3 flex items-center gap-2 group relative"
            >
              <motion.div
                key={currentAction}
                initial={{ rotate: -180, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {actions[currentAction].icon}
              </motion.div>
              <motion.span
                key={`text-${currentAction}`}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="hidden sm:inline-block"
              >
                {actions[currentAction].text}
              </motion.span>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Widget Window */}
      <AnimatePresence>
        {isWidgetOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="absolute bottom-16 right-0 w-96 max-w-[90vw]"
          >
            {widgetType === "chat" && (
              <div className="bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-lg shadow-xl">
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                  <h3 className="text-white font-semibold">AI Assistant</h3>
                  <Button
                    onClick={closeWidget}
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-white h-6 w-6"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="max-h-[500px] overflow-hidden">
                  <CustomerServiceTalkbot />
                </div>
              </div>
            )}

            {widgetType === "calendar" && (
              <div className="bg-white border border-gray-300 rounded-lg shadow-xl overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
                  <h3 className="text-gray-900 font-semibold">Schedule Meeting</h3>
                  <Button
                    onClick={closeWidget}
                    variant="ghost"
                    size="icon"
                    className="text-gray-600 hover:text-gray-900 h-6 w-6"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="calendly-inline-widget" style={{ minWidth: "320px", height: "600px" }}>
                  {!calendlyLoaded && (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-gray-600">Loading calendar...</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Widget Type Selector */}
            <div className="mt-2 bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-lg p-2">
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    setWidgetType("calendar")
                    if (calendlyLoaded && window.Calendly) {
                      setTimeout(() => {
                        window.Calendly.initInlineWidget({
                          url: "https://calendly.com/shoaib-tashrif",
                          parentElement: document.querySelector(".calendly-inline-widget"),
                          prefill: {},
                          utm: {},
                        })
                      }, 100)
                    }
                  }}
                  variant={widgetType === "calendar" ? "default" : "outline"}
                  size="sm"
                  className="flex-1"
                >
                  <Calendar className="mr-1 h-3 w-3" />
                  Meet
                </Button>
                <Button
                  onClick={() => setWidgetType("chat")}
                  variant={widgetType === "chat" ? "default" : "outline"}
                  size="sm"
                  className="flex-1"
                >
                  <MessageCircle className="mr-1 h-3 w-3" />
                  Chat
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
