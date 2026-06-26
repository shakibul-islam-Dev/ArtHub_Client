import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import { CheckCircle2, Home, Mail } from "lucide-react";
import Link from "next/link";

export default async function Success({ searchParams }) {
  const { session_id } = await searchParams;

  if (!session_id) {
    throw new Error("Please provide a valid session_id");
  }

  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items", "payment_intent"],
  });

  if (session.status === "open") {
    return redirect("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-6">
      <div className="max-w-md w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-xl shadow-emerald-500/5 text-center">
        {/* Success Icon */}
        <div className="mx-auto w-16 h-16 bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center rounded-full mb-6">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
        </div>

        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
          Payment Successful!
        </h1>

        <p className="text-zinc-600 dark:text-zinc-400 mb-8 text-sm leading-relaxed">
          We appreciate your business! A confirmation email has been sent to{" "}
          <span className="font-semibold text-zinc-900 dark:text-zinc-200">
            {session.customer_details?.email}
          </span>
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-colors"
          >
            <Home className="w-4 h-4" />
            Go to Home
          </Link>

          <a
            href="mailto:support@yourdomain.com"
            className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-xl font-medium transition-colors"
          >
            <Mail className="w-4 h-4" />
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
