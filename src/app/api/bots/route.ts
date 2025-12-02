import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromSession } from "@/lib/auth";

export async function POST(request: Request) {
  const user = await getUserFromSession();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!name) {
    return NextResponse.redirect(new URL("/app/bots?error=missing_name", request.url));
  }

  const baseSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    || "bot";

  const slug = `${baseSlug}-${randomUUID().slice(0, 6)}`;
  const tokenValue = randomUUID().replace(/-/g, "");

  await prisma.bot.create({
    data: {
      userId: user.id,
      name,
      slug,
      description: description || null,
      tokens: {
        create: {
          token: tokenValue,
        },
      },
    },
  });

  return NextResponse.redirect(new URL("/app/bots", request.url));
}
