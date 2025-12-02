import { NextResponse } from "next/server";

type ChatRequestBody = {
  message?: string;
  history?: { role: "user" | "assistant" | "system"; content: string }[];
};

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not set on the server" },
      { status: 500 },
    );
  }

  const body = (await request.json().catch(() => null)) as ChatRequestBody | null;

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const message = typeof body.message === "string" ? body.message : "";
  const history = Array.isArray(body.history) ? body.history : [];

  if (!message) {
    return NextResponse.json({ error: "message is required" }, { status: 400 });
  }

  const messages = [
    {
      role: "system",
      content:
        "You are an AI assistant embedded in a SaaS product called site-ai-chatbot. Keep answers concise and helpful.",
    },
    ...history,
    { role: "user", content: message },
  ];

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages,
    }),
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "Upstream OpenAI request failed" },
      { status: 502 },
    );
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content ?? "";

  return NextResponse.json({ reply: text });
}
