import type { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()
    const lastUserMessage = [...messages].reverse().find((msg: any) => msg.role === "user")
    if (!lastUserMessage) {
      return Response.json({ response: "Hello! I'm Shoaib's AI assistant. How can I help you today?" })
    }
    
    const prompt = `You are Shoaib Tashrif's AI assistant. Answer questions about his experience and skills naturally.

About Shoaib:
- AI Software Engineer with 4+ years experience
- Worked at Wosler Corp Canada, Valyrian System Inc., PTA
- Specializes in Voice AI, Conversational AI, Generative AI
- Built projects like Hilum AI, ControlshiftAI, Intelli Firewall
- Skills: Python, Langchain, OpenAI GPT, Hugging Face, TensorFlow
- Contact: shoaib.tashrif@gmail.com, +92 304 0610720
- Available for AI consulting and project work

User question: ${lastUserMessage.content}

Provide a helpful, natural response about Shoaib's experience, skills, or how to contact him. Keep it conversational and informative.`

    // Use a reliable free model - Microsoft DialoGPT
    const hfResponse = await fetch("https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_length: 150,
          temperature: 0.7,
          do_sample: true
        }
      })
    })

    if (hfResponse.ok) {
      const data = await hfResponse.json()
      let response = ""
      
      if (Array.isArray(data) && data.length > 0) {
        response = data[0].generated_text || data[0].text || ""
      } else if (typeof data === "string") {
        response = data
      } else if (data && typeof data === "object") {
        response = data.generated_text || data.text || ""
      }

      // Clean up the response
      response = response.replace(prompt, "").trim()
      
      // If no meaningful response, provide a fallback
      if (!response || response.length < 10) {
        response = getFallbackResponse(lastUserMessage.content)
      }

      return Response.json({ response })
    } else {
      // Fallback to intelligent responses based on keywords
      const response = getFallbackResponse(lastUserMessage.content)
      return Response.json({ response })
    }
  } catch (error) {
    console.error("Chat API error:", error)
    const fallbackResponse = getFallbackResponse("general")
    return Response.json({ response: fallbackResponse })
  }
}

function getFallbackResponse(userInput: string): string {
  const input = userInput.toLowerCase()
  
  if (input.includes("experience") || input.includes("work") || input.includes("background")) {
    return "Shoaib has 4+ years of experience as an AI Software Engineer. He's worked with companies like Wosler Corp Canada, Valyrian System Inc., and PTA, specializing in Voice AI, Conversational AI, and Generative AI solutions. He's built several successful projects including Hilum AI, ControlshiftAI, and Intelli Firewall."
  }
  
  if (input.includes("skill") || input.includes("technology") || input.includes("tech")) {
    return "Shoaib specializes in AI technologies including Python, Langchain, OpenAI GPT, Hugging Face, TensorFlow, speech recognition, text-to-speech, and building conversational AI systems. He's also experienced with React, Next.js, FastAPI, and cloud platforms like AWS."
  }
  
  if (input.includes("project") || input.includes("work")) {
    return "Shoaib has built several impressive AI projects including Hilum AI (healthcare AI), ControlshiftAI (voice AI platform), and Intelli Firewall (security AI). He specializes in creating intelligent solutions that solve real business problems."
  }
  
  if (input.includes("contact") || input.includes("email") || input.includes("reach")) {
    return "You can reach Shoaib at shoaib.tashrif@gmail.com or call him at +92 304 0610720. He's also available on LinkedIn at linkedin.com/in/shoaibtashrif. He's currently available for AI consulting and project work."
  }
  
  if (input.includes("book") || input.includes("schedule") || input.includes("meeting")) {
    return "I'd be happy to help you schedule a meeting with Shoaib! You can book directly through the Calendly widget, or tell me when you'd like to meet and I can help arrange it."
  }
  
  if (input.includes("available") || input.includes("hire") || input.includes("consulting")) {
    return "Yes, Shoaib is currently available for AI consulting and project work. He specializes in Voice AI, Conversational AI, and Generative AI solutions. You can contact him directly or book a consultation through the calendar."
  }
  
  return "I'm Shoaib's AI assistant. He's an experienced AI Software Engineer with expertise in Voice AI, Conversational AI, and Generative AI. He's worked on projects like Hilum AI and ControlshiftAI. How can I help you learn more about his experience or skills?"
}
