import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { connectToDB } from "@/lib/mongodb";
import UserInteraction from "@/lib/models/UserInteraction";

const interactionSchema = z.object({
  eventType: z.string().min(2).max(80),
  path: z.string().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export async function POST(request: Request) {
  const { userId } = await auth();
  const payload = await request.json().catch(() => null);
  const parsed = interactionSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid interaction payload" }, { status: 400 });
  }

  const connection = await connectToDB();

  if (!connection) {
    return NextResponse.json({ ok: true, saved: false });
  }

  await UserInteraction.create({
    userId: userId ?? null,
    eventType: parsed.data.eventType,
    path: parsed.data.path ?? null,
    metadata: parsed.data.metadata ?? {},
  });

  return NextResponse.json({ ok: true, saved: true });
}
