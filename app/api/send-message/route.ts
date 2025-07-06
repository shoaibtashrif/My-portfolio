import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json()

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json({ success: false, message: "Name, email, and message are required." }, { status: 400 })
    }

    // Create transporter using the provided credentials
    const transporter = nodemailer.createTransporter({
      service: "gmail",
      auth: {
        user: "youneedy763@gmail.com",
        pass: "seavtjiybtnxndwk",
      },
    })

    // Email content
    const mailOptions = {
      from: "youneedy763@gmail.com",
      to: "shoaib.tashrif@gmail.com",
      subject: `Portfolio Contact: ${subject || "New Message"}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; border-radius: 10px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; margin-bottom: 20px;">
            <h1 style="color: white; margin: 0; font-size: 24px; text-align: center;">New Portfolio Contact</h1>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="margin-bottom: 20px;">
              <h3 style="color: #374151; margin: 0 0 10px 0; font-size: 18px;">Contact Details</h3>
              <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; border-left: 4px solid #667eea;">
                <p style="margin: 5px 0; color: #4b5563;"><strong>Name:</strong> ${name}</p>
                <p style="margin: 5px 0; color: #4b5563;"><strong>Email:</strong> ${email}</p>
                <p style="margin: 5px 0; color: #4b5563;"><strong>Subject:</strong> ${subject || "No subject provided"}</p>
              </div>
            </div>
            
            <div style="margin-bottom: 20px;">
              <h3 style="color: #374151; margin: 0 0 10px 0; font-size: 18px;">Message</h3>
              <div style="background: #f9fafb; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb;">
                <p style="color: #374151; line-height: 1.6; margin: 0; white-space: pre-wrap;">${message}</p>
              </div>
            </div>
            
            <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px; margin: 0;">
                This message was sent from your AI Engineer Portfolio website.
              </p>
              <p style="color: #6b7280; font-size: 12px; margin: 5px 0 0 0;">
                Received on ${new Date().toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      `,
      replyTo: email,
    }

    // Send email
    await transporter.sendMail(mailOptions)

    return NextResponse.json({
      success: true,
      message: "Message sent successfully! I'll get back to you soon.",
    })
  } catch (error) {
    console.error("Email sending error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to send message. Please try again or contact me directly at shoaib.tashrif@gmail.com",
      },
      { status: 500 },
    )
  }
}
