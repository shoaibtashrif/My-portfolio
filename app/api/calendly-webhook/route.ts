import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const payload = await req.json()

    // Log the webhook payload
    console.log("Received Calendly webhook:", JSON.stringify(payload).substring(0, 200) + "...")

    // Handle different event types
    const eventType = payload.event

    if (eventType === "invitee.created") {
      // A new booking was created
      const { event, invitee } = payload.payload

      console.log(`New booking: ${invitee.name} (${invitee.email}) for ${event.start_time}`)

      // Here you could send a confirmation email, update a database, etc.
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error processing Calendly webhook:", error)
    return NextResponse.json({ success: false, error: "Failed to process webhook" }, { status: 500 })
  }
}
