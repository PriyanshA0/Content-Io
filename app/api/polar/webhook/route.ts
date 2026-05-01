import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import SupportPayment from "@/lib/models/SupportPayment";

function normalizeStatus(status?: string | null) {
  const value = (status || "").toLowerCase();
  if (value.includes("paid") || value.includes("succeeded")) return "paid";
  if (value.includes("refund")) return "refunded";
  if (value.includes("fail")) return "failed";
  if (value.includes("cancel")) return "cancelled";
  return "initiated";
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);

  if (!payload) {
    return NextResponse.json({ error: "Invalid webhook payload" }, { status: 400 });
  }

  const connection = await connectToDB();

  if (!connection) {
    return NextResponse.json({ ok: true, saved: false });
  }

  const eventType = payload?.type || payload?.event || "unknown";
  const eventData = payload?.data || payload;

  const checkoutId =
    eventData?.checkout_id || eventData?.id || eventData?.checkout?.id || payload?.checkout_id || null;
  const userId = eventData?.metadata?.userId || payload?.metadata?.userId || null;
  const amount = eventData?.amount || eventData?.amount_total || null;
  const currency = eventData?.currency || null;

  await SupportPayment.findOneAndUpdate(
    { polarCheckoutId: checkoutId ?? undefined },
    {
      $set: {
        userId,
        polarCheckoutId: checkoutId,
        polarEventId: payload?.id || null,
        status: normalizeStatus(eventData?.status || eventType),
        amount,
        currency,
        metadata: {
          eventType,
          raw: payload,
        },
      },
    },
    { upsert: true, new: true }
  );

  return NextResponse.json({ ok: true });
}
