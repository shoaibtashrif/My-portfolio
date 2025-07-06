import { xai } from "@ai-sdk/xai"
import { generateText } from "ai"
import knowledgeBase from "@/lib/knowledge-base"

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    // Format the conversation for the AI
    const formattedMessages = messages.map((msg: any) => ({
      role: msg.role === "user" ? "user" : "assistant",
      content: msg.content,
    }))

    // Get the last user message
    const lastUserMessage = [...messages].reverse().find((msg) => msg.role === "user")

    if (!lastUserMessage) {
      return Response.json({
        response: "Hello! I'm Shoaib's AI assistant. How can I help you today?",
      })
    }

    // Create a system prompt using our knowledge base
    const systemPrompt = `You are an AI assistant for Shoaib Tashrif, an AI Engineer. 
    Use the following information about Shoaib to answer questions naturally and conversationally.
    Vary your responses and sound human-like, not robotic.And give to the point short answers. dont give suggestions. dont tell anything that is not asked.
    
    ${knowledgeBase}
    
    Remember to be helpful, friendly, and natural in your responses. Don't sound like you're reading from a script.`

    console.log("Trying to use Grok API as a fallback for Hugging Face")

    // Use Grok API since we know it works
    try {
      // Generate response using Grok
      const { text } = await generateText({
        model: xai("grok-3-beta"),
        messages: formattedMessages.slice(-5), // Only use the last 5 messages to avoid context length issues
        system: systemPrompt,
        maxTokens: 300,
      })

      console.log("Received response from Grok API in huggingface route")
      return Response.json({ response: text })
    } catch (grokError) {
      console.error("Grok API failed in huggingface route:", grokError)

      // Fall back to the local response system
      console.log("Falling back to local response system from huggingface route")

      // Use the query from the last user message
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
      // Default response
      else {
        response =
          "Shoaib is an AI engineer specializing in conversational AI systems, including chatbots and talkbots. He has experience with local and cloud AI setups, speech-to-text and text-to-speech systems, and multilingual AI development. Is there something specific about his skills, experience, or services you'd like to know more about?"
      }

      return Response.json({ response })
    }
  } catch (error) {
    console.error("Error in Hugging Face chat API:", error)

    // Provide a fallback response if the API call fails
    return Response.json({
      response:
        "I'm having trouble connecting to my knowledge base right now. Please try asking me again in a moment, or feel free to ask about booking a session with Shoaib.",
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
