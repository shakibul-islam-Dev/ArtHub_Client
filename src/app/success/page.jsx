import { redirect } from "next/navigation";
import { stripe, PLAN_PRCE_ID } from "@/lib/stripe";

export default async function Success({ searchParams }) {
  const { session_id } = await searchParams;
  if (!session_id) {
    throw new Error("Please provide a valid session_id (`cs_test_...`)");
  }

  // স্ট্রাইপ থেকে সেশন রিট্রিভ করা
  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items", "payment_intent"],
  });

  const status = session?.status;
  const customerEmail = session?.customer_details?.email;

  const metadata =
    session?.metadata && Object.keys(session.metadata).length > 0
      ? session.metadata
      : session?.payment_intent?.metadata;

  if (status === "open") {
    return redirect("/");
  }

  if (status === "complete") {
    // 🚀 ৩টি প্ল্যানের আইডি ম্যাপ করে সঠিক প্ল্যানের নাম (free / pro / premium) বের করা
    const planName =
      Object.keys(PLAN_PRCE_ID).find(
        (key) => PLAN_PRCE_ID[key] === metadata?.priceId,
      ) || "free"; // কোনো কারণে না মিললে ডিফল্ট free থাকবে

    // 🚀 ব্যাকএন্ড ডাটাবেজে ডাটা সিঙ্ক (POST Request)
    try {
      const backendUrl =
        "http://localhost:5000/api/arthub/subscriptions/subscriptions";

      await fetch(backendUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: metadata?.priceId,
          userEmail: metadata?.userEmail || customerEmail,
          userId: metadata?.userId,
          status: status, // ডাটাবেজে "complete" স্ট্যাটাস সেভ হবে
          sessionId: session_id,
          planName: planName, // ডাটাবেজে "free", "pro" অথবা "premium" হিসেবে স্টোর হবে
        }),
      });
      console.log(`🎉 Database synced with ${planName} plan!`);
    } catch (err) {
      console.error("❌ Failed to sync with backend DB:", err.message);
    }

    // ইউজারকে স্ক্রিনে দেখানোর জন্য কাস্টম মেসেজ বা কার্ড
    return (
      <section
        id="success"
        style={{
          padding: "50px",
          textAlign: "center",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: "500px",
            margin: "0 auto",
            padding: "30px",
            border: "1px solid #e0e0e0",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          }}
        >
          <h2 style={{ color: "#22c55e" }}>🎉 Payment Successful!</h2>
          <p style={{ fontSize: "16px", color: "#4b5563" }}>
            Thank you for upgrading! Your account has been activated for the{" "}
            <strong>{planName.toUpperCase()}</strong> plan.
          </p>
          <hr
            style={{
              border: "0",
              borderTop: "1px solid #f3f4f6",
              margin: "20px 0",
            }}
          />
          <p style={{ fontSize: "14px", color: "#9ca3af" }}>
            A confirmation email will be sent to{" "}
            <strong>{customerEmail}</strong>.
          </p>
          <a
            href="/dashboard"
            style={{
              display: "inline-block",
              marginTop: "20px",
              padding: "10px 20px",
              backgroundColor: "#3b82f6",
              color: "#fff",
              textDecoration: "none",
              borderRadius: "6px",
            }}
          >
            Go to Dashboard
          </a>
        </div>
      </section>
    );
  }
}
