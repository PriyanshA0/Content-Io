import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectToDB } from "@/lib/mongodb";
import SupportPayment from "@/lib/models/SupportPayment";

function getBaseUrl(request: NextRequest) {
  return process.env.APP_BASE_URL || process.env.NEXT_PUBLIC_API_URL || request.nextUrl.origin;
}

async function createPolarCheckout({
  baseUrl,
  userId,
}: {
  baseUrl: string;
  userId: string | null;
}) {
  const apiBase = process.env.POLAR_API_BASE_URL || "https://sandbox-api.polar.sh";
  const token = process.env.POLAR_ACCESS_TOKEN;
  const productId = process.env.POLAR_PRODUCT_ID;

  if (!token || !productId) {
    return { ok: false as const, error: "Polar env vars missing" };
  }

  const successUrl = `${baseUrl}/editor?support=success`;
  const cancelUrl = `${baseUrl}/editor?support=cancelled`;

  const attempts = [
    {
      products: [productId],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { source: "contentio-support", userId },
    },
    {
      product_id: productId,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { source: "contentio-support", userId },
    },
  ];

  for (const payload of attempts) {
    let response;
    try {
      response = await fetch(`${apiBase}/v1/checkouts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      // network or other fetch failure, try next payload
      console.error('Polar fetch error:', err);
      continue;
    }

    if (!response.ok) {
      const text = await response.text().catch(() => '<no body>');
      console.error('Polar API error', { status: response.status, body: text });
      continue;
    }

    const data = await response.json();
    const checkoutUrl =
      data?.url || data?.checkout_url || data?.data?.url || data?.data?.checkout_url || null;
    const checkoutId = data?.id || data?.checkout_id || data?.data?.id || null;

    if (checkoutUrl) {
      return {
        ok: true as const,
        checkoutUrl,
        checkoutId,
        raw: data,
      };
    }
  }

  return { ok: false as const, error: "Failed to create Polar checkout" };
}

async function handleCheckout(request: NextRequest) {
  const { userId } = await auth();
  const baseUrl = getBaseUrl(request);

  const checkout = await createPolarCheckout({
    baseUrl,
    userId: userId ?? null,
  });

  if (!checkout.ok) {
    console.error('Failed to create checkout:', checkout.error, checkout);
    return NextResponse.json({ error: checkout.error, detail: (checkout as any).detail ?? null }, { status: 500 });
  }

  const connection = await connectToDB();

  if (connection) {
    await SupportPayment.create({
      userId: userId ?? null,
      status: "initiated",
      polarCheckoutId: checkout.checkoutId,
      checkoutUrl: checkout.checkoutUrl,
      metadata: { source: "contentio-support" },
    });
  }

  return NextResponse.json({ ok: true, checkoutUrl: checkout.checkoutUrl });
}

export async function POST(request: NextRequest) {
  return handleCheckout(request);
}

export async function GET(request: NextRequest) {
  const result = await handleCheckout(request);
  const json = await result.json();

  if (!result.ok || !json.checkoutUrl) {
    return NextResponse.redirect(new URL("/editor?support=failed", request.nextUrl.origin));
  }

  return NextResponse.redirect(json.checkoutUrl);
}
