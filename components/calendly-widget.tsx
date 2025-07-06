"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CalendlyWidgetProps {
  onClose: () => void
}

export default function CalendlyWidget({ onClose }: CalendlyWidgetProps) {
  const calendlyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load the Calendly script
    const script = document.createElement("script")
    script.src = "https://assets.calendly.com/assets/external/widget.js"
    script.async = true
    document.body.appendChild(script)

    // Clean up
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [])

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg dark-glass bg-gray-800/40">
      <CardHeader className="bg-primary/10 border-b border-gray-700">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-white">Book a Session with Shoaib</CardTitle>
            <CardDescription className="text-gray-300">Select a convenient time for your consultation</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div
          ref={calendlyRef}
          className="calendly-inline-widget"
          data-url="https://calendly.com/shoaibtashrif/30min"
          style={{ minWidth: "320px", height: "700px" }}
        ></div>
      </CardContent>
    </Card>
  )
}
