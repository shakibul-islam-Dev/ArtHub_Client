import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { PLAN_PRCE_ID, stripe } from "@/lib/stripe";
import { auth } from "@/lib/auth";

export async function POST(request) {
  try {
    const headersList = await headers();
    const origin = headersList.get("origin");

    // ১. ফর্ম থেকে প্ল্যান আইডি নেওয়া
    const formData = await request.formData();
    const plan_Id = formData.get("planId");
    const PRICE_ID = PLAN_PRCE_ID[plan_Id];

    if (!PRICE_ID) {
      return NextResponse.json({ error: "Invalid Plan ID" }, { status: 400 });
    }

    // ২. সেশন ডাটা আনা এবং সঠিক অবজেক্ট বের করা
    const authData = await auth.api.getSession({
      headers: headersList, // হেডার রি-ইউজ করা হলো
    });

    // Better-Auth এর আসল ইউজার অবজেক্ট এক্সট্রাক্ট করা
    const currentUser = authData?.user;

    // ইউজার লগইন না থাকলে এখানেই আটকে দেওয়া
    if (!currentUser || !currentUser.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ৩. স্ট্রাইপ সেশন তৈরি (সঠিক ডাটা সহ)
    const session = await stripe.checkout.sessions.create({
      customer_email: currentUser.email, // সঠিক ইমেইল

      line_items: [
        {
          price: PRICE_ID,
          quantity: 1,
        },
      ],
      metadata: {
        priceId: PRICE_ID,
        userEmail: currentUser.email, // এখন আর undefined হবে না
        userId: currentUser.id, // এখন সঠিক আইডি পাস হবে
      },
      mode: "subscription",
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing`, // ক্যানসেল ইউআরএল দেওয়া ভালো প্র্যাকটিস
    });

    // ৪. রিডাইরেক্ট করা
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
