"use client"

import type React from "react"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"

interface BookingCalendarProps {
  onClose: () => void
  onBookingComplete: (bookingDetails: BookingDetails) => void
}

export interface BookingDetails {
  name: string
  email: string
  date: Date
  time: string
  topic: string
}

export default function BookingCalendar({ onClose, onBookingComplete }: BookingCalendarProps) {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [time, setTime] = useState<string>("")
  const [name, setName] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [topic, setTopic] = useState<string>("AI Implementation Consultation")
  const [step, setStep] = useState<number>(1)

  // Generate available time slots (9 AM to 5 PM)
  const timeSlots = Array.from({ length: 9 }, (_, i) => {
    const hour = i + 9
    return `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? "PM" : "AM"}`
  })

  // Function to handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (step === 1 && date && time) {
      setStep(2)
      return
    }

    if (step === 2 && name && email && validateEmail(email)) {
      onBookingComplete({
        name,
        email,
        date: date!,
        time,
        topic,
      })
    }
  }

  // Function to validate email
  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  // Function to disable past dates
  const disabledDays = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-gray-800/80 border border-gray-700">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-white">Book a Session</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="h-5 w-5" />
          </Button>
        </div>
        <CardDescription className="text-gray-300">
          {step === 1 ? "Select a date and time for our meeting" : "Enter your contact information"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          {step === 1 ? (
            <div className="space-y-4">
              <div className="bg-gray-900/50 rounded-md p-2">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={disabledDays}
                  className="rounded-md border border-gray-700"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time" className="text-gray-300">
                  Select Time
                </Label>
                <Select value={time} onValueChange={setTime}>
                  <SelectTrigger id="time" className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select a time slot" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {timeSlots.map((slot) => (
                      <SelectItem key={slot} value={slot} className="text-white hover:bg-gray-700">
                        {slot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="topic" className="text-gray-300">
                  Meeting Topic
                </Label>
                <Select value={topic} onValueChange={setTopic}>
                  <SelectTrigger id="topic" className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select a topic" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="AI Implementation Consultation" className="text-white hover:bg-gray-700">
                      AI Implementation Consultation
                    </SelectItem>
                    <SelectItem value="Chatbot Development" className="text-white hover:bg-gray-700">
                      Chatbot Development
                    </SelectItem>
                    <SelectItem value="Voice AI Solutions" className="text-white hover:bg-gray-700">
                      Voice AI Solutions
                    </SelectItem>
                    <SelectItem value="Other" className="text-white hover:bg-gray-700">
                      Other
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-300">
                  Your Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">
                  Your Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="bg-gray-800 border-gray-700 text-white"
                />
                {email && !validateEmail(email) && (
                  <p className="text-red-500 text-sm">Please enter a valid email address</p>
                )}
              </div>

              <div className="bg-gray-900/50 p-3 rounded-md">
                <h4 className="text-white font-medium mb-2">Booking Summary</h4>
                <p className="text-gray-300 text-sm">
                  <span className="text-gray-400">Date:</span> {date?.toLocaleDateString()}
                </p>
                <p className="text-gray-300 text-sm">
                  <span className="text-gray-400">Time:</span> {time}
                </p>
                <p className="text-gray-300 text-sm">
                  <span className="text-gray-400">Topic:</span> {topic}
                </p>
              </div>
            </div>
          )}
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        {step === 2 && (
          <Button variant="outline" onClick={() => setStep(1)} className="border-gray-700 text-white hover:bg-gray-700">
            Back
          </Button>
        )}
        <Button
          onClick={handleSubmit}
          disabled={step === 1 ? !date || !time : !name || !email || !validateEmail(email)}
          className="bg-primary hover:bg-primary/90 ml-auto"
        >
          {step === 1 ? "Continue" : "Book Session"}
        </Button>
      </CardFooter>
    </Card>
  )
}
