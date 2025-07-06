"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mic, Send, StopCircle, Volume2, Calendar } from "lucide-react"
import Image from "next/image"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"
import { formatDate, formatTime } from "@/lib/calendly-service"

// Fallback responses when all APIs fail
const fallbackResponses = [
  "I'm Shoaib's AI assistant. He's an AI engineer with expertise in conversational AI, voice systems, and multilingual chatbots. How can I help you today?",
  "Shoaib has worked with companies like PTA, Wosler Corp Canada, and Orizen Technology, developing AI solutions for various business needs.",
  "Shoaib specializes in AI engineering, including local and cloud AI setup, speech-to-text, text-to-speech, and building multi-agent talkbot systems.",
  "Shoaib is currently available for consulting and project work. Would you like to schedule a meeting to discuss your AI needs?",
  "You can reach Shoaib via email at shoaib.tashrif@gmail.com or WhatsApp at +92 304 0610720.",
  "Shoaib has experience developing multilingual chatbots in English and Urdu, as well as voice AI systems for medical booking and customer support.",
]

// Booking states
type BookingState = "idle" | "asking_date_time" | "asking_email" | "asking_topic" | "confirming" | "completed"

interface AvailableSlot {
  startTime: string
  endTime: string
  formattedTime: string
}

export default function CustomerServiceTalkbot() {
  // Store chat messages in localStorage to persist until page reload
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(() => {
    if (typeof window !== "undefined") {
      const savedMessages = localStorage.getItem("chatMessages")
      return savedMessages
        ? JSON.parse(savedMessages)
        : [
            {
              role: "assistant",
              content:
                "Hi there! I'm Shoaib's AI assistant. How can I help you today? Feel free to ask about his experience, skills, or if you'd like to schedule a meeting.",
            },
          ]
    }
    return [
      {
        role: "assistant",
        content:
          "Hi there! I'm Shoaib's AI assistant. How can I help you today? Feel free to ask about his experience, skills, or if you'd like to schedule a meeting.",
      },
    ]
  })

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages))
  }, [messages])

  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [apiFailCount, setApiFailCount] = useState(0)
  const [usedMicrophone, setUsedMicrophone] = useState(false) // Track if user used microphone
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
            console.error("Speech recognition error", event.error)
            // Handle "no-speech" error gracefully
            if (event.error === "no-speech") {
              setMessages((prev) => [
                ...prev,
                {
                  role: "assistant",
                  content: "I couldn't hear anything. Please try speaking again or type your message.",
                },
              ])
            }
            setIsListening(false)
          }

          speechRecognitionRef.current.onend = () => {
            setIsListening(false)
          }
        } catch (e) {
          console.error("Error initializing speech recognition:", e)
        }
      }
    }

    return () => {
      if (speechRecognitionRef.current) {
        try {
          speechRecognitionRef.current.abort()
        } catch (e) {
          console.error("Error aborting speech recognition:", e)
        }
      }
      if (speechSynthesisRef.current && window.speechSynthesis) {
        try {
          window.speechSynthesis.cancel()
        } catch (e) {
          console.error("Error canceling speech synthesis:", e)
        }
      }
    }
  }, [])

  // Function to parse natural language date and time
  const parseDateTime = (input: string): { date: string; time: string } | null => {
    try {
      // Current date for reference
      const now = new Date()
      let date = now
      let hours = 9 // Default to 9 AM
      let minutes = 0

      // Common time patterns
      const timePatterns = [
        {
          regex: /(\d{1,2})\s*(am|pm)/i,
          handler: (match: RegExpMatchArray) => {
            let h = Number.parseInt(match[1])
            if (match[2].toLowerCase() === "pm" && h < 12) h += 12
            if (match[2].toLowerCase() === "am" && h === 12) h = 0
            hours = h
          },
        },
        {
          regex: /(\d{1,2}):(\d{2})\s*(am|pm)/i,
          handler: (match: RegExpMatchArray) => {
            let h = Number.parseInt(match[1])
            if (match[3].toLowerCase() === "pm" && h < 12) h += 12
            if (match[3].toLowerCase() === "am" && h === 12) h = 0
            hours = h
            minutes = Number.parseInt(match[2])
          },
        },
        {
          regex: /(\d{1,2})\s*o'clock/i,
          handler: (match: RegExpMatchArray) => {
            hours = Number.parseInt(match[1])
          },
        },
        {
          regex: /morning/i,
          handler: () => {
            hours = 9
          },
        },
        {
          regex: /noon/i,
          handler: () => {
            hours = 12
            minutes = 0
          },
        },
        {
          regex: /afternoon/i,
          handler: () => {
            hours = 14
          },
        },
        {
          regex: /evening/i,
          handler: () => {
            hours = 18
          },
        },
      ]

      // Common date patterns
      const datePatterns = [
        {
          regex: /today/i,
          handler: () => {
            date = new Date()
          },
        },
        {
          regex: /tomorrow/i,
          handler: () => {
            date = new Date()
            date.setDate(date.getDate() + 1)
          },
        },
        {
          regex: /next\s*(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i,
          handler: (match: RegExpMatchArray) => {
            const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
            const targetDay = days.indexOf(match[1].toLowerCase())
            const currentDay = date.getDay()
            let daysToAdd = targetDay - currentDay
            if (daysToAdd <= 0) daysToAdd += 7
            date.setDate(date.getDate() + daysToAdd)
          },
        },
        {
          regex: /(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i,
          handler: (match: RegExpMatchArray) => {
            const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
            const targetDay = days.indexOf(match[1].toLowerCase())
            const currentDay = date.getDay()
            let daysToAdd = targetDay - currentDay
            if (daysToAdd <= 0) daysToAdd += 7
            date.setDate(date.getDate() + daysToAdd)
          },
        },
        {
          regex: /(\d{1,2})[/-](\d{1,2})(?:[/-](\d{2,4}))?/i,
          handler: (match: RegExpMatchArray) => {
            const month = Number.parseInt(match[1]) - 1
            const day = Number.parseInt(match[2])
            let year = match[3] ? Number.parseInt(match[3]) : date.getFullYear()
            if (year < 100) year += 2000
            date = new Date(year, month, day)
          },
        },
        {
          regex: /(\d{4})[/-](\d{1,2})[/-](\d{1,2})/i,
          handler: (match: RegExpMatchArray) => {
            const year = Number.parseInt(match[1])
            const month = Number.parseInt(match[2]) - 1
            const day = Number.parseInt(match[3])
            date = new Date(year, month, day)
          },
        },
      ]

      // Check for time patterns
      for (const pattern of timePatterns) {
        const match = input.match(pattern.regex)
        if (match) {
          pattern.handler(match)
          break
        }
      }

      // Check for date patterns
      for (const pattern of datePatterns) {
        const match = input.match(pattern.regex)
        if (match) {
          pattern.handler(match)
          break
        }
      }

      // Ensure the date is in the future
      if (date < now) {
        if (hours < now.getHours()) {
          date.setDate(date.getDate() + 1)
        }
      }

      // Set the time
      date.setHours(hours, minutes, 0, 0)

      // Format the date and time
      const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
      const formattedTime = `${hours % 12 || 12}:${String(minutes).padStart(2, "0")} ${hours >= 12 ? "PM" : "AM"}`

      return { date: formattedDate, time: formattedTime }
    } catch (error) {
      console.error("Error parsing date/time:", error)
      return null
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

  // Function to process booking-related user input
  const processBookingInput = (userInput: string) => {
    switch (bookingState) {
      case "asking_date_time":
        // Try to parse natural language date and time
        const dateTime = parseDateTime(userInput)

        if (dateTime) {
          setSelectedDate(dateTime.date)
          setSelectedTime(dateTime.time)
          checkAvailabilityForDate(dateTime.date, dateTime.time)
        } else {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content:
                "I'm having trouble understanding that date and time. Could you please specify when you'd like to meet? For example, 'tomorrow at 2pm' or 'next Monday at 10am'.",
            },
          ])
        }
        break

      case "asking_email":
        // Simple email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (emailRegex.test(userInput)) {
          setUserEmail(userInput)
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: "Perfect! What topic would you like to discuss with Shoaib during this session?",
            },
          ])
          setBookingState("asking_topic")
        } else {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content:
                "That doesn't look like a valid email address. Please provide a valid email so we can send you the meeting details.",
            },
          ])
        }
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

  // Function to handle real speech recognition
  const toggleListening = () => {
    if (isListening) {
      if (speechRecognitionRef.current) {
        try {
          speechRecognitionRef.current.abort()
        } catch (e) {
          console.error("Error aborting speech recognition:", e)
        }
      }
      setIsListening(false)
    } else {
      setUsedMicrophone(true) // Mark that user has used microphone
      if (speechRecognitionRef.current) {
        try {
          speechRecognitionRef.current.start()
          setIsListening(true)
        } catch (error) {
          console.error("Error starting speech recognition:", error)
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content:
                "I'm having trouble accessing your microphone. Please check your browser permissions or try typing instead.",
            },
          ])
        }
      } else {
        // Fallback if speech recognition is not available
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Speech recognition is not supported in your browser. Please type your message instead.",
          },
        ])
      }
    }
  }

  // Function for text-to-speech with improved voice quality
  const speakMessage = (message: string) => {
    if ("speechSynthesis" in window) {
      // If already speaking, stop it
      if (isSpeaking) {
        window.speechSynthesis.cancel()
        setIsSpeaking(false)
        speechSynthesisRef.current = null
        return
      }

      // Cancel any ongoing speech
      window.speechSynthesis.cancel()

      try {
        // Create a new utterance
        const utterance = new SpeechSynthesisUtterance(message)
        speechSynthesisRef.current = utterance

        // Set properties for better voice quality
        utterance.lang = "en-US"
        utterance.rate = 0.9 // Slightly slower for better clarity
        utterance.pitch = 1.1 // Slightly higher pitch for more natural sound
        utterance.volume = 1.0 // Maximum volume

        // Get available voices
        const voices = window.speechSynthesis.getVoices()

        // If no voices are available yet, wait for them to load
        if (voices.length === 0) {
          window.speechSynthesis.onvoiceschanged = () => {
            const allVoices = window.speechSynthesis.getVoices()

            // Try to find a high-quality voice in this order of preference
            const preferredVoice =
              allVoices.find((voice) => voice.name.includes("Google") && voice.name.includes("Female")) ||
              allVoices.find((voice) => voice.name.includes("Samantha")) ||
              allVoices.find((voice) => voice.name.includes("Google")) ||
              allVoices.find((voice) => voice.name.includes("Female")) ||
              allVoices.find((voice) => voice.lang === "en-US" && voice.localService === false) ||
              allVoices[0] // Fallback to first available voice

            if (preferredVoice) {
              utterance.voice = preferredVoice
              console.log("Using voice:", preferredVoice.name)
            }

            // Speak the message
            try {
              // Pre-process the message to improve pronunciation
              utterance.text = improveTextForSpeech(message)

              window.speechSynthesis.speak(utterance)
              setIsSpeaking(true)
            } catch (e) {
              console.error("Speech synthesis error:", e)
              setIsSpeaking(false)
            }
          }
        } else {
          // Try to find a high-quality voice
          const preferredVoice =
            voices.find((voice) => voice.name.includes("Google") && voice.name.includes("Female")) ||
            voices.find((voice) => voice.name.includes("Samantha")) ||
            voices.find((voice) => voice.name.includes("Google")) ||
            voices.find((voice) => voice.name.includes("Female")) ||
            voices.find((voice) => voice.lang === "en-US" && voice.localService === false) ||
            voices[0] // Fallback to first available voice

          if (preferredVoice) {
            utterance.voice = preferredVoice
            console.log("Using voice:", preferredVoice.name)
          }

          // Pre-process the message to improve pronunciation
          utterance.text = improveTextForSpeech(message)

          // Speak the message
          window.speechSynthesis.speak(utterance)
          setIsSpeaking(true)
        }

        // Set event handlers
        utterance.onstart = () => {
          setIsSpeaking(true)
        }

        utterance.onend = () => {
          setIsSpeaking(false)
          speechSynthesisRef.current = null
        }

        utterance.onerror = (event) => {
          console.error("Speech synthesis error:", event)
          setIsSpeaking(false)
          speechSynthesisRef.current = null
        }
      } catch (e) {
        console.error("Error initializing speech synthesis:", e)
        setIsSpeaking(false)
      }
    } else {
      // Fallback for browsers without speech synthesis
      console.log("Speech synthesis not supported")
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Speech synthesis is not supported in your browser.",
        },
      ])
    }
  }

  // Helper function to improve text for speech synthesis
  const improveTextForSpeech = (text: string) => {
    // Replace abbreviations and symbols with full words for better pronunciation
    let improvedText = text
      .replace(/AI/g, "A.I.")
      .replace(/LLM/g, "L.L.M.")
      .replace(/NLP/g, "N.L.P.")
      .replace(/API/g, "A.P.I.")
      .replace(/AWS/g, "A.W.S.")
      .replace(/UI/g, "U.I.")
      .replace(/UX/g, "U.X.")
      .replace(/&/g, " and ")
      .replace(/\+/g, " plus ")
      .replace(/-/g, " ")
      .replace(/\//g, " or ")
      .replace(/@/g, " at ")
      .replace(/(\d+):(\d+)/g, "$1 $2") // Improve time pronunciation
      .replace(/(\d{4})-(\d{2})-(\d{2})/g, "$1 $2 $3") // Improve date pronunciation

    // Add pauses with commas for better rhythm
    improvedText = improvedText.replace(/\. /g, ". , ").replace(/! /g, "! , ").replace(/\? /g, "? , ")

    return improvedText
  }

  // Handle key press to prevent default Enter behavior
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault() // Prevent default behavior (form submission)
      handleSubmit(e as unknown as React.FormEvent, false) // Pass false to indicate text input
    }
  }

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current && chatContainerRef.current) {
      // Use scrollIntoView with block: "nearest" to prevent page scrolling
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" })
    }
  }, [messages])

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg dark-glass bg-gray-800/40">
      <CardHeader className="bg-primary/10 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-primary/20 flex items-center justify-center">
            <Image src="/profile-image-new.png" alt="Shoaib Tashrif" width={40} height={40} className="object-cover" />
          </div>
          <div>
            <CardTitle className="text-white">Shoaib's Personal Assistant</CardTitle>
            <CardDescription className="text-gray-300">
              Ask me anything about Shoaib's skills and experience
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex flex-col h-[400px]">
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 grid-pattern">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                {message.content === "booking_widget" ? (
                  <div className="max-w-[80%] rounded-lg p-3 bg-gray-800/70 text-gray-200">
                    <p className="mb-2">You can book a session here:</p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button onClick={openCalendlyWidget} className="bg-primary hover:bg-primary/90">
                        <Calendar className="mr-2 h-4 w-4" />
                        Open Calendly
                      </Button>
                    </div>
                  </div>
                ) : message.content === "booking_buttons" ? (
                  <div className="max-w-[80%] rounded-lg p-3 bg-gray-800/70 text-gray-200">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button onClick={handleBookingRequest} className="bg-primary hover:bg-primary/90">
                        Book a Session
                      </Button>
                      <Button
                        onClick={() =>
                          setMessages((prev) => [...prev, { role: "user", content: "No thanks, I'll book later" }])
                        }
                        variant="outline"
                        className="border-gray-700 text-white hover:bg-gray-700"
                      >
                        Not Now
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === "user" ? "bg-primary/80 text-white" : "bg-gray-800/70 text-gray-200"
                    }`}
                  >
                    <p>{message.content}</p>
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg p-3 bg-gray-800/70">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                    <div
                      className="w-2 h-2 rounded-full bg-primary animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                    <div
                      className="w-2 h-2 rounded-full bg-primary animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    />
                  </div>
                </div>
              </div>
            )}
            {apiFailCount > 2 && (
              <Alert className="bg-amber-900/20 border-amber-800">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                <AlertTitle className="text-amber-500">Connection Issues</AlertTitle>
                <AlertDescription className="text-gray-300 text-sm">
                  I'm having trouble connecting to my knowledge base. You can still ask questions, but for the best
                  experience, consider using the booking widget to schedule a call with Shoaib directly.
                </AlertDescription>
              </Alert>
            )}
            {bookingState === "completed" && (
              <Alert className="bg-green-900/20 border-green-800">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertTitle className="text-green-500">Booking Confirmed</AlertTitle>
                <AlertDescription className="text-gray-300 text-sm">
                  Your session with Shoaib has been scheduled. You'll receive a confirmation email shortly.
                </AlertDescription>
              </Alert>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="border-t border-gray-700 p-4 bg-gray-900/50">
            <form onSubmit={(e) => handleSubmit(e, false)} className="flex items-center gap-2">
              <Button
                type="button"
                size="icon"
                variant={isListening ? "destructive" : "outline"}
                className="rounded-full bg-gray-800/70 border-gray-700"
                onClick={toggleListening}
              >
                {isListening ? <StopCircle className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
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
                className="flex-1 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400"
                disabled={isLoading || isListening}
              />
              <Button
                type="submit"
                size="icon"
                className="rounded-full bg-primary hover:bg-primary/90"
                disabled={isLoading || input.trim() === ""}
              >
                <Send className="h-5 w-5" />
              </Button>
              {messages.length > 1 && usedMicrophone && (
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  className={`rounded-full bg-gray-800/70 border-gray-700 ${isSpeaking ? "bg-red-500/20" : ""}`}
                  onClick={() => speakMessage(messages[messages.length - 1].content)}
                >
                  {isSpeaking ? <StopCircle className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </Button>
              )}
            </form>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-primary/10 border-t border-gray-700 text-xs text-gray-400">
        <p>Shoaib's Personal AI Assistant • Ask about skills, experience, or book a session</p>
      </CardFooter>
    </Card>
  )
}
