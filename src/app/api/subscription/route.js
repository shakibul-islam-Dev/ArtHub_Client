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

    if (!PRICE_ID) {
      return NextResponse.json({ error: "Invalid Plan ID" }, { status: 400 });
    }

    const authData = await auth.api.getSession({
      headers: headersList,
    });

    const currentUser = authData?.user;

    if (!currentUser || !currentUser.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await stripe.checkout.sessions.create({
      customer_email: currentUser.email,

      line_items: [
        {
          price: PRICE_ID,
          quantity: 1,
        },
      ],
      metadata: {
        priceId: PRICE_ID,
        userEmail: currentUser.email,
        userId: currentUser.id,
      },
      mode: "subscription",
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing`,
    });

    return NextResponse.redirect(session.url, 303);
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: err.statusCode || 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: "Hello World" });
}
