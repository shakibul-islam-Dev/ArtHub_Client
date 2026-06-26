"use client";

import React from "react";
import { Check, Zap, Crown, Sparkles } from "lucide-react";

const subscriptionTiers = [
  {
    name: "Free",
    id: "free",
    price: "$0",
    features: [
      "3 paintings max purchases",
      "Standard quality downloads",
      "Community support",
    ],
    buttonText: "Get Started",
    popular: false,
    icon: (
      <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
    ),
    bgImage:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=600&auto=format&fit=crop",
    gradient:
      "from-emerald-500/10 via-background/80 to-background dark:from-emerald-950/20 dark:via-zinc-950/60 dark:to-zinc-950",
  },
  {
    name: "Pro",
    id: "pro",
    price: "$9.99",
    features: [
      "9 paintings max purchases",
      "High-resolution downloads",
      "Priority email support",
      "Exclusive marketplace access",
    ],
    buttonText: "Upgrade to Pro",
    popular: true,
    icon: <Zap className="w-5 h-5 text-violet-600 dark:text-violet-400" />,
    bgImage:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop",
    gradient:
      "from-violet-500/10 via-background/80 to-background dark:from-violet-950/30 dark:via-zinc-950/60 dark:to-zinc-950",
  },
  {
    name: "Premium",
    id: "premium",
    price: "$19.99",
    features: [
      "Unlimited paintings",
      "Ultra HD / Vector exports",
      "24/7 Dedicated assistance",
      "Commercial use license",
      "Early access to new styles",
    ],
    buttonText: "Go Premium",
    popular: false,
    icon: <Crown className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
    bgImage:
      "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=600&auto=format&fit=crop",
    gradient:
      "from-amber-500/10 via-background/80 to-background dark:from-amber-950/20 dark:via-zinc-950/60 dark:to-zinc-950",
  },
];

export default function SubscriptionCards({ activePlanName }) {
  return (
    <div className="bg-transparent text-foreground py-16 px-4">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-4xl font-bold tracking-tight mb-4 sm:text-5xl text-slate-900 dark:text-zinc-50">
          Choose Your Plan
        </h2>
        <p className="text-base text-muted-foreground">
          Unlock your creative potential and build your elite art masterpiece
          collection.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
        {subscriptionTiers.map((tier) => {
          const isCurrent = tier.name === activePlanName;

          return (
            <div
              key={tier.id}
              style={{ backgroundImage: `url(${tier.bgImage})` }}
              className={`relative rounded-2xl p-8 border transition-all duration-300 flex flex-col justify-between bg-cover bg-center overflow-hidden group
                ${
                  isCurrent
                    ? "border-emerald-500 shadow-lg shadow-emerald-500/10 dark:shadow-emerald-500/5 ring-1 ring-emerald-500"
                    : "border-slate-200 dark:border-zinc-800"
                }
                ${
                  tier.popular && !isCurrent
                    ? "border-violet-500 shadow-xl shadow-violet-500/10 scale-105 md:scale-105 z-10"
                    : "shadow-sm hover:scale-[1.02] hover:border-slate-300 dark:hover:border-zinc-700"
                }
              `}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-b ${tier.gradient} mix-blend-multiply dark:mix-blend-overlay pointer-events-none`}
              />

              {isCurrent && (
                <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] px-3 py-1 rounded-bl-xl font-bold tracking-wider uppercase z-20 shadow-sm">
                  Your Plan
                </div>
              )}

              {tier.popular && !isCurrent && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-violet-600 text-white text-xs font-semibold px-4 py-1 rounded-full uppercase tracking-wider shadow-md z-20">
                  Most Popular
                </span>
              )}

              <div className="relative z-10 text-slate-900 dark:text-zinc-100 flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xl font-bold tracking-tight">
                    {tier.name}
                  </span>
                  <div className="p-2 rounded-xl bg-white/80 dark:bg-zinc-900/90 backdrop-blur-md shadow-sm border border-slate-100 dark:border-zinc-800">
                    {tier.icon}
                  </div>
                </div>

                <div className="mb-8">
                  <span className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-50">
                    {tier.price}
                  </span>
                  <span className="text-slate-500 dark:text-zinc-400 text-sm font-medium ml-1">
                    / month
                  </span>
                </div>

                <ul className="space-y-4 mb-8 flex-1">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm">
                      <div className="p-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/50 shrink-0 mt-0.5 border border-emerald-200 dark:border-emerald-900/30">
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <span className="font-medium text-slate-700 dark:text-zinc-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <form
                action={`/api/subscription`}
                method="POST"
                className="relative z-10 mt-auto pt-4"
              >
                {/* ID টি এখানে Hidden input হিসেবে যুক্ত করা হলো */}
                <input type="hidden" name="planId" value={tier.id} />
                <input type="hidden" name="planName" value={tier.name} />

                <button
                  type="submit"
                  disabled={isCurrent}
                  className={`w-full py-3 rounded-xl font-bold text-sm transition-all duration-200 shadow-sm ${
                    isCurrent
                      ? "bg-slate-100 text-slate-400 dark:bg-zinc-800 dark:text-zinc-500 cursor-not-allowed border border-slate-200 dark:border-zinc-700"
                      : tier.popular
                        ? "bg-violet-600 text-white hover:bg-violet-700 hover:shadow-lg hover:shadow-violet-600/20 active:scale-[0.98]"
                        : "bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-950 hover:bg-slate-800 dark:hover:bg-zinc-200 active:scale-[0.98]"
                  }`}
                >
                  {isCurrent ? "Current Plan" : tier.buttonText}
                </button>
              </form>
            </div>
          );
        })}
      </div>
    </div>
  );
}
