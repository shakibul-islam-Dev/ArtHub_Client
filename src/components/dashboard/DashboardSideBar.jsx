"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
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
  LogOut,
} from "lucide-react";

export default function DashboardSideBar({ session }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // পাথ চেঞ্জ হলে মোবাইল মেনু বন্ধ হবে
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const rawRole = session?.user?.role || "user";
  const role = rawRole.toLowerCase();

  // ইউজারের ইনফরমেশন (অবতারের জন্য)
  const userImage = session?.user?.image;
  const userName = session?.user?.name || "User";

  // Better Auth লগআউট হ্যান্ডলার
  const handleLogout = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/login");
            router.refresh();
          },
        },
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

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
      // {
      //   label: "Approve Artworks",
      //   href: "/dashboard/admin/approve-artworks",
      //   icon: CheckSquare,
      // },
    ],
  };

  const serializableNavItems = mobileNavLabels[role] || mobileNavLabels["user"];

  return (
    <>
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 border-r border-slate-200 p-4 h-screen sticky top-0 bg-white select-none justify-between">
        <div className="flex flex-col gap-4 overflow-y-auto no-scrollbar">
          {/* ইউজার অবতার (সবার উপরে) */}
          <div className="flex items-center gap-3 p-2 border-b border-slate-100 pb-4">
            {userImage ? (
              <img
                src={userImage}
                alt={userName}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 uppercase">
                {userName.charAt(0)}
              </div>
            )}
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-slate-800 truncate">
                {userName}
              </span>
              <span className="text-xs text-slate-500 truncate capitalize">
                {role} Account
              </span>
            </div>
          </div>

          {/* ডেক্সটপ নেভিগেশন লিংকসমূহ */}
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
        </div>

        {/* লগআউট বাটন (একবারে নিচে) */}
        <div className="pt-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full p-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
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
        className={`fixed inset-y-0 right-0 w-64 bg-white z-50 p-6 shadow-xl flex flex-col md:hidden transition-transform duration-300 ease-in-out justify-between ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-4 overflow-y-auto no-scrollbar">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100">
            {/* মোবাইল অবতার */}
            <div className="flex items-center gap-3">
              {userImage ? (
                <img
                  src={userImage}
                  alt={userName}
                  className="w-9 h-9 rounded-full object-cover"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 uppercase text-sm">
                  {userName.charAt(0)}
                </div>
              )}
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold text-slate-800 truncate">
                  {userName}
                </span>
                <span className="text-xs text-slate-500 capitalize">
                  {role}
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-500 p-1"
            >
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

        {/* মোবাইল লগআউট বাটন (একবারে নিচে) */}
        <div className="pt-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full p-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
