"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import NavLinks from "@/components/NavLinks";

export default function DashboardSideBar({ session }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // পাথ চেঞ্জ হলে মোবাইল মেনু বন্ধ হবে
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const rawRole = session?.user?.role || "user";
  const role = rawRole.toLowerCase();

  const mobileNavLabels = {
    user: [
      { label: "Home", href: "/dashboard/user" },
      { label: "Bought Artworks", href: "/dashboard/user/bought-artworks" },
      { label: "Purchased History", href: "/dashboard/user/purchased-history" },
      { label: "Subscriptions", href: "/dashboard/user/subscriptions" },
      { label: "Profile", href: "/dashboard/user/profile" },
    ],
    artist: [
      { label: "Home", href: "/dashboard/artist" },
      { label: "Manage Artworks", href: "/dashboard/artist/add-artwork" },
      { label: "Art Works", href: "/dashboard/artist/artworks" },
      { label: "Sales History", href: "/dashboard/artist/sales-history" },
      { label: "Profile", href: "/dashboard/artist/profile" },
    ],
    admin: [
      { label: "Home", href: "/dashboard/admin" },
      { label: "Analytics", href: "/dashboard/admin/analytics" },
      { label: "ArtWorks", href: "/dashboard/admin/artworks" },
      { label: "Transactions", href: "/dashboard/admin/transactions" },
      { label: "Users", href: "/dashboard/admin/users" },
      { label: "Approve Artworks", href: "/dashboard/admin/approve-artworks" },
    ],
  };

  const serializableNavItems = mobileNavLabels[role] || mobileNavLabels["user"];

  return (
    <>
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 border-r border-slate-200 p-4 h-screen sticky top-0 bg-white select-none">
        <div className="p-2 mb-4 border-b border-slate-100 pb-4">
          <h2 className="text-xl font-bold capitalize text-slate-800">
            {role} Dashboard
          </h2>
        </div>
        <NavLinks role={role} />
      </aside>

      {/* ================= MOBILE MENUBAR ================= */}
      <div className="md:hidden w-full bg-white/90 backdrop-blur-md border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-50">
        <h2 className="text-lg font-bold capitalize text-slate-800">
          {role} Dashboard
        </h2>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-slate-600 hover:text-slate-900 focus:outline-none"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* ================= MOBILE DRAWER (CSS BASED FIXED POSITION) ================= */}
      {/* ব্যাকড্রপ ওভারলে */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* স্লাইডিং মোবাইল মেনু */}
      <div
        className={`fixed inset-y-0 right-0 w-64 bg-white z-50 p-6 shadow-xl flex flex-col md:hidden transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
          <h3 className="text-lg font-bold capitalize text-slate-800">
            {role} Menu
          </h3>
          <button onClick={() => setIsOpen(false)} className="text-slate-500">
            <X size={20} />
          </button>
        </div>

        <nav className="flex flex-col gap-2">
          {serializableNavItems.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={`${item.href}-${index}`} // ইউনিক কি নিশ্চিত করা হয়েছে
                href={item.href}
                className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-slate-100 text-slate-900 font-semibold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
