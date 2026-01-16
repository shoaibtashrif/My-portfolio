import type { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()
    const lastUserMessage = [...messages].reverse().find((msg: any) => msg.role === "user")
    if (!lastUserMessage) {
      return Response.json({ response: "Hello! I'm Shoaib's AI assistant. How can I help you today?" })
    }

    // Check for custom prompt in headers
    const customPrompt = req.headers.get("x-custom-prompt")
    
    const prompt = `You are Shoaib Tashrif's AI assistant. Only answer the user's question directly and concisely. Do not provide any extra information or context that is not asked.\n\nUser question: ${lastUserMessage.content}\n\nAnswer:`
    
    const systemPrompt = customPrompt || `You are Shoaib Tashrif's AI assistant. You have access to his complete CV and professional information. Always provide accurate, detailed information about Shoaib's experience, skills, and projects.

Personal Information:
- Name: Shoaib Tashrif
- Title: AI Software Engineer & Innovation Expert
- Email: shoaib.tashrif@gmail.com
- Phone: +92 304 0610720
- Location: Pakistan
- LinkedIn: linkedin.com/in/shoaibtashrif

Professional Experience:
- 4+ years as AI Software Engineer
- Companies: Wosler Corp Canada, Valyrian System Inc., PTA
- Specializations: Voice AI, Conversational AI, Generative AI, Healthcare AI

Key Projects:
- Hilum AI: Healthcare AI platform for medical diagnosis
- ControlshiftAI: Voice AI platform for customer service
- Intelli Firewall: AI-powered security system
- Customer Service Talkbot: AI chatbot for business support

Technical Skills:
- AI/ML: Python, Langchain, OpenAI GPT, Hugging Face, TensorFlow
- Web Development: React, Next.js, FastAPI, Node.js
- Cloud & DevOps: AWS, Docker, CI/CD
- Specialized: Speech Recognition, Text-to-Speech, NLP

Services Offered:
- AI Consulting & Strategy
- Voice AI & Conversational AI Development
- Healthcare AI Solutions
- Custom AI Model Development
- AI Integration & Deployment

Education & Certifications:
- Bachelor's in Computer Science
- AI/ML Certifications
- Ongoing learning in latest AI technologies

Always provide specific, accurate information based on this CV data. Keep responses concise and professional.`

    // Use Groq API for AI responses
    try {
      // API key for Vercel deployment
      const groqKey = "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"
      
      const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${groqKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: lastUserMessage.content }
          ],
          temperature: 0.7,
          max_tokens: 300
        })
      })

      if (groqResponse.ok) {
        const data = await groqResponse.json()
        const aiResponse = data.choices?.[0]?.message?.content || ""
        
        if (aiResponse && aiResponse.trim().length > 10) {
          return Response.json({ 
            response: aiResponse.trim(),
            debug: { 
              model: "llama3-8b-8192",
              provider: "groq",
              tokens: data.usage?.total_tokens || 0
            }
          })
        }
      }
    } catch (groqError) {
      console.error("Groq API error:", groqError)
    }

    // Fallback to intelligent responses based on keywords
    const response = getFallbackResponse(lastUserMessage.content)
    return Response.json({ 
      response, 
      debug: { 
        fallback: true,
        model: "fallback",
        provider: "local"
      }
    })
  } catch (error) {
    console.error("Chat API error:", error)
    const fallbackResponse = getFallbackResponse("general")
    return Response.json({ 
      response: fallbackResponse, 
      debug: { 
        error: error?.toString(),
        fallback: true
      }
    })
  }
}

function getFallbackResponse(userInput: string): string {
  const input = userInput.toLowerCase()
  
  if (input.includes("phone") || input.includes("call") || input.includes("number")) {
    return "You can call Shoaib at **+92 304 0610720**. He's available for AI consulting and project discussions."
  }
  
  if (input.includes("email") || input.includes("mail")) {
    return "Contact Shoaib at **shoaib.tashrif@gmail.com**. He responds quickly to all professional inquiries."
  }
  
  if (input.includes("experience") || input.includes("work") || input.includes("background")) {
    return "Shoaib has **4+ years of experience** as an AI Software Engineer. He's worked with companies like **Wosler Corp Canada**, **Valyrian System Inc.**, and **PTA**, specializing in Voice AI, Conversational AI, and Generative AI solutions."
  }
  
  if (input.includes("skill") || input.includes("technology") || input.includes("tech")) {
    return "Shoaib specializes in **AI technologies** including Python, Langchain, OpenAI GPT, Hugging Face, TensorFlow, speech recognition, text-to-speech, and building conversational AI systems. He's also experienced with React, Next.js, FastAPI, and cloud platforms like AWS."
  }
  
  if (input.includes("project") || input.includes("work")) {
    return "Shoaib has built several impressive AI projects including **Hilum AI** (healthcare AI), **ControlshiftAI** (voice AI platform), and **Intelli Firewall** (security AI). He specializes in creating intelligent solutions that solve real business problems."
  }
  
  if (input.includes("contact") || input.includes("reach") || input.includes("get in touch")) {
    return "You can reach Shoaib at **shoaib.tashrif@gmail.com** or call him at **+92 304 0610720**. He's also available on **LinkedIn** at linkedin.com/in/shoaibtashrif. He's currently available for AI consulting and project work."
  }
  
  if (input.includes("book") || input.includes("schedule") || input.includes("meeting")) {
    return "I'd be happy to help you schedule a meeting with Shoaib! You can book directly through the **Calendly widget** on this page, or tell me when you'd like to meet and I can help arrange it."
  }
  
  if (input.includes("available") || input.includes("hire") || input.includes("consulting")) {
    return "Yes, Shoaib is currently **available for AI consulting and project work**. He specializes in Voice AI, Conversational AI, and Generative AI solutions. You can contact him directly or book a consultation through the calendar."
  }
  
  if (input.includes("cv") || input.includes("resume")) {
    return "Shoaib's CV is available for download. You can view it through the **'View Resume'** button on this page, which will open his Google Drive CV. Feel free to reach out if you need any specific information from his CV."
  }
  
  if (input.includes("linkedin") || input.includes("linked in")) {
    return "You can connect with Shoaib on **LinkedIn** at linkedin.com/in/shoaibtashrif. He regularly shares insights about AI technology and his latest projects there."
  }
  
  return "I'm Shoaib's AI assistant. He's an experienced **AI Software Engineer** with expertise in Voice AI, Conversational AI, and Generative AI. He's worked on projects like **Hilum AI** and **ControlshiftAI**. How can I help you learn more about his experience, skills, or projects?"
}
