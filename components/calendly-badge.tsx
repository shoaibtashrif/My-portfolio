"use client"

import { useEffect } from "react"

declare global {
  interface Window {
    Calendly: any
  }
}

export default function CalendlyBadge() {
  useEffect(() => {
    // Load Calendly CSS
    const link = document.createElement("link")
    link.href = "https://assets.calendly.com/assets/external/widget.css"
    link.rel = "stylesheet"
    document.head.appendChild(link)

    // Load Calendly JS
    const script = document.createElement("script")
    script.src = "https://assets.calendly.com/assets/external/widget.js"
    script.type = "text/javascript"
    script.async = true
    document.body.appendChild(script)

    // Initialize the badge widget when script is loaded
    script.onload = () => {
      if (window.Calendly) {
        window.Calendly.initBadgeWidget({
          url: "https://calendly.com/shoaib-tashrif",
          text: "Schedule time with me",
          color: "#7850ff", // Using the primary color from your theme
          textColor: "#ffffff",
          branding: true,
        })
      }
    }

    // Clean up
    return () => {
      if (link.parentNode) link.parentNode.removeChild(link)
      if (script.parentNode) script.parentNode.removeChild(script)

      // Remove the Calendly badge if it exists
      const badges = document.querySelectorAll(".calendly-badge-widget")
      badges.forEach((badge) => {
        if (badge.parentNode) badge.parentNode.removeChild(badge)
      })
    }
  }, [])

  return null // This component doesn't render anything visible
}
