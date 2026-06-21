import React from "react";
import { Check, Zap, Crown, Sparkles } from "lucide-react";

// Define the pricing tier data structure

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
    icon: <Sparkles className="w-6 h-6 text-emerald-400" />,
    gradient: "from-slate-800 to-slate-900 border-slate-700/50",
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
    icon: <Zap className="w-6 h-6 text-violet-400" />,
    gradient:
      "from-violet-950/40 via-slate-900 to-slate-900 border-violet-500/40 shadow-[0_0_30px_rgba(139,92,246,0.1)]",
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
    icon: <Crown className="w-6 h-6 text-amber-400" />,
    gradient: "from-slate-800 to-slate-900 border-amber-500/20",
  },
];

export default function SubscriptionCards() {
  return (
    <div className="bg-[#0b0f19] text-slate-100 min-h-screen flex flex-col justify-center items-center px-4 py-16 font-sans">
      {/* Header Section */}
      <div className="text-center max-w-2xl mb-16 space-y-4">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
          Choose Your Plan
        </h2>
        <p className="text-slate-400 text-base md:text-lg">
          Unlock your creative potential with flexible options tailored to your
          artistic needs.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
        {subscriptionTiers.map((tier) => (
          <div
            key={tier.name}
            className={`relative rounded-2xl bg-gradient-to-b border p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 ${tier.gradient}`}
          >
            {/* Popular Badge */}
            {tier.popular && (
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-semibold px-4 py-1 rounded-full uppercase tracking-wider shadow-md">
                Most Popular
              </span>
            )}

            {/* Content Top */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-xl font-bold tracking-wide text-slate-200">
                  {tier.name}
                </span>
                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/50">
                  {tier.icon}
                </div>
              </div>

              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
                  {tier.price}
                </span>
                <span className="text-slate-400 text-sm">/ month</span>
              </div>

              {/* Features List */}
              <ul className="space-y-4 mb-8">
                {tier.features.map((feature, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-sm text-slate-300"
                  >
                    <Check
                      className={`w-5 h-5 shrink-0 mt-0.5 ${tier.popular ? "text-violet-400" : "text-emerald-400"}`}
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Button */}
            <button
              className={`w-full py-3.5 px-4 rounded-xl font-medium text-sm tracking-wide transition-all duration-200 ${
                tier.popular
                  ? "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-[0_4px_20px_rgba(124,58,237,0.3)]"
                  : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80"
              }`}
            >
              {tier.buttonText}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
