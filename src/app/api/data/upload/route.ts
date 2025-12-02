import { NextResponse } from "next/server";
import { Buffer } from "node:buffer";
import { prisma } from "@/lib/prisma";
import { getUserFromSession } from "@/lib/auth";

export async function POST(request: Request) {
  const user = await getUserFromSession();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const botId = String(formData.get("botId") ?? "");
  const file = formData.get("file");

  if (!botId || !(file instanceof File)) {
    return NextResponse.redirect(new URL("/app/data?error=missing", request.url));
  }

  const bot = await prisma.bot.findFirst({ where: { id: botId, userId: user.id } });
  if (!bot) {
    return NextResponse.redirect(new URL("/app/data?error=bot", request.url));
  }

  let rawText = "";

  const lowerName = (file.name || "").toLowerCase();
  const mime = (file.type || "").toLowerCase();

  if (mime === "text/plain" || lowerName.endsWith(".txt")) {
    rawText = await file.text();
  } else if (mime === "application/pdf" || lowerName.endsWith(".pdf")) {
    const pdfModule = await import("pdf-parse");
    const pdfParse = (pdfModule as any).default ?? pdfModule;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const pdfData = await pdfParse(buffer);
    rawText = pdfData.text || "";
  } else {
    return NextResponse.redirect(new URL("/app/data?error=type", request.url));
  }

  const trimmed = rawText.trim();

  if (!trimmed) {
    return NextResponse.redirect(new URL("/app/data?error=empty", request.url));
  }

  const title = file.name || "Uploaded text";

  const doc = await prisma.document.create({
    data: {
      botId: bot.id,
      title,
      sourceType: "upload",
      sourceRef: file.name || "upload.txt",
    },
  });

  const maxChunkSize = 600;
  const chunks: { index: number; content: string }[] = [];

  for (let i = 0, index = 0; i < trimmed.length; i += maxChunkSize, index += 1) {
    const slice = trimmed.slice(i, i + maxChunkSize).trim();
    if (slice) {
      chunks.push({ index, content: slice });
    }
  }

  if (chunks.length > 0) {
    await prisma.documentChunk.createMany({
      data: chunks.map((c) => ({
        documentId: doc.id,
        index: c.index,
        content: c.content,
      })),
    });
  }

  return NextResponse.redirect(new URL("/app/data", request.url));
}
