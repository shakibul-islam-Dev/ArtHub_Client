import { redirect } from "next/navigation";
import { stripe, PLAN_PRCE_ID } from "@/lib/stripe";
import Link from "next/link";

export default async function Success({ searchParams }) {
  const { session_id } = await searchParams;
  if (!session_id) {
    throw new Error("Please provide a valid session_id (`cs_test_...`)");
  }

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
    const planName =
      Object.keys(PLAN_PRCE_ID).find(
        (key) => PLAN_PRCE_ID[key] === metadata?.priceId,
      ) || "free";

    // মেটাডাটা থেকে রোল নেওয়া হচ্ছে, না থাকলে প্ল্যান নেমটাই রোল হিসেবে কাজ করবে
    const role = metadata?.role || planName || "user";

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
          status: status,
          sessionId: session_id,
          planName: planName,
          role: role,
        }),
      });
    } catch (err) {
      console.error("❌ Failed to sync with backend DB:", err.message);
    }

    return (
      <div className="flex min-h-[85vh] w-full flex-col items-center justify-center p-4 sm:p-8">
        <div className="flex flex-col items-center justify-center gap-6 rounded-2xl bg-card p-6 sm:p-8 text-center shadow-md max-w-md w-full border border-border/60 animate-fade-in">
          {/* Success Animated SVG Icon */}
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20">
            <svg
              className="h-10 w-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          {/* Heading & Plan Badge */}
          <div className="space-y-3">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Payment Successful!
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Thank you for upgrading! Your account has been successfully
              activated for the{" "}
              <span className="font-semibold text-primary uppercase bg-primary/10 px-2 py-0.5 rounded-md text-xs tracking-wider inline-block">
                {planName}
              </span>{" "}
              plan.
            </p>
          </div>

          <hr className="w-full border-border/60" />

          {/* Confirmation Info */}
          <p className="text-xs text-muted-foreground/80 leading-relaxed">
            A confirmation email will be sent to{" "}
            <span className="font-medium text-foreground">{customerEmail}</span>{" "}
            shortly.
          </p>

          <Link
            href={`/`}
            className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Go to Home
          </Link>
        </div>
      </div>
    );
  }
}
