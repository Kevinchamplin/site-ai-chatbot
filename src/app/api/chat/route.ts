import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type ChatRequestBody = {
  message?: string;
  history?: { role: "user" | "assistant" | "system"; content: string }[];
  token?: string;
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
  const token = typeof body.token === "string" ? body.token : null;

  if (!message) {
    return NextResponse.json({ error: "message is required" }, { status: 400 });
  }

  let contextSnippet = "";

  if (token) {
    const tokenRecord = await prisma.botToken.findUnique({
      where: { token },
      include: {
        bot: {
          include: {
            documents: {
              include: { chunks: true },
            },
          },
        },
      },
    });

    if (tokenRecord?.bot) {
      const allChunks = tokenRecord.bot.documents.flatMap((doc) =>
        doc.chunks.map((chunk) => ({
          title: doc.title,
          index: chunk.index,
          content: chunk.content,
        })),
      );

      const limited = allChunks.slice(0, 32);

      if (limited.length > 0) {
        try {
          const embeddingModel =
            process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small";

          const embedRes = await fetch(
            "https://api.openai.com/v1/embeddings",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                model: embeddingModel,
                input: [
                  message,
                  ...limited.map((c) => c.content.slice(0, 2000)),
                ],
              }),
            },
          );

          if (embedRes.ok) {
            type EmbeddingVector = number[];
            type EmbeddingResponse = {
              data?: { embedding: EmbeddingVector }[];
            };

            const embedData = (await embedRes.json()) as EmbeddingResponse;
            const vectors = embedData.data ?? [];

            if (vectors.length > 1) {
              const queryVec = vectors[0].embedding;
              const chunkVecs = vectors.slice(1).map((v) => v.embedding);

              function dot(a: EmbeddingVector, b: EmbeddingVector): number {
                let s = 0;
                for (let i = 0; i < a.length && i < b.length; i += 1) {
                  s += a[i] * b[i];
                }
                return s;
              }

              function norm(a: EmbeddingVector): number {
                return Math.sqrt(dot(a, a));
              }

              const queryNorm = norm(queryVec) || 1;

              const scored = limited.map((chunk, i) => {
                const vec = chunkVecs[i];
                const score = vec ? dot(queryVec, vec) / (queryNorm * (norm(vec) || 1)) : 0;
                return { chunk, score };
              });

              scored.sort((a, b) => b.score - a.score);

              const top = scored.slice(0, 8).map((s) => s.chunk);

              contextSnippet = top
                .map(
                  (c) =>
                    `[${c.title} #${c.index}]: ` +
                    c.content.replace(/\s+/g, " ").slice(0, 280),
                )
                .join("\n\n");
            }
          }
        } catch {
          // If embeddings fail, fall back silently to no extra context.
        }
      }
    }
  }

  let systemContent =
    "You are an AI assistant embedded in a SaaS product called site-ai-chatbot. Keep answers concise and helpful.";

  if (contextSnippet) {
    systemContent +=
      "\n\nUse the following uploaded content as primary reference when it is relevant. If something is not covered there, you may fall back to general knowledge, but prefer these snippets:\n\n" +
      contextSnippet;
  }

  const messages = [
    {
      role: "system",
      content: systemContent,
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
