import { NextResponse } from "next/server"
import { createSchedulingLink } from "@/lib/calendly-service"

export async function POST(req: Request) {
  try {
    const { eventTypeUri, startTime, isMock, email, name, topic } = await req.json()

    if (!eventTypeUri || !startTime) {
      return NextResponse.json(
        { success: false, message: "Event type URI and start time are required" },
        { status: 400 },
      )
    }

    // If this is mock data, return a direct Calendly link
    if (isMock || eventTypeUri === "mock-event-type-uri") {
      // Extract the date and time for the URL
      const date = new Date(startTime)
      const formattedDate = date.toISOString().split("T")[0] // YYYY-MM-DD
      const hour = date.getHours()
      const minute = date.getMinutes()

      // Create a direct link to Calendly with the date and time
      const bookingUrl = `https://calendly.com/shoaib-tashrif/30min?date=${formattedDate}&time=${hour}:${minute}`

      // Try to create an actual booking via the Calendly API
      try {
        const CALENDLY_API_TOKEN =
          "eyJraWQiOiIxY2UxZTEzNjE3ZGNmNzY2YjNjZWJjY2Y4ZGM1YmFmYThhNjVlNjg0MDIzZjdjMzJiZTgzNDliMjM4MDEzNWI0IiwidHlwIjoiUEFUIiwiYWxnIjoiRVMyNTYifQ.eyJpc3MiOiJodHRwczovL2F1dGguY2FsZW5kbHkuY29tIiwiaWF0IjoxNzQ3MjEyODk1LCJqdGkiOiI2NTBmYzk1Ni1hNjM5LTRiZjEtYjZkNS04NTFjM2Y4MWJhZWIiLCJ1c2VyX3V1aWQiOiI2YjdjY2Q3Yy1mMmJkLTQ4MzMtODY0YS01YzU0MmViZDkwNWIifQ.n4nK5rNcxXOb9lU7erbOHrNWyQC55z3g9k_0cOeES23FGz7UVgdYzGhWVZ8G92qLhcQr5oXruqk0pw_3kfzGGQ"

        // Get the event type details
        const eventTypeResponse = await fetch("https://api.calendly.com/event_types", {
          headers: {
            Authorization: `Bearer ${CALENDLY_API_TOKEN}`,
            "Content-Type": "application/json",
          },
        })

        if (eventTypeResponse.ok) {
          const eventTypeData = await eventTypeResponse.json()
          const eventType = eventTypeData.collection[0]

          if (eventType) {
            // Create an invitee for the event
            const createInviteeResponse = await fetch("https://api.calendly.com/scheduled_events", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${CALENDLY_API_TOKEN}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                event_type_uri: eventType.uri,
                start_time: startTime,
                email: email || "visitor@example.com",
                name: name || "Website Visitor",
                questions_and_answers: [
                  {
                    question: "What would you like to discuss?",
                    answer: topic || "AI Consultation",
                  },
                ],
              }),
            })

            if (createInviteeResponse.ok) {
              console.log("Successfully created Calendly booking")
            } else {
              console.error("Failed to create Calendly booking:", await createInviteeResponse.text())
            }
          }
        }
      } catch (bookingError) {
        console.error("Error creating direct Calendly booking:", bookingError)
      }

      return NextResponse.json({
        success: true,
        bookingUrl,
      })
    }

    try {
      const bookingUrl = await createSchedulingLink(eventTypeUri, startTime)

      return NextResponse.json({
        success: true,
        bookingUrl,
      })
    } catch (linkError) {
      console.error("Error creating scheduling link:", linkError)

      // Fallback to direct Calendly link
      const date = new Date(startTime)
      const formattedDate = date.toISOString().split("T")[0] // YYYY-MM-DD
      const hour = date.getHours()
      const minute = date.getMinutes()

      const bookingUrl = `https://calendly.com/shoaib-tashrif/30min?date=${formattedDate}&time=${hour}:${minute}`

      return NextResponse.json({
        success: true,
        bookingUrl,
        isFallback: true,
      })
    }
  } catch (error) {
    console.error("Error creating scheduling link:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create scheduling link",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
