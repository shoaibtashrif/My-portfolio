// Simple keyword-based response system as a fallback
export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    // Get the last user message
    const lastUserMessage = [...messages].reverse().find((msg) => msg.role === "user")

    if (!lastUserMessage) {
      return Response.json({
        response: "Hello! I'm Shoaib's AI assistant. How can I help you today?",
      })
    }

    const query = lastUserMessage.content.toLowerCase()
    let response = ""

    // Simple keyword matching
    if (query.includes("experience") || query.includes("work history") || query.includes("background")) {
      response =
        "Shoaib has diverse experience in AI engineering, including 3 years at PTA working on URL categorization, 1 year at Wosler Corp Canada building voice AI talkbots, 4 months at Orizen Technology developing multilingual chatbots, and consulting work with NetTech helping integrate AI into their business operations."
    } else if (query.includes("skill") || query.includes("expertise") || query.includes("technology")) {
      response =
        "Shoaib's key skills include AI engineering, local and cloud AI setup, LLM deployment, speech-to-text and text-to-speech systems, multi-agent talkbot development, multilingual AI systems, and chatbot development. He specializes in creating conversational AI solutions that feel natural and provide real value to businesses."
    } else if (query.includes("project") || query.includes("portfolio")) {
      response =
        "Shoaib has worked on several notable projects, including an AI-based URL categorization system for PTA, voice AI talkbots for medical booking at Wosler Corp, multilingual chatbots in English and Urdu at Orizen Technology, and various AI integration projects for businesses."
    } else if (query.includes("contact") || query.includes("email") || query.includes("phone")) {
      response =
        "You can contact Shoaib via email at shoaib.tashrif@gmail.com, WhatsApp at +92 304 0610720, or through his LinkedIn profile at linkedin.com/in/shoaibtashrif. Would you like to schedule a meeting instead?"
    } else if (query.includes("available") || query.includes("hire") || query.includes("work with")) {
      response =
        "Shoaib is currently available for consulting and project work. He specializes in helping businesses integrate AI into their operations, particularly in developing custom conversational AI solutions. Would you like to schedule a consultation call to discuss your needs?"
    } else {
      response =
        "Shoaib is an AI engineer specializing in conversational AI systems, including chatbots and talkbots. He has experience with local and cloud AI setups, speech-to-text and text-to-speech systems, and multilingual AI development. Is there something specific about his skills, experience, or services you'd like to know more about?"
    }

    return Response.json({ response })
  } catch (error) {
    console.error("Error in fallback chat API:", error)
    return Response.json({
      response:
        "I'm having trouble right now, but I'd be happy to help you schedule a meeting with Shoaib to discuss your needs directly. Would you like to do that?",
    })
  }
}
