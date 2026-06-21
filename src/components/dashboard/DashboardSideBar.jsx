"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Home,
  Image,
  History,
  CreditCard,
  User,
  PlusCircle,
  FolderEdit,
  TrendingUp,
  BarChart3,
  DollarSign,
  Users,
  CheckSquare,
} from "lucide-react";

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
      { label: "Home", href: "/dashboard/user", icon: Home },
      {
        label: "Bought Artworks",
        href: "/dashboard/user/bought-artworks",
        icon: Image,
      },
      {
        label: "Purchased History",
        href: "/dashboard/user/purchased-history",
        icon: History,
      },
      {
        label: "Subscriptions",
        href: "/dashboard/user/subscriptions",
        icon: CreditCard,
      },
      { label: "Profile", href: "/dashboard/user/profile", icon: User },
    ],
    //artist
    artist: [
      { label: "Home", href: "/dashboard/artist", icon: Home },
      {
        label: "Manage Artworks",
        href: "/dashboard/artist/artworks",
        icon: FolderEdit,
      },
      {
        label: "Add Arts",
        href: "/dashboard/artist/add-artworks",
        icon: PlusCircle,
      },
      { label: "Edit arts", href: "/dashboard/artist/artworks", icon: Image },
      {
        label: "Sales History",
        href: "/dashboard/artist/sales-history",
        icon: TrendingUp,
      },
      { label: "Profile", href: "/dashboard/artist/profile", icon: User },
    ],
    admin: [
      { label: "Home", href: "/dashboard/admin", icon: Home },
      {
        label: "Analytics",
        href: "/dashboard/admin/analytics",
        icon: BarChart3,
      },
      { label: "ArtWorks", href: "/dashboard/admin/artworks", icon: Image },
      {
        label: "Transactions",
        href: "/dashboard/admin/transactions",
        icon: DollarSign,
      },
      { label: "Users", href: "/dashboard/admin/users", icon: Users },
      {
        label: "Approve Artworks",
        href: "/dashboard/admin/approve-artworks",
        icon: CheckSquare,
      },
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

        {/* ডেস্কটপ নেভিগেশন লিংকসমূহ */}
        <nav className="flex flex-col gap-2">
          {serializableNavItems.map((item, index) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={`desktop-${item.href}-${index}`}
                href={item.href}
                className={`p-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-3 ${
                  isActive
                    ? "bg-slate-100 text-slate-900 font-semibold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon
                  size={18}
                  className={isActive ? "text-slate-900" : "text-slate-500"}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>
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

      {/* ================= MOBILE DRAWER ================= */}
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
            const Icon = item.icon;
            return (
              <Link
                key={`mobile-${item.href}-${index}`}
                href={item.href}
                className={`p-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-3 ${
                  isActive
                    ? "bg-slate-100 text-slate-900 font-semibold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon
                  size={18}
                  className={isActive ? "text-slate-900" : "text-slate-500"}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
