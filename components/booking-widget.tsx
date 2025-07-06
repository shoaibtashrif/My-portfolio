"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, CalendarIcon } from "lucide-react"
import type { BookingDetails } from "./booking-calendar"

export default function BookingWidget() {
  const [step, setStep] = useState<number>(1)
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [time, setTime] = useState<string>("")
  const [name, setName] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [topic, setTopic] = useState<string>("AI Implementation Consultation")
  const [isLoading, setIsLoading] = useState(false)
  const [bookingStatus, setBookingStatus] = useState<{ success: boolean; message: string } | null>(null)
  const [emailPreviewUrls, setEmailPreviewUrls] = useState<{ client: string; host: string } | null>(null)

  // Generate available time slots (9 AM to 5 PM)
  const timeSlots = Array.from({ length: 9 }, (_, i) => {
    const hour = i + 9
    return `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? "PM" : "AM"}`
  })

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (step === 1 && date && time) {
      setStep(2)
      return
    }

    if (step === 2 && name && email && validateEmail(email)) {
      setIsLoading(true)
      setBookingStatus(null)

      try {
        // Call the API to book the meeting
        const response = await fetch("/api/book-meeting", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            date,
            time,
            topic,
          } as BookingDetails),
        })

        const data = await response.json()

        if (data.success) {
          setBookingStatus({ success: true, message: data.message })
          setEmailPreviewUrls(data.previewUrls)
          setStep(3)
        } else {
          setBookingStatus({
            success: false,
            message:
              data.message ||
              "There was a problem scheduling your meeting. Please try again or contact Shoaib directly.",
          })
        }
      } catch (error) {
        console.error("Error booking meeting:", error)
        setBookingStatus({
          success: false,
          message: "There was an error processing your booking. Please try again later.",
        })
      } finally {
        setIsLoading(false)
      }
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

  // Function to reset the form
  const resetForm = () => {
    setStep(1)
    setDate(undefined)
    setTime("")
    setName("")
    setEmail("")
    setTopic("AI Implementation Consultation")
    setBookingStatus(null)
    setEmailPreviewUrls(null)
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg dark-glass bg-gray-800/40">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-primary" />
          Book a Session with Shoaib
        </CardTitle>
        <CardDescription className="text-gray-300">
          {step === 1
            ? "Select a date and time for your meeting"
            : step === 2
              ? "Enter your contact information"
              : "Your booking is complete!"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          {step === 1 && (
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
                    <SelectItem value="Multilingual AI Systems" className="text-white hover:bg-gray-700">
                      Multilingual AI Systems
                    </SelectItem>
                    <SelectItem value="Other" className="text-white hover:bg-gray-700">
                      Other
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 2 && (
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

          {step === 3 && (
            <div className="space-y-4">
              <Alert className={`bg-green-900/20 border-green-800`}>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <AlertTitle className="text-green-500">Booking Confirmed</AlertTitle>
                    <AlertDescription className="text-gray-300 text-sm">
                      Your meeting with Shoaib has been scheduled for {date?.toLocaleDateString()} at {time}.
                      {emailPreviewUrls && (
                        <div className="mt-2 text-xs">
                          <p>Since this is a demo, you can view the emails here:</p>
                          <div className="mt-1 space-y-1">
                            <a
                              href={emailPreviewUrls.client}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block text-primary hover:underline"
                            >
                              View your confirmation email
                            </a>
                            <a
                              href={emailPreviewUrls.host}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block text-primary hover:underline"
                            >
                              View Shoaib's notification email
                            </a>
                          </div>
                        </div>
                      )}
                    </AlertDescription>
                  </div>
                </div>
              </Alert>

              <div className="bg-gray-900/50 p-3 rounded-md">
                <h4 className="text-white font-medium mb-2">Booking Details</h4>
                <p className="text-gray-300 text-sm">
                  <span className="text-gray-400">Name:</span> {name}
                </p>
                <p className="text-gray-300 text-sm">
                  <span className="text-gray-400">Email:</span> {email}
                </p>
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

        {bookingStatus && step !== 3 && (
          <Alert
            className={`mt-4 ${bookingStatus.success ? "bg-green-900/20" : "bg-red-900/20"} border-${bookingStatus.success ? "green" : "red"}-800`}
          >
            <div className="flex items-start gap-2">
              {bookingStatus.success ? (
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
              )}
              <div>
                <AlertTitle className={`text-${bookingStatus.success ? "green" : "red"}-500`}>
                  {bookingStatus.success ? "Booking Confirmed" : "Booking Failed"}
                </AlertTitle>
                <AlertDescription className="text-gray-300 text-sm">{bookingStatus.message}</AlertDescription>
              </div>
            </div>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {step === 2 && (
          <Button variant="outline" onClick={() => setStep(1)} className="border-gray-700 text-white hover:bg-gray-700">
            Back
          </Button>
        )}
        {step === 3 ? (
          <Button onClick={resetForm} className="bg-primary hover:bg-primary/90 ml-auto">
            Book Another Session
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={isLoading || (step === 1 ? !date || !time : !name || !email || !validateEmail(email))}
            className="bg-primary hover:bg-primary/90 ml-auto"
          >
            {isLoading ? "Processing..." : step === 1 ? "Continue" : "Book Session"}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
