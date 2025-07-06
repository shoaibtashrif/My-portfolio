import { NextResponse } from "next/server"
import { checkAvailability } from "@/lib/calendly-service"

export async function POST(req: Request) {
  try {
    const { date } = await req.json()

    if (!date) {
      return NextResponse.json({ success: false, message: "Date is required" }, { status: 400 })
    }

    try {
      const availability = await checkAvailability(date)

      // Check if we have any available slots
      if (availability.availableSlots.length === 0) {
        return NextResponse.json({
          success: false,
          message: "No available slots found for this date",
          date: date,
        })
      }

      return NextResponse.json({
        success: true,
        date: availability.date,
        availableSlots: availability.availableSlots,
        schedulingUrl: availability.schedulingUrl,
        eventTypeUri: availability.eventTypeUri,
      })
    } catch (availabilityError) {
      console.error("Error in availability check:", availabilityError)

      // Return a fallback response with mock data
      const mockDate = new Date(date)
      const availableSlots = []

      // Generate mock time slots
      for (let hour = 9; hour <= 17; hour++) {
        const slotDate = new Date(date)
        slotDate.setHours(hour, 0, 0, 0)

        availableSlots.push({
          startTime: slotDate.toISOString(),
          endTime: new Date(slotDate.getTime() + 60 * 60 * 1000).toISOString(),
          formattedTime: `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? "PM" : "AM"}`,
        })
      }

      return NextResponse.json({
        success: true,
        date: date,
        availableSlots: availableSlots,
        schedulingUrl: "https://calendly.com/shoaib-tashrif",
        eventTypeUri: "mock-event-type-uri",
        isMock: true,
      })
    }
  } catch (error) {
    console.error("Error checking availability:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to check availability",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
