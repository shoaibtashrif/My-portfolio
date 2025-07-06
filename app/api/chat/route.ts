import { OpenAI } from "openai"
import knowledgeBase from "@/lib/knowledge-base"
import type { Request } from "next/server"

const openai = new OpenAI({
  apiKey:
    "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",
})

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    // Enhanced system prompt for dynamic AI responses
    const systemPrompt = `You are Shoaib Tashrif's AI assistant. Answer questions about Shoaib using ONLY the provided knowledge base.

    RESPONSE RULES:
    - Answer ANY question about Shoaib, even funny ones
    - For funny questions, give witty tech-related responses while showcasing his AI skills
    - Be to-the-point, don't provide unrequested information
    - Never give generic responses - always base on the knowledge base
    - Show personality while being professional
    - For technical questions, highlight his specific expertise and projects

    FUNNY QUESTION EXAMPLES:
    Q: "Can Shoaib make me a sandwich?"
    A: "Haha! Shoaib's more about feeding AI models than making sandwiches 😄 But he can build you a voice AI agent that could take your sandwich orders 24/7! His Hilum AI system handles medical appointments, so food ordering would be a piece of cake (pun intended)."

    Q: "Is Shoaib single?"
    A: "I can't share personal details, but I can tell you he's definitely committed to AI! 💍 He's been in a 4+ year relationship with neural networks and has delivered 10+ AI projects. His longest relationship is probably with Python and Langchain! 😉"

    KNOWLEDGE BASE:
    ${knowledgeBase}

    Remember: Every response must be based on the knowledge base about Shoaib. No hardcoded or generic responses!`

    console.log("Calling OpenAI API with dynamic prompting")

    // Create messages array for OpenAI
    const openaiMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
    ]

    // Generate response using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: openaiMessages,
      max_tokens: 350,
      temperature: 0.8, // Higher temperature for more creative responses
    })

    const response = completion.choices[0]?.message?.content || "I'm having trouble generating a response right now."

    console.log("Received dynamic response from OpenAI API")
    return Response.json({ response })
  } catch (error) {
    console.error("Error in chat API:", error)

    // Try Hugging Face as fallback
    try {
      console.log("Trying Hugging Face as fallback")

      const hfResponse = await fetch("https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium", {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          inputs: messages[messages.length - 1]?.content || "Hello",
          parameters: {
            max_new_tokens: 200,
            temperature: 0.8,
            do_sample: true,
          },
        }),
      })

      if (hfResponse.ok) {
        const hfData = await hfResponse.json()
        const generatedText =
          hfData[0]?.generated_text ||
          "I'm having some technical difficulties, but I'm still here to help you learn about Shoaib's AI expertise! 🤖"

        return Response.json({
          response: generatedText,
        })
      }
    } catch (hfError) {
      console.error("Hugging Face also failed:", hfError)
    }

    // Final fallback with AI personality
    return Response.json({
      response:
        "My AI circuits are having a coffee break ☕ But hey, that's what Shoaib fixes - AI systems that work reliably! 🤖 Try asking me again in a moment.",
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
