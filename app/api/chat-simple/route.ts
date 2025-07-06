const knowledgeBase = `
Shoaib Tashrif is an AI Software Engineer and Generative AI Developer with 3+ years of experience.

WORK EXPERIENCE:
- AI Software Engineer at Wosler Corp Canada (Oct 2024 - Jan 2025): Delivered end-to-end AI software products for Nexus AI, designed voice-to-voice AI assistance systems, architected chatbot systems, configured and deployed LLMs locally.
- Backend Developer/Generative AI Developer at Stealth Startup (Feb 2024 - Aug 2024): Created workflows and algorithms for product preference systems, integrated APIs, worked on WMS Pakistan at PTA.
- AI Software Engineer at Valyrian System Inc. (Nov 2021 - Dec 2024): Built workflows for agents, database models and APIs, deployed systems on AWS.

SKILLS: Generative AI, RAG, Chatbot Development, Python, OpenAI API, AI Integration, NLP, LLMs Fine tuning, Cloud solutions, Langraph, Langchain, Multi-threaded Development, Voice Processing, AI workflow design, Hugging Face, Ollama, MERN Stack, AI voice agents, Linux, CNN, Computer Vision (YOLO), OpenCV, AWS, GitHub, Conversational AI, Prompt Engineering, Docker.

PROJECTS:
- Nexus AI: Voice-to-voice calling AI bot for booking, modification/cancelation of existing booking, customer support, services inquiry regarding health
- ControlshiftAI: A platform where users can create AI agents without any code. Backend development role.
- Intelli Firewall: Real-time internet traffic monitoring with rule-based blocking, spam detection
- Student Interest Analysis: Image processing system to calculate student interest in activities
- Object Detection System: Detects objects based on unique features using YOLO 5
- Spammer ID: AI-based voice recognition system to identify spammers

EDUCATION: BS Software Engineering from PMAS Arid Agriculture University, 3.4/4 CGPA

CERTIFICATIONS: AI Automation with Python (2022), MERN Stack Development (2021), Generative AI (2023)

CONTACT: shoaib.tashrif@gmail.com, +923040610720, LinkedIn: shoaibtashrif
`

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

    console.log("Trying multiple Hugging Face models...")

    // Try multiple models in order of preference
    const models = ["microsoft/DialoGPT-medium", "facebook/blenderbot-400M-distill", "microsoft/DialoGPT-small", "gpt2"]

    for (const model of models) {
      try {
        console.log(`Trying model: ${model}`)

        const prompt = `You are Shoaib Tashrif's AI assistant. Answer questions about his experience and skills naturally.

About Shoaib:
${knowledgeBase}

User: ${lastUserMessage.content}
Assistant:`

        const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: prompt,
            parameters: {
              max_length: 300,
              temperature: 0.7,
              do_sample: true,
              pad_token_id: 50256,
            },
            options: {
              wait_for_model: true,
            },
          }),
        })

        console.log(`Response status for ${model}:`, response.status)

        if (response.ok) {
          const data = await response.json()
          console.log(`Success with model ${model}:`, data)

          let aiResponse = ""
          if (Array.isArray(data) && data.length > 0) {
            aiResponse = data[0].generated_text || ""
          } else if (data.generated_text) {
            aiResponse = data.generated_text
          }

          // Clean up the response
          if (aiResponse) {
            aiResponse = aiResponse.replace(prompt, "").trim()
            aiResponse = aiResponse.replace(/^Assistant:\s*/, "").trim()

            if (aiResponse && aiResponse.length > 10) {
              return Response.json({ response: aiResponse })
            }
          }
        }
      } catch (modelError) {
        console.error(`Error with model ${model}:`, modelError)
        continue
      }
    }

    // If all models fail, use intelligent local response
    console.log("All Hugging Face models failed, using local response")
    return await getIntelligentLocalResponse(lastUserMessage.content)
  } catch (error) {
    console.error("Error in simple chat API:", error)
    return await getIntelligentLocalResponse("general")
  }
}

