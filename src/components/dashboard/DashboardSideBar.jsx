"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  Menu,
  X,
  Home,
  Image as ImageIcon,
  History,
  CreditCard,
  User,
  PlusCircle,
  FolderEdit,
  TrendingUp,
  BarChart3,
  DollarSign,
  Users,
  LogOut,
} from "lucide-react";
import Image from "next/image";

export default function DashboardSideBar({ session }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Close mobile drawer upon path changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const rawRole = session?.user?.role || "user";
  const role = rawRole.toLowerCase();

  const userImage = session?.user?.image;
  const userName = session?.user?.name || "User";

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
        icon: ImageIcon,
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
      {
        label: "Edit arts",
        href: "/dashboard/artist/edit-artworks",
        icon: ImageIcon,
      },
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
      { label: "ArtWorks", href: "/dashboard/admin/artworks", icon: ImageIcon },
      {
        label: "Transactions",
        href: "/dashboard/admin/transactions",
        icon: DollarSign,
      },
      { label: "Users", href: "/dashboard/admin/users", icon: Users },
    ],
  };

  const serializableNavItems = mobileNavLabels[role] || mobileNavLabels["user"];

  const checkActiveState = (itemHref) => {
    if (itemHref === "/dashboard/artist/artworks/id") {
      return (
        pathname.startsWith("/dashboard/artist/artworks/") &&
        pathname !== "/dashboard/artist/artworks"
      );
    }
    return pathname === itemHref;
  };

  return (
    <>
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 border-r border-border p-4 h-screen sticky top-0 bg-background text-foreground transition-colors duration-300 select-none justify-between">
        <div className="flex flex-col gap-4 overflow-y-auto no-scrollbar">
          {/* User Profile Info Header */}
          <div className="flex items-center gap-3 p-2 border-b border-border/50 pb-4">
            {userImage ? (
              <Image
                src={userImage}
                alt={userName}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-border"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground uppercase">
                {userName.charAt(0)}
              </div>
            )}
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold truncate">{userName}</span>
              <span className="text-xs opacity-70 truncate capitalize">
                {role} Account
              </span>
            </div>
          </div>

          {/* Desktop Links Navigation */}
          <nav className="flex flex-col gap-2">
            {serializableNavItems.map((item, index) => {
              const isActive = checkActiveState(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={`desktop-${item.href}-${index}`}
                  href={item.href}
                  className={`p-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-3 ${
                    isActive
                      ? "bg-accent text-accent-foreground font-semibold"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon
                    size={18}
                    className={
                      isActive
                        ? "text-accent-foreground"
                        : "text-muted-foreground"
                    }
                  />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Desktop Logout Wrapper */}
        <div className="pt-4 border-t border-border/50">
          <button
            onClick={handleLogout}
            className="w-full p-3 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors flex items-center gap-3"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* ================= MOBILE HEADER TOP BAR ================= */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-background/90 backdrop-blur-md border-b border-border px-4 flex items-center justify-between z-40 transition-colors duration-300">
        <h2 className="text-md font-bold capitalize">{role} Dashboard</h2>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-muted-foreground hover:text-foreground focus:outline-none rounded-md hover:bg-muted"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Spacing for mobile fixed header */}
      <div className="w-full h-16 md:hidden block shrink-0" />

      {/* ================= MOBILE DRAWER BACKDROP OVERLAY ================= */}
      <div
        className={`fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* ================= MOBILE SLIDING SIDEBAR DRAWER ================= */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-background text-foreground z-50 p-6 shadow-xl flex flex-col md:hidden transition-transform duration-300 ease-in-out justify-between ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-4 overflow-y-auto no-scrollbar">
          <div className="flex justify-between items-center pb-4 border-b border-border/50">
            {/* Mobile User Metadata */}
            <div className="flex items-center gap-3">
              {userImage ? (
                <Image
                  src={userImage}
                  alt={userName}
                  width={36}
                  height={36}
                  className="w-9 h-9 rounded-full object-cover ring-1 ring-border"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground uppercase text-sm">
                  {userName.charAt(0)}
                </div>
              )}
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold truncate">
                  {userName}
                </span>
                <span className="text-xs opacity-70 capitalize">{role}</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-muted-foreground p-1 hover:bg-muted rounded-md transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Mobile Drawer Menu Links */}
          <nav className="flex flex-col gap-2">
            {serializableNavItems.map((item, index) => {
              const isActive = checkActiveState(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={`mobile-${item.href}-${index}`}
                  href={item.href}
                  className={`p-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-3 ${
                    isActive
                      ? "bg-accent text-accent-foreground font-semibold"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon
                    size={18}
                    className={
                      isActive
                        ? "text-accent-foreground"
                        : "text-muted-foreground"
                    }
                  />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Mobile App Bottom Logout Wrapper Area */}
        <div className="pt-4 border-t border-border/50">
          <button
            onClick={handleLogout}
            className="w-full p-3 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors flex items-center gap-3"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
