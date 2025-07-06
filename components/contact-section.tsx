"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, MessageSquare, Phone, CheckCircle, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"

export default function ContactSection() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{ success: boolean; message: string } | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const response = await fetch("/api/send-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSubmitStatus({
          success: true,
          message: "Your message has been sent successfully! I'll get back to you soon.",
        })
        setPreviewUrl(data.previewUrl)
        // Reset form
        setName("")
        setEmail("")
        setSubject("")
        setMessage("")
      } else {
        setSubmitStatus({
          success: false,
          message: data.message || "Failed to send message. Please try again or contact me directly.",
        })
      }
    } catch (error) {
      setSubmitStatus({
        success: false,
        message: "An error occurred. Please try again or contact me directly.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="py-16">
      <div className="text-center mb-16 animate-fadeIn">
        <h2 className="text-3xl font-bold mb-4 text-white">Get In Touch</h2>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Interested in working together? Have questions about my AI solutions? Let's connect!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <Card className="hover:shadow-lg transition-all hover:scale-105 animate-fadeIn dark-glass bg-gray-800/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Mail className="h-5 w-5 text-[#EA4335]" />
              Email
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              <Link
                href="mailto:shoaib.tashrif@gmail.com"
                className="hover:text-primary transition-colors text-gray-300"
              >
                shoaib.tashrif@gmail.com
              </Link>
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all hover:scale-105 animate-fadeIn animation-delay-100 dark-glass bg-gray-800/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Phone className="h-5 w-5 text-[#25D366]" />
              WhatsApp
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              <Link
                href="https://wa.me/923040610720"
                target="_blank"
                className="hover:text-primary transition-colors text-gray-300"
              >
                +92 304 0610720
              </Link>
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all hover:scale-105 animate-fadeIn animation-delay-200 dark-glass bg-gray-800/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <MessageSquare className="h-5 w-5 text-[#0077b5]" />
              LinkedIn
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              <Link
                href="https://www.linkedin.com/in/shoaibtashrif"
                target="_blank"
                className="hover:text-primary transition-colors text-gray-300"
                rel="noreferrer"
              >
                linkedin.com/in/shoaibtashrif
              </Link>
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      <Card className="max-w-2xl mx-auto mt-12 animate-slideUp dark-glass bg-gray-800/40">
        <CardHeader>
          <CardTitle className="text-white">Send Me a Message</CardTitle>
          <CardDescription className="text-gray-300">
            Fill out the form below and I'll get back to you as soon as possible.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {submitStatus && (
            <Alert
              className={`mb-6 ${
                submitStatus.success ? "bg-green-900/20 border-green-800" : "bg-red-900/20 border-red-800"
              }`}
            >
              {submitStatus.success ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
              <AlertTitle className={submitStatus.success ? "text-green-500" : "text-red-500"}>
                {submitStatus.success ? "Message Sent" : "Error"}
              </AlertTitle>
              <AlertDescription className="text-gray-300">
                {submitStatus.message}
                {previewUrl && (
                  <div className="mt-2">
                    <a
                      href={previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      View email preview (development only)
                    </a>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-gray-300">
                  Name
                </label>
                <Input
                  id="name"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 hover:border-primary focus:border-primary transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-300">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 hover:border-primary focus:border-primary transition-colors"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium text-gray-300">
                Subject
              </label>
              <Input
                id="subject"
                placeholder="What is this regarding?"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 hover:border-primary focus:border-primary transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium text-gray-300">
                Message
              </label>
              <Textarea
                id="message"
                placeholder="Your message"
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 hover:border-primary focus:border-primary transition-colors"
              />
            </div>
            <Button
              type="submit"
              className="w-full hover:scale-105 transition-transform bg-primary/80 hover:bg-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  )
}
