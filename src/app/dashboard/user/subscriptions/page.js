"use client";

import React from "react";
import { Check, Zap, Crown, Sparkles } from "lucide-react";

const subscriptionTiers = [
  {
    name: "Free",
    price: "$0",
    features: [
      "3 paintings max purchases",
      "Standard quality downloads",
      "Community support",
    ],
    buttonText: "Get Started",
    popular: false,
    icon: <Sparkles className="w-6 h-6 text-emerald-600" />,
    bgImage:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=600&auto=format&fit=crop",
    gradient: "from-background/60 via-background/20 to-background/70",
  },
  {
    name: "Pro",
    price: "$9.99",
    features: [
      "9 paintings max purchases",
      "High-resolution downloads",
      "Priority email support",
      "Exclusive marketplace access",
    ],
    buttonText: "Upgrade to Pro",
    popular: true,
    icon: <Zap className="w-6 h-6 text-violet-600" />,
    bgImage:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop",
    gradient: "from-violet-950/40 via-background/20 to-background/70",
  },
  {
    name: "Premium",
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
    icon: <Crown className="w-6 h-6 text-amber-600" />,
    bgImage:
      "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=600&auto=format&fit=crop",
    gradient: "from-amber-950/40 via-background/20 to-background/70",
  },
];

export default function SubscriptionCards({ activePlanName }) {
  return (
    <div className="bg-transparent text-foreground min-h-screen py-16 px-4">
      {/* Top Header Section */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-4xl font-bold tracking-tight mb-4 sm:text-5xl">
          Choose Your Plan
        </h2>
        <p className="text-base opacity-70">
          Unlock your creative potential and build your elite art masterpiece
          collection.
        </p>
      </div>

      {/* Subscription Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">
        {subscriptionTiers.map((tier) => {
          const isCurrent = tier.name === activePlanName;

          return (
            <div
              key={tier.name}
              style={{ backgroundImage: `url(${tier.bgImage})` }}
              className={`relative rounded-2xl p-8 border transition-all duration-300 flex flex-col justify-between min-h-[520px] bg-cover bg-center overflow-hidden group
                ${isCurrent ? "border-emerald-500 shadow-lg shadow-emerald-500/10" : ""}
                ${tier.popular && !isCurrent ? "border-violet-500 shadow-md shadow-violet-500/10 scale-105 md:scale-105 z-10" : "border-border shadow-sm hover:scale-[1.02]"}
              `}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-b ${tier.gradient} mix-blend-multiply opacity-90 pointer-events-none`}
              />

              {/* Active Plan Badge */}
              {isCurrent && (
                <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] px-3 py-1 rounded-bl-xl font-bold tracking-wider uppercase z-20">
                  Your Plan
                </div>
              )}

              {/* Popular Badge */}
              {tier.popular && !isCurrent && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-violet-600 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm z-20">
                  Most Popular
                </span>
              )}

              {/* Card Content */}
              <div className="relative z-10 text-white">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xl font-bold drop-shadow-sm">
                    {tier.name}
                  </span>
                  <div className="p-2 rounded-xl bg-white/90 backdrop-blur-sm shadow-sm">
                    {tier.icon}
                  </div>
                </div>

                <div className="mb-8">
                  <span className="text-4xl font-extrabold drop-shadow-md">
                    {tier.price}
                  </span>
                  <span className="text-white/80 text-sm font-medium drop-shadow-sm">
                    / month
                  </span>
                </div>

                {/* Features List */}
                <ul className="space-y-4 mb-8">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm">
                      <div className="p-0.5 rounded-full bg-white/90 shrink-0 mt-0.5 shadow-sm">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                      <span className="font-semibold drop-shadow-sm">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Submit Action */}
              <form
                action={`/api/subscription`}
                method="POST"
                className="relative z-10 mt-auto"
              >
                <input type="hidden" name="planName" value={tier.name} />
                <button
                  type="submit"
                  disabled={isCurrent}
                  className={`w-full py-3 rounded-xl font-bold text-sm transition-all duration-200 ${
                    isCurrent
                      ? "bg-white/20 text-white/60 backdrop-blur-sm cursor-not-allowed border border-white/10"
                      : tier.popular
                        ? "bg-violet-600 text-white hover:bg-violet-700 hover:shadow-md hover:shadow-violet-600/20 active:scale-[0.98]"
                        : "bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.98]"
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
