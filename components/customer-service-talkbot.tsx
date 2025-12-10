"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mic, Send, StopCircle, Volume2, Calendar, Bot, User } from "lucide-react"
import Image from "next/image"
import { formatDate, formatTime } from "@/lib/calendly-service"

// Type declarations for Speech Recognition
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

// Booking states
type BookingState = "idle" | "asking_date_time" | "asking_email" | "asking_topic" | "confirming" | "completed"

interface AvailableSlot {
  startTime: string
  endTime: string
  formattedTime: string
}

export default function CustomerServiceTalkbot() {
  // Initialize with a consistent state to avoid hydration mismatch
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    {
      role: "assistant",
      content:
        "Hi there! I'm Shoaib's AI assistant. How can I help you today? Feel free to ask about his experience, skills, or if you'd like to schedule a meeting.",
    },
  ])

  // Save messages to localStorage whenever they change (only on client)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedMessages = localStorage.getItem("chatMessages")
      if (savedMessages) {
        try {
          const parsedMessages = JSON.parse(savedMessages)
          if (parsedMessages.length > 0) {
            setMessages(parsedMessages)
          }
        } catch (error) {
          console.error("Error parsing saved messages:", error)
        }
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("chatMessages", JSON.stringify(messages))
    }
  }, [messages])

  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const speechRecognitionRef = useRef<any>(null)
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null)

  // Booking state
  const [bookingState, setBookingState] = useState<BookingState>("idle")
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [userEmail, setUserEmail] = useState<string>("")
  const [bookingTopic, setBookingTopic] = useState<string>("")
  const [eventTypeUri, setEventTypeUri] = useState<string>("")
  const [schedulingUrl, setSchedulingUrl] = useState<string>("")
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([])

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check if SpeechRecognition is available
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

      if (SpeechRecognition) {
        try {
          speechRecognitionRef.current = new SpeechRecognition()
          speechRecognitionRef.current.continuous = false
          speechRecognitionRef.current.interimResults = false
          speechRecognitionRef.current.lang = "en-US"

          speechRecognitionRef.current.onresult = (event: any) => {
            try {
              const transcript = event.results[0][0].transcript
              setInput(transcript)
              // Auto-submit when speech is recognized
              setTimeout(() => {
                setIsListening(false)
                // Automatically submit the form with the recognized speech
                const formEvent = new Event("submit", { cancelable: true, bubbles: true }) as unknown as React.FormEvent
                handleSubmit(formEvent, true) // Pass true to indicate speech input
              }, 500)
            } catch (e) {
              console.error("Error processing speech result:", e)
              setIsListening(false)
            }
          }

          speechRecognitionRef.current.onerror = (event: any) => {
            console.error("Speech recognition error:", event.error)
            setIsListening(false)
          }

          speechRecognitionRef.current.onend = () => {
            setIsListening(false)
          }
        } catch (error) {
          console.error("Error initializing speech recognition:", error)
        }
      }
    }
  }, [])

  // Function to toggle listening
  const toggleListening = () => {
    if (isListening) {
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.stop()
      }
      setIsListening(false)
    } else {
      if (speechRecognitionRef.current) {
        try {
          speechRecognitionRef.current.start()
          setIsListening(true)
        } catch (error) {
          console.error("Error starting speech recognition:", error)
          setIsListening(false)
        }
      }
    }
  }

  // Function to speak a message
  const speakMessage = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      // Stop any current speech
      if (speechSynthesisRef.current) {
        window.speechSynthesis.cancel()
      }

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.volume = 0.8

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)

      speechSynthesisRef.current = utterance
      window.speechSynthesis.speak(utterance)
    }
  }

  // Function to stop speaking
  const stopSpeaking = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  // Function to handle booking flow
  const handleBookingRequest = async () => {
    setBookingState("asking_date_time")

    // Immediately provide the Calendly widget option
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content:
          "I'd be happy to help you book a session with Shoaib. You can book directly using the Calendly widget below, or tell me when you'd like to schedule your meeting (e.g., 'tomorrow at 2pm').",
      },
      {
        role: "assistant",
        content: "booking_widget", // Special message type for calendar widget button
      },
    ])
  }

  // Function to check availability for a date
  const checkAvailabilityForDate = async (date: string, time: string) => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/calendly-availability", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ date }),
      })

      const data = await response.json()

      if (data.success && data.availableSlots && data.availableSlots.length > 0) {
        setAvailableSlots(data.availableSlots)
        setEventTypeUri(data.eventTypeUri)
        setSchedulingUrl(data.schedulingUrl)

        // Check if the requested time is available
        const requestedTime = time
        const formattedDate = formatDate(date)

        // Find the closest available time slot
        const availableTimes = data.availableSlots.map((slot: AvailableSlot) => slot.formattedTime)

        // Check if the exact time is available
        if (availableTimes.includes(time) || availableTimes.some((t: string) => t.includes(time))) {
          setSelectedTime(time)
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: `Great! ${formattedDate} at ${time} works for Shoaib. Could you please provide your email address so we can send you the meeting details?`,
            },
          ])
          setBookingState("asking_email")
        } else {
          // Suggest available times
          const timeOptions = availableTimes.join(", ")
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: `I'm sorry, but ${time} doesn't seem to be available on ${formattedDate}. Shoaib is available at these times: ${timeOptions}. Which time would work for you?`,
            },
          ])
        }
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `I'm sorry, but Shoaib doesn't have any available slots on ${formatDate(date)}. Could you please suggest another date?`,
          },
        ])
      }
    } catch (error) {
      console.error("Error checking availability:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I'm having trouble checking Shoaib's availability right now. Would you like to use the calendar widget instead?",
        },
        {
          role: "assistant",
          content: "booking_widget", // Special message type for calendar widget button
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  // Function to create a scheduling link
  const createBooking = async () => {
    setIsLoading(true)

    try {
      // Find the selected time slot
      const selectedSlot = availableSlots.find(
        (slot) => formatTime(slot.startTime) === selectedTime || slot.formattedTime === selectedTime,
      )

      if (!selectedSlot) {
        throw new Error("Selected time slot not found")
      }

      const response = await fetch("/api/calendly-scheduling-link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventTypeUri,
          startTime: selectedSlot.startTime,
          isMock: eventTypeUri === "mock-event-type-uri",
          email: userEmail,
          name: "Website Visitor",
          topic: bookingTopic,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to create booking: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        // Format the booking confirmation
        const formattedDate = formatDate(selectedDate)

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `Perfect! I've booked a session with Shoaib for you on ${formattedDate} at ${selectedTime}. Here's your booking link: ${data.bookingUrl}`,
          },
          {
            role: "assistant",
            content:
              "You'll receive a confirmation email shortly with the meeting details. Is there anything else I can help you with today?",
          },
        ])

        // Reset booking state
        setBookingState("completed")
      } else {
        throw new Error("Failed to create booking")
      }
    } catch (error) {
      console.error("Error creating booking:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I'm having trouble creating your booking right now. Would you like to use the calendar widget instead?",
        },
        {
          role: "assistant",
          content: "booking_widget", // Special message type for calendar widget button
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  // Function to process booking input
  const processBookingInput = (userInput: string) => {
    switch (bookingState) {
      case "asking_date_time":
        // Extract date and time from user input
        const dateTimeMatch = userInput.match(/(\w+)\s+at\s+(\d+(?::\d+)?\s*(?:am|pm)?)/i)
        if (dateTimeMatch) {
          const [, dateStr, timeStr] = dateTimeMatch
          // Convert relative dates to actual dates
          let actualDate = new Date()
          if (dateStr.toLowerCase().includes("tomorrow")) {
            actualDate.setDate(actualDate.getDate() + 1)
          } else if (dateStr.toLowerCase().includes("next")) {
            actualDate.setDate(actualDate.getDate() + 7)
          }
          const formattedDate = actualDate.toISOString().split("T")[0]
          setSelectedDate(formattedDate)
          setSelectedTime(timeStr)
          checkAvailabilityForDate(formattedDate, timeStr)
        } else {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content:
                "I didn't understand that format. Could you please specify a date and time? For example: 'tomorrow at 2pm' or 'next Monday at 3pm'.",
            },
          ])
        }
        break

      case "asking_email":
        setUserEmail(userInput)
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Great! What would you like to discuss with Shoaib? (e.g., AI consultation, project discussion, etc.)",
          },
        ])
        setBookingState("asking_topic")
        break

      case "asking_topic":
        setBookingTopic(userInput)
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `Great! To confirm, you'd like to book a session with Shoaib on ${formatDate(selectedDate)} at ${selectedTime} to discuss "${userInput}". Is that correct? (Yes/No)`,
          },
        ])
        setBookingState("confirming")
        break

      case "confirming":
        if (
          userInput.toLowerCase().includes("yes") ||
          userInput.toLowerCase().includes("correct") ||
          userInput.toLowerCase().includes("confirm")
        ) {
          createBooking()
        } else {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content:
                "No problem. Let's start over. When would you like to schedule your meeting with Shoaib? You can say something like 'tomorrow at 2pm' or 'next Monday afternoon'.",
            },
          ])
          setBookingState("asking_date_time")
        }
        break

      default:
        // Handle regular chat
        return false
    }

    return true // Input was processed as part of booking flow
  }

  // Function to open Calendly widget
  const openCalendlyWidget = () => {
    if (window.Calendly) {
      window.Calendly.showPopupWidget("https://calendly.com/shoaib-tashrif")
    }
  }

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent, fromSpeech = false) => {
    e.preventDefault()
    if (input.trim() === "") return

    // Add user message to chat
    const userMessage = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Check if this is part of the booking flow
    if (bookingState !== "idle" && bookingState !== "completed") {
      const wasProcessed = processBookingInput(userMessage.content)
      if (wasProcessed) {
        return // Skip the regular chat flow
      }
    }

    setIsLoading(true)

    // Check if this is a booking request
    const isBookingRequest =
      userMessage.content.toLowerCase().includes("book") ||
      userMessage.content.toLowerCase().includes("schedule") ||
      userMessage.content.toLowerCase().includes("appointment") ||
      userMessage.content.toLowerCase().includes("meeting") ||
      userMessage.content.toLowerCase().includes("session") ||
      userMessage.content.toLowerCase().includes("calendar") ||
      userMessage.content.toLowerCase().includes("availability")

    if (isBookingRequest && bookingState === "idle") {
      handleBookingRequest()
      setIsLoading(false)
      return
    }

    // Use the simple chat API directly
    try {
      const response = await fetch("/api/chat-simple", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.response) {
          // Add the response to the chat
          setMessages((prev) => [...prev, { role: "assistant", content: data.response }])

          // Only speak the response if the input came from speech
          if (fromSpeech) {
            speakMessage(data.response)
          }
        } else {
          throw new Error("No response from API")
        }
      } else {
        throw new Error(`API error: ${response.status}`)
      }
    } catch (error) {
      console.error("Error in chat:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm having trouble connecting right now. Please try again in a moment.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  // Handle key press to prevent default Enter behavior
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault() // Prevent default behavior (form submission)
      handleSubmit(e as unknown as React.FormEvent, false) // Pass false to indicate text input
    }
  }

  // Auto-scroll to bottom when messages change
  const isFirstRender = useRef(true)

  useEffect(() => {
    // Skip scroll on first render
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    if (chatContainerRef.current) {
      // Use scrollTop to scroll the container ONLY, not the whole page
      const { scrollHeight, clientHeight } = chatContainerRef.current
      chatContainerRef.current.scrollTo({
        top: scrollHeight - clientHeight,
        behavior: "smooth",
      })
    }
  }, [messages])

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-2xl bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
      <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-white/20 flex items-center justify-center">
            <Image src="/profile-image-new.png" alt="Shoaib Tashrif" width={48} height={48} className="object-cover" />
          </div>
          <div>
            <CardTitle className="text-white text-lg sm:text-xl">Shoaib's AI Assistant</CardTitle>
            <CardDescription className="text-gray-200 text-sm">
              Ask me anything about Shoaib's skills and experience
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex flex-col h-[500px] sm:h-[600px]">
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900/50">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                {message.content === "booking_widget" ? (
                  <div className="max-w-[85%] rounded-2xl p-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 text-gray-200">
                    <p className="mb-3 text-sm">You can book a session here:</p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button onClick={openCalendlyWidget} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                        <Calendar className="mr-2 h-4 w-4" />
                        Open Calendly
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 ${message.role === "user"
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                      : "bg-gradient-to-r from-gray-800/80 to-gray-700/80 text-gray-200 border border-gray-600/50"
                      }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.role === "user" ? "bg-white/20" : "bg-indigo-600/20"
                        }`}>
                        {message.role === "user" ? (
                          <User className="h-4 w-4 text-white" />
                        ) : (
                          <Bot className="h-4 w-4 text-indigo-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm sm:text-base leading-relaxed">{message.content}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-2xl p-4 bg-gradient-to-r from-gray-800/80 to-gray-700/80 border border-gray-600/50">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-600/20 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-indigo-400" />
                    </div>
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" />
                      <div
                        className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                      <div
                        className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-gray-700 p-4 bg-gray-900/80">
            <form onSubmit={(e) => handleSubmit(e, false)} className="flex items-center gap-3">
              <Button
                type="button"
                size="icon"
                variant={isListening ? "destructive" : "outline"}
                className="rounded-full bg-gray-800/70 border-gray-600 hover:bg-gray-700 flex-shrink-0"
                onClick={toggleListening}
              >
                {isListening ? <StopCircle className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  bookingState === "asking_date_time"
                    ? "Enter when you'd like to meet (e.g., tomorrow at 2pm)"
                    : bookingState === "asking_email"
                      ? "Enter your email"
                      : bookingState === "asking_topic"
                        ? "Enter meeting topic"
                        : bookingState === "confirming"
                          ? "Type 'yes' to confirm"
                          : "Ask about Shoaib's experience or skills..."
                }
                className="flex-1 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 text-sm sm:text-base rounded-xl"
                disabled={isLoading || isListening}
              />
              <Button
                type="submit"
                size="icon"
                className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 flex-shrink-0"
                disabled={isLoading || input.trim() === ""}
              >
                <Send className="h-4 w-4" />
              </Button>
              {messages.length > 1 && (
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  className={`rounded-full bg-gray-800/70 border-gray-600 flex-shrink-0 ${isSpeaking ? "bg-red-500/20" : ""}`}
                  onClick={() => speakMessage(messages[messages.length - 1].content)}
                >
                  {isSpeaking ? <StopCircle className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
              )}
            </form>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-900/50 border-t border-gray-700 text-xs text-gray-400">
        <p>Shoaib's Personal AI Assistant • Powered by AI</p>
      </CardFooter>
    </Card>
  )
}
