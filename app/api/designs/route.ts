import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { connectToDB } from "@/lib/mongodb";
import Design from "@/lib/models/Design";

const designSchema = z.object({
  title: z.string().min(2).max(80),
  mode: z.enum(["image", "code"]),
  imageUrl: z.string().optional().nullable(),
  code: z.string().optional(),
  language: z.enum(["javascript", "typescript", "python", "bash"]),
  settings: z.object({
    background: z.string(),
    padding: z.number(),
    radius: z.number(),
    shadow: z.boolean(),
    theme: z.string(),
    layout: z.string(),
    fontSize: z.number(),
    lineNumbers: z.boolean(),
  }),
});

export async function POST(request: Request) {
  const { userId } = await auth();
  const payload = await request.json().catch(() => null);
  const parsed = designSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid design payload" }, { status: 400 });
  }

  const connection = await connectToDB();

  if (!connection) {
    return NextResponse.json({
      ok: true,
      saved: false,
      design: {
        id: `draft_${Date.now()}`,
        userId: userId ?? null,
        ...parsed.data,
      },
    });
  }

  const saved = await Design.create({
    ...parsed.data,
    userId: userId ?? null,
  });

  return NextResponse.json({
    ok: true,
    saved: true,
    design: {
      id: saved._id.toString(),
      userId: userId ?? null,
      ...parsed.data,
    },
  });
}