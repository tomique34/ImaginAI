import { NextResponse } from "next/server";
import { createPolarCheckout } from "@/lib/polar";

export async function POST(req: Request) {
  const body = await req.json();
  const { productId, successUrl, returnUrl, customerEmail } = body || {};

  if (!productId) {
    return NextResponse.json(
      { error: "product_id_required" },
      { status: 400 }
    );
  }

  const origin = req.headers.get("origin") || "http://localhost:3000";

  try {
    const checkout = await createPolarCheckout({
      productId,
      successUrl: successUrl || `${origin}/billing?success=1`,
      returnUrl: returnUrl || `${origin}/billing`,
      customerEmail,
    });

    return NextResponse.json({ checkoutUrl: checkout.url });
  } catch (error) {
    return NextResponse.json(
      { error: "checkout_failed" },
      { status: 500 }
    );
  }
}
