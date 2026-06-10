import { NextRequest, NextResponse } from "next/server";
import { buildSystemPrompt } from "@/lib/voice-context";
import type { OllamaResponse } from "@/lib/voice-types";

type ChatMessage = {
  role: "system" | "user";
  content: string;
};

const AI_TIMEOUT_MS = Number(process.env.AI_TIMEOUT_MS || 15000);

function fetchWithTimeout(input: string, init: RequestInit = {}) {
  return fetch(input, {
    ...init,
    signal: AbortSignal.timeout(AI_TIMEOUT_MS)
  });
}

async function chatWithOpenRouter(messages: ChatMessage[]): Promise<OllamaResponse | null> {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) return null;

  const model = process.env.OPENROUTER_MODEL || "google/gemini-2.5-flash";
  const systemPrompt = messages.find((message) => message.role === "system")?.content || "";
  const userPrompt = messages.find((message) => message.role === "user")?.content || "";

  const response = await fetchWithTimeout(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": process.env.SITE_URL || "http://localhost:3000",
        "X-Title": "CG Matsya Exports"
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt + "\n\nRespond ONLY with valid JSON matching the format specified in the system prompt." }
        ],
        temperature: 0.2,
        response_format: { type: "json_object" }
      })
    }
  );

  if (!response.ok) return null;

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;

  if (!content || typeof content !== "string") return null;

  return JSON.parse(content) as OllamaResponse;
}

async function chatWithOllama(messages: ChatMessage[]): Promise<OllamaResponse | null> {
  const ollamaUrl = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
  const model = process.env.OLLAMA_MODEL || "qwen2.5";

  const response = await fetchWithTimeout(`${ollamaUrl}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      messages,
      format: "json",
      stream: false,
      keep_alive: "5m"
    })
  });

  if (!response.ok) return null;

  const data = await response.json();
  const content = data?.message?.content;

  if (!content || typeof content !== "string") return null;

  return JSON.parse(content) as OllamaResponse;
}

export async function POST(req: NextRequest) {
  try {
    const { message, cart } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const cartContext = cart?.length
      ? (cart as Array<{ englishName: string; quantityKg: number; packaging: string }>)
          .map((item) => `${item.englishName} (${item.quantityKg}kg, ${item.packaging})`)
          .join(", ")
      : "The cart is empty.";

    const systemPrompt = buildSystemPrompt(cartContext);
    const messages: ChatMessage[] = [
      { role: "system", content: systemPrompt },
      { role: "user", content: message }
    ];

    const preferredProvider = process.env.AI_PROVIDER || "openrouter";
    const fallbackEnabled = process.env.AI_FALLBACK_ENABLED !== "false";
    const providerOrder =
      preferredProvider === "ollama"
        ? [chatWithOllama, chatWithOpenRouter]
        : [chatWithOpenRouter, chatWithOllama];
    const providers = fallbackEnabled ? providerOrder : [providerOrder[0]];

    for (const provider of providers) {
      try {
        const parsed = await provider(messages);
        if (parsed) return NextResponse.json(parsed);
      } catch (error) {
        console.error("Voice provider error:", error);
      }
    }

    const fallback: OllamaResponse = {
      intent: "unknown",
      params: {},
      reply: "I'm having trouble reaching the AI provider. Please check your OpenRouter API key in .env.local."
    };
    return NextResponse.json(fallback);
  } catch (error) {
    console.error("Voice API error:", error);
    const fallback: OllamaResponse = {
      intent: "unknown",
      params: {},
      reply: "Sorry, I encountered an error. Please check your AI assistant setup."
    };
    return NextResponse.json(fallback);
  }
}
