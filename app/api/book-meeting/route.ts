import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(req: Request) {
  try {
    const { name, email, date, time, topic } = await req.json()

    // Format the date for display
    const formattedDate = new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    // Create a Google Meet link (in a real implementation, you would use Google Calendar API)
    const meetLink = `https://meet.google.com/${Math.random().toString(36).substring(2, 10)}`

    // Create email content
    const emailContent = `
      <h2>Meeting Confirmation</h2>
      <p>Hello ${name},</p>
      <p>Your meeting with Shoaib Tashrif has been scheduled for:</p>
      <p><strong>Date:</strong> ${formattedDate}</p>
      <p><strong>Time:</strong> ${time}</p>
      <p><strong>Topic:</strong> ${topic}</p>
      <p><strong>Google Meet Link:</strong> <a href="${meetLink}">${meetLink}</a></p>
      <p>If you need to reschedule or have any questions, please reply to this email.</p>
      <p>Looking forward to speaking with you!</p>
      <p>Best regards,<br>Shoaib Tashrif<br>AI Engineer</p>
    `

    // Create a test account using Ethereal (for development purposes)
    // In production, you would use a real email service like SendGrid, Mailgun, etc.
    const testAccount = await nodemailer.createTestAccount()

    // Create a transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    })

    // Send email to the client
    const clientInfo = await transporter.sendMail({
      from: '"Shoaib Tashrif" <shoaib.tashrif@gmail.com>',
      to: email,
      subject: `Meeting Confirmation: ${topic} - ${formattedDate}`,
      html: emailContent,
    })

    // Send email to Shoaib
    const shoaibInfo = await transporter.sendMail({
      from: '"Meeting Scheduler" <scheduler@ai-engineer.com>',
      to: "shoaib.tashrif@gmail.com",
      subject: `New Meeting: ${topic} with ${name}`,
      html: `
        <h2>New Meeting Scheduled</h2>
        <p>A new meeting has been scheduled:</p>
        <p><strong>Client:</strong> ${name} (${email})</p>
        <p><strong>Date:</strong> ${formattedDate}</p>
        <p><strong>Time:</strong> ${time}</p>
        <p><strong>Topic:</strong> ${topic}</p>
        <p><strong>Google Meet Link:</strong> <a href="${meetLink}">${meetLink}</a></p>
      `,
    })

    // Get the Ethereal URL to preview the email (for development purposes)
    const clientPreviewUrl = nodemailer.getTestMessageUrl(clientInfo)
    const shoaibPreviewUrl = nodemailer.getTestMessageUrl(shoaibInfo)

    return NextResponse.json({
      success: true,
      message: `Meeting booked successfully for ${formattedDate} at ${time}`,
      meetingDetails: {
        name,
        email,
        date: formattedDate,
        time,
        topic,
        meetingLink: meetLink,
        host: "Shoaib Tashrif",
        hostEmail: "shoaib.tashrif@gmail.com",
      },
      // Include preview URLs for development
      previewUrls: {
        client: clientPreviewUrl,
        host: shoaibPreviewUrl,
      },
    })
  } catch (error) {
    console.error("Error booking meeting:", error)
    return NextResponse.json(
      { success: false, message: "Failed to book meeting. Please try again or contact directly." },
      { status: 500 },
    )
  }
}
