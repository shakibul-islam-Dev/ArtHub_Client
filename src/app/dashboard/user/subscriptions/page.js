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
    icon: <Sparkles className="w-6 h-6 text-emerald-500" />,
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
    icon: <Zap className="w-6 h-6 text-violet-500" />,
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
    icon: <Crown className="w-6 h-6 text-amber-500" />,
  },
];

export default function SubscriptionCards({ activePlanName }) {
  return (
    // মেইন কন্টেইনারে dark:bg-slate-950 এবং light mode এর জন্য bg-slate-50
    <div className="bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 min-h-screen py-16 px-4">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-4xl font-bold mb-4">Choose Your Plan</h2>
        <p className="text-slate-600 dark:text-slate-400">
          Unlock your creative potential.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {subscriptionTiers.map((tier) => {
          const isCurrent = tier.name === activePlanName;

          return (
            <div
              key={tier.name}
              className={`relative rounded-2xl p-8 border transition-all duration-300 flex flex-col justify-between 
                ${tier.popular ? "border-violet-500 shadow-lg" : "border-slate-200 dark:border-slate-700"}
                bg-white dark:bg-slate-900/50`}
            >
              {isCurrent && (
                <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded-bl-lg font-bold">
                  YOUR PLAN
                </div>
              )}

              {tier.popular && !isCurrent && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-violet-600 text-white text-xs px-3 py-1 rounded-full uppercase">
                  Most Popular
                </span>
              )}

              <div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xl font-bold">{tier.name}</span>
                  {tier.icon}
                </div>
                <div className="mb-8">
                  <span className="text-4xl font-extrabold">{tier.price}</span>
                  <span className="text-slate-500 text-sm">/ month</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm">
                      <Check className="w-4 h-4 text-emerald-500" />
                      <span className="text-slate-600 dark:text-slate-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                className={`w-full py-3 rounded-xl font-bold transition-colors ${
                  isCurrent
                    ? "bg-slate-200 dark:bg-slate-700 cursor-default"
                    : tier.popular
                      ? "bg-violet-600 text-white hover:bg-violet-700"
                      : "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                }`}
              >
                {isCurrent ? "Current Plan" : tier.buttonText}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
