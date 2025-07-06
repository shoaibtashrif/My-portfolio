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

    // Simple keyword-based response system
    let response = ""

    // Experience and background
    if (
      query.includes("experience") ||
      query.includes("background") ||
      query.includes("work history") ||
      query.includes("worked") ||
      query.includes("companies")
    ) {
      response =
        "Shoaib has diverse experience in AI engineering, including 3 years at PTA working on URL categorization, 1 year at Wosler Corp Canada building voice AI talkbots for medical booking systems, 4 months at Orizen Technology developing multilingual chatbots, and consulting work with NetTech helping integrate AI into their business operations."
    }
    // Skills and expertise
    else if (
      query.includes("skill") ||
      query.includes("expertise") ||
      query.includes("capable") ||
      query.includes("technology") ||
      query.includes("specialization")
    ) {
      response =
        "Shoaib specializes in AI engineering, including local and cloud AI setup, LLM deployment, speech-to-text and text-to-speech systems, multi-agent talkbot development, multilingual AI systems (English and Urdu), and chatbot development. He's particularly skilled at creating conversational AI solutions that feel natural and provide real value to businesses."
    }
    // Projects and portfolio
    else if (
      query.includes("project") ||
      query.includes("portfolio") ||
      query.includes("work") ||
      query.includes("built") ||
      query.includes("developed")
    ) {
      response =
        "Shoaib has worked on several notable projects, including an AI-based URL categorization system for PTA, voice AI talkbots for medical booking at Wosler Corp Canada, multilingual chatbots in English and Urdu at Orizen Technology, and various AI integration projects for businesses. Each project involved custom AI solutions tailored to specific business needs."
    }
    // Contact information
    else if (
      query.includes("contact") ||
      query.includes("email") ||
      query.includes("phone") ||
      query.includes("reach") ||
      query.includes("whatsapp")
    ) {
      response =
        "You can contact Shoaib via email at shoaib.tashrif@gmail.com, WhatsApp at +92 304 0610720, or through his LinkedIn profile at linkedin.com/in/shoaibtashrif. Would you like to schedule a meeting to discuss your AI needs?"
    }
    // Availability and hiring
    else if (
      query.includes("available") ||
      query.includes("hire") ||
      query.includes("work with") ||
      query.includes("contract") ||
      query.includes("freelance")
    ) {
      response =
        "Shoaib is currently available for consulting and project work. He specializes in helping businesses integrate AI into their operations, particularly in developing custom conversational AI solutions like chatbots and talkbots. Would you like to schedule a consultation call to discuss your needs?"
    }
    // Booking and scheduling
    else if (
      query.includes("book") ||
      query.includes("schedule") ||
      query.includes("appointment") ||
      query.includes("meeting") ||
      query.includes("call")
    ) {
      response =
        "You can book a session with Shoaib by clicking on the 'Book a Session' tab above. You'll be able to select a date, time, and topic for your meeting. Shoaib offers initial consultation calls to discuss your AI needs and how he can help implement AI solutions for your business."
    }
    // Education and qualifications
    else if (
      query.includes("education") ||
      query.includes("degree") ||
      query.includes("qualification") ||
      query.includes("study") ||
      query.includes("university")
    ) {
      response =
        "Shoaib has a strong technical background in AI engineering with specialized training in natural language processing, speech recognition, and machine learning. He continuously stays updated with the latest advancements in AI technology through ongoing professional development."
    }
    // Services offered
    else if (
      query.includes("service") ||
      query.includes("offer") ||
      query.includes("provide") ||
      query.includes("help with") ||
      query.includes("assist")
    ) {
      response =
        "Shoaib offers a range of AI services including AI implementation consulting, custom chatbot and talkbot development, voice AI system design, multilingual AI system development, AI architecture design, and AI integration with existing business systems. He can help businesses leverage AI to improve customer service, automate processes, and enhance user experiences."
    }
    // Default response
    else {
      response =
        "Shoaib is an AI engineer specializing in conversational AI systems, including chatbots and talkbots. He has experience with local and cloud AI setups, speech-to-text and text-to-speech systems, and multilingual AI development. Is there something specific about his skills, experience, or services you'd like to know more about?"
    }

    // Add some variation to make responses feel more natural
    const intros = [
      "",
      "Based on Shoaib's background, ",
      "From what I know about Shoaib, ",
      "I can tell you that ",
      "To answer your question, ",
    ]

    const followups = [
      "",
      " Is there anything specific about this you'd like to know?",
      " Would you like more details on any aspect of this?",
      " Does this help with what you're looking for?",
      " Is there something else you'd like to know about Shoaib?",
    ]

    // Only add intros/followups sometimes to maintain variety
    const useIntro = Math.random() > 0.5
    const useFollowup = Math.random() > 0.5

    const introIndex = Math.floor(Math.random() * intros.length)
    const followupIndex = Math.floor(Math.random() * followups.length)

    const finalResponse =
      (useIntro ? intros[introIndex] : "") + response + (useFollowup ? followups[followupIndex] : "")

    return Response.json({ response: finalResponse })
  } catch (error) {
    console.error("Error in local chat API:", error)
    return Response.json({
      response:
        "I'm having trouble right now, but I'd be happy to help you schedule a meeting with Shoaib to discuss your needs directly. Would you like to do that?",
    })
  }
}
