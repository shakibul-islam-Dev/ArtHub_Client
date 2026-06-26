import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { PLAN_PRCE_ID, stripe } from "@/lib/stripe";
import { auth } from "@/lib/auth";

export async function POST(request) {
  try {
    const headersList = await headers();
    const origin = headersList.get("origin");

    const formData = await request.formData();
    const plan_Id = formData.get("planId");
    const PRICE_ID = PLAN_PRCE_ID[plan_Id];

    const user = await auth.api.getSession({
      headers: await headers(),
    });
    console.log(user);

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      customer_email: user?.email,

      line_items: [
        {
          price: PRICE_ID,
          quantity: 1,
        },
      ],
      metadata: {
        priceId: PRICE_ID,
        userEmail: user?.email,
        userId: user?.id,
      },
      mode: "subscription",
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    });
    return NextResponse.redirect(session.url, 303);
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: "Hello World" });
}