// Enhanced intelligent local response function
async function getIntelligentLocalResponse(query: string) {
  const lowerQuery = query.toLowerCase()
  let response = ""

  // More intelligent keyword matching with context
  if (lowerQuery.includes("experience") || lowerQuery.includes("background") || lowerQuery.includes("work")) {
    response =
      "Shoaib has over 3 years of experience in AI engineering. He's worked at Wosler Corp Canada developing voice AI systems for medical booking, at Valyrian System Inc. building backend AI solutions, and on various projects including Nexus AI and ControlshiftAI. His expertise spans from conversational AI to voice processing and multi-agent systems."
  } else if (lowerQuery.includes("skill") || lowerQuery.includes("technology") || lowerQuery.includes("expertise")) {
    response =
      "Shoaib specializes in Generative AI, Python development, Langchain/Langraph, voice processing, and conversational AI. He's proficient in LLM fine-tuning, RAG systems, multi-threaded development, and has experience with OpenAI API, Hugging Face, Docker, and AWS. He's particularly skilled at creating natural-feeling AI assistants and voice agents."
  } else if (lowerQuery.includes("project") || lowerQuery.includes("portfolio") || lowerQuery.includes("built")) {
    response =
      "Shoaib has built several impressive AI projects including Nexus AI (a voice-to-voice medical booking system), ControlshiftAI (a no-code AI agent platform), Intelli Firewall (AI-powered traffic monitoring), and various chatbot and voice processing systems. Each project demonstrates his ability to create practical AI solutions for real business needs."
  } else if (lowerQuery.includes("contact") || lowerQuery.includes("reach") || lowerQuery.includes("email")) {
    response =
      "You can reach Shoaib at shoaib.tashrif@gmail.com or call him at +92 304 0610720. He's also available on LinkedIn as 'shoaibtashrif'. Would you like to schedule a consultation to discuss your AI project needs?"
  } else if (
    lowerQuery.includes("book") ||
    lowerQuery.includes("schedule") ||
    lowerQuery.includes("meeting") ||
    lowerQuery.includes("appointment")
  ) {
    response =
      "I'd be happy to help you schedule a meeting with Shoaib! He offers free AI consultations where he can guide you on the best architecture for your project. You can book directly through his calendar system. Would you like me to show you the booking options?"
  } else if (lowerQuery.includes("available") || lowerQuery.includes("hire") || lowerQuery.includes("freelance")) {
    response =
      "Yes, Shoaib is currently available for AI consulting and development projects. He specializes in helping businesses implement AI solutions, from chatbots to voice agents to custom AI workflows. Would you like to schedule a consultation to discuss your specific needs?"
  } else if (lowerQuery.includes("voice") || lowerQuery.includes("speech") || lowerQuery.includes("audio")) {
    response =
      "Shoaib has extensive experience with voice AI systems. He built Nexus AI, a voice-to-voice calling bot for medical bookings, and has worked with speech-to-text, text-to-speech, and voice processing technologies. He can help you create natural-sounding voice agents for various applications."
  } else if (lowerQuery.includes("chatbot") || lowerQuery.includes("conversational") || lowerQuery.includes("chat")) {
    response =
      "Shoaib is an expert in conversational AI and chatbot development. He's built intelligent chatbots using Langchain, Langraph, and various LLMs. His chatbots can handle complex conversations, integrate with business systems, and provide natural, helpful interactions. Would you like to discuss a chatbot project?"
  } else if (lowerQuery.includes("hello") || lowerQuery.includes("hi") || lowerQuery.includes("hey")) {
    response =
      "Hello! I'm Shoaib's AI assistant. He's an experienced AI Software Engineer specializing in conversational AI, voice systems, and generative AI development. How can I help you learn about his expertise today?"
  } else if (lowerQuery.includes("what") || lowerQuery.includes("who") || lowerQuery.includes("tell me")) {
    response =
      "Shoaib Tashrif is an AI Software Engineer with 3+ years of experience in building intelligent systems. He's worked on projects like Nexus AI (voice booking system), ControlshiftAI (no-code AI platform), and various chatbot solutions. He specializes in Generative AI, voice processing, and conversational systems. What specific aspect would you like to know more about?"
  } else if (lowerQuery.includes("help") || lowerQuery.includes("assist") || lowerQuery.includes("support")) {
    response =
      "I'm here to help you learn about Shoaib's AI engineering expertise! He can assist with AI implementation consulting, custom chatbot development, voice AI systems, and AI integration projects. What kind of AI solution are you interested in?"
  } else {
    // Default responses with variety
    const defaultResponses = [
      "I'm Shoaib's AI assistant! He's an experienced AI Software Engineer specializing in conversational AI, voice systems, and generative AI development. What would you like to know about his expertise?",
      "Hi there! Shoaib is an AI engineer with expertise in building chatbots, voice agents, and AI-powered systems. He's worked on projects like Nexus AI and ControlshiftAI. How can I help you learn more about his work?",
      "Hello! Shoaib specializes in AI engineering, particularly conversational AI and voice processing. He's available for consulting and development projects. What specific information are you looking for?",
    ]
    response = defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
  }

  return Response.json({ response })
}
