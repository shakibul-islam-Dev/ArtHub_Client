"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  BellFill,
  Envelope,
  HouseFill,
  Magnifier,
  ChartPie,
  PersonFill,
  Gpu,
} from "@gravity-ui/icons";

export default function NavLinks({ role }) {
  const pathname = usePathname();

  // সেফটি চেক: রোল স্ট্রিং না হলে কনভার্ট করা
  const currentRole = typeof role === "string" ? role.toLowerCase() : "user";

  const dashboardItems = {
    user: [
      {
        icon: BellFill,
        label: "Bought Artworks",
        href: "/dashboard/user/bought-artworks",
      },
      {
        icon: Magnifier,
        label: "Purchased History",
        href: "/dashboard/user/purchased-history",
      },
      {
        icon: Gpu,
        label: "Subscriptions",
        href: "/dashboard/user/subscriptions",
      },
      { icon: PersonFill, label: "Profile", href: "/dashboard/user/profile" },
    ],
    artist: [
      {
        icon: ChartPie,
        label: "Art Works",
        href: "/dashboard/artist/artworks",
      },
      {
        icon: Magnifier,
        label: "Manage Artworks",
        href: "/dashboard/artist/add-artwork",
      },
      {
        icon: BellFill,
        label: "Sales History",
        href: "/dashboard/artist/sales-history",
      },
      { icon: Envelope, label: "Profile", href: "/dashboard/artist/profile" },
    ],
    admin: [
      {
        icon: ChartPie,
        label: "Analytics",
        href: "/dashboard/admin/analytics",
      },
      { icon: HouseFill, label: "ArtWorks", href: "/dashboard/admin/artworks" },
      {
        icon: Gpu,
        label: "Transactions",
        href: "/dashboard/admin/transactions",
      },
      { icon: PersonFill, label: "Users", href: "/dashboard/admin/users" },
      {
        icon: Magnifier,
        label: "Approve Artworks",
        href: "/dashboard/admin/approve-artworks",
      },
    ],
  };

  // ডাইনামিকালি রোল চেক করা হচ্ছে। যদি অবজেক্টে রোল না থাকে, তবে ডিফল্ট হিসেবে user মেনু জেনারেট হবে।
  const currentNavItems = dashboardItems[currentRole] || dashboardItems["user"];

  return (
    <nav className="flex flex-col gap-1 mt-2">
      {currentNavItems.map((item, index) => {
        // যদি আইকন অবজেক্টে ডিফাইন করা না থাকে, তবে HouseFill ডিফল্ট হিসেবে বসবে
        const Icon = item.icon || HouseFill;
        const isActive = pathname === item.href;

        return (
          <motion.div
            key={`${item.label}-${index}`}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            <Link
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-200 relative group ${
                isActive
                  ? "bg-slate-100 text-slate-900 font-semibold"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute left-0 w-1 h-5 bg-slate-900 rounded-r-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}

              <Icon
                className={`size-5 shrink-0 transition-colors ${
                  isActive
                    ? "text-slate-900"
                    : "text-slate-400 group-hover:text-slate-700"
                }`}
              />
              {item.label}
            </Link>
          </motion.div>
        );
      })}
    </nav>
  );
}
