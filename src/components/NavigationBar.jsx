"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useSession, authClient } from "@/lib/auth-client";
import {
  Moon,
  Sun,
  LogOut,
  LayoutDashboard,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { Avatar, Dropdown, Label } from "@heroui/react";
import { Button } from "@/components/ui/button";

const NavigationBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  // ডাটাবেজ থেকে রিয়েল-টাইম ডেটা সিঙ্ক করার জন্য স্টেট
  const [dbUserName, setDbUserName] = useState(null);
  const [dbUserImage, setDbUserImage] = useState(null);
  const [dbUserPlan, setDbUserPlan] = useState("Free"); // ডিফল্ট 'Free' রাখা হলো

  const pathname = usePathname();
  const router = useRouter();

  const { data: session, isPending } = useSession();
  const role = session?.user?.role?.toLowerCase(); // নিরাপদভাবে রোল রিড করার জন্য

  // ডাটাবেজ থেকে লেটেস্ট তথ্য (নাম, ইমেজ, সাবস্ক্রিপশন প্ল্যান) ফেচ করার ইফেক্ট
  useEffect(() => {
    const fetchLatestUserData = async () => {
      if (!session?.user?.id || !session?.user?.email) return;

      const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:5000";

      try {
        // ১. ইউজারের বেসিক প্রোফাইল ডেটা আনা (নাম, ছবি) - এটি সবার জন্যই চলবে
        const userRes = await fetch(
          `${baseUrl}/api/arthub/user/${session.user.id}`,
        );
        if (userRes.ok) {
          const data = await userRes.json();
          const userData = data?.success ? data.data : data;

          const fetchedImage = userData?.image_url || userData?.image;
          if (fetchedImage) setDbUserImage(fetchedImage);

          const fetchedName = userData?.name || userData?.username;
          if (fetchedName) setDbUserName(fetchedName);
        }

        // 🚀 ফিক্স: ইউজার আর্টিস্ট বা এডমিন হলে সাবস্ক্রিপশন চেক করার দরকার নেই
        if (role === "artist" || role === "admin") {
          setDbUserPlan(role); // প্ল্যানের জায়গায় আর্টিস্ট/এডমিন টেক্সটই সেট করে দেওয়া হলো
          return;
        }

        // ২. নতুন ডেডিকেটেড সাবস্ক্রিপশন এপিআই থেকে লাইভ প্ল্যান আনা (শুধুমাত্র জেনারেল ইউজারদের জন্য)
        const subRes = await fetch(
          `${baseUrl}/api/arthub/subscriptions/subscriptions/${session.user.email}`,
        );
        if (subRes.ok) {
          const subData = await subRes.json();
          // যদি সাবস্ক্রিপশন স্ট্যাটাস 'complete' থাকে তবে ডাটাবেজের planName সেট হবে
          if (subData?.success && subData?.data?.status === "complete") {
            setDbUserPlan(subData.data.planName || "Free");
          } else {
            setDbUserPlan("Free");
          }
        } else {
          setDbUserPlan("Free"); // এপিআই ৪MD বা কোনো এরর দিলে ফ্রী প্ল্যান দেখাবে
        }
      } catch (error) {
        console.error(
          "Error fetching latest user or subscription data on navbar:",
          error,
        );
      }
    };

    fetchLatestUserData();
  }, [session?.user?.id, session?.user?.email, pathname, role]); // ডিপেন্ডেন্সিতে role অ্যাড করা হলো

  // সেশন ইমেজ চেঞ্জ হলে এরর রিসেট করা
  const rawImageUrl =
    dbUserImage ||
    session?.user?.image ||
    session?.user?.image_url ||
    session?.user?.picture;
  const userImageUrl = rawImageUrl?.trim();

  useEffect(() => {
    setImageError(false);
  }, [userImageUrl]);

  if (pathname.startsWith("/dashboard/")) {
    return null;
  }

  // Handle Logout
  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
          router.refresh();
        },
      },
    });
  };

  const dashboardPath = `/dashboard/${session?.user?.role}`;
  const settingsPath = `/settings`;
  const isActive = (path) => pathname === path;

  // ফাইনাল ডাটা রেজোলিউশন
  const userName = dbUserName || session?.user?.name || "User";
  const userEmail = session?.user?.email;
  const userPlan = dbUserPlan; // নতুন আপগ্রেডেড লাইভ প্ল্যান (free, pro, premium, artist)
  const userInitial = userName?.trim().charAt(0).toUpperCase() || "U";

  return (
    <nav className="bg-background text-foreground border-b border-border sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link
            href="/"
            className="font-bold text-2xl text-primary flex items-center tracking-tight"
          >
            Art Hub
          </Link>

          {/* ================= DESKTOP & TABLET MENU ================= */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className={
                isActive("/")
                  ? "text-primary font-bold"
                  : "text-muted-foreground hover:text-primary transition"
              }
            >
              Home
            </Link>
            <Link
              href="/browse-artworks"
              className={
                isActive("/browse-artworks")
                  ? "text-primary font-bold"
                  : "text-muted-foreground hover:text-primary transition"
              }
            >
              Browse
            </Link>

            {role !== "artist" && (
              <Link
                href="/plans"
                className={
                  isActive("/plans")
                    ? "text-primary font-bold"
                    : "text-muted-foreground hover:text-primary transition"
                }
              >
                Plans
              </Link>
            )}

            {/* Dark Mode Toggle */}
            <ModeToggle />

            {isPending ? (
              <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
            ) : session ? (
              <Dropdown>
                <Dropdown.Trigger className="rounded-full cursor-pointer focus:outline-none">
                  <div>
                    <Avatar
                      src={
                        userImageUrl && !imageError ? userImageUrl : undefined
                      }
                      fallback={
                        <span className="font-semibold text-sm">
                          {userInitial}
                        </span>
                      }
                      className="bg-primary text-primary-foreground font-semibold cursor-pointer border border-border"
                      onError={() => setImageError(true)}
                    />
                  </div>
                </Dropdown.Trigger>

                <Dropdown.Popover className="bg-popover text-popover-foreground border border-border">
                  <div className="px-3 pt-3 pb-2 border-b border-border/50">
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={
                          userImageUrl && !imageError ? userImageUrl : undefined
                        }
                        fallback={
                          <span className="font-medium text-xs">
                            {userInitial}
                          </span>
                        }
                        size="sm"
                        className="bg-primary text-primary-foreground border border-border"
                        onError={() => setImageError(true)}
                      />
                      <div className="flex flex-col gap-0.5 min-w-0">
                        {userName && (
                          <p className="text-sm leading-5 font-semibold flex items-center gap-2">
                            <span className="truncate">{userName}</span>
                            <span className="text-[10px] text-primary font-medium uppercase tracking-wide bg-primary/10 px-1.5 py-0.5 rounded shrink-0">
                              {userPlan}
                            </span>
                          </p>
                        )}
                        {userEmail && (
                          <p className="text-xs leading-none text-muted-foreground truncate">
                            {userEmail}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <Dropdown.Menu>
                    <Dropdown.Item
                      id="dashboard"
                      textValue="Dashboard"
                      onPress={() => router.push(dashboardPath)}
                    >
                      <div className="flex w-full items-center justify-between gap-2 py-0.5">
                        <Label className="cursor-pointer text-foreground">
                          Dashboard
                        </Label>
                        <LayoutDashboard
                          size={16}
                          className="text-muted-foreground"
                        />
                      </div>
                    </Dropdown.Item>

                    <Dropdown.Item
                      id="settings"
                      textValue="Settings"
                      onPress={() => router.push(settingsPath)}
                    >
                      <div className="flex w-full items-center justify-between gap-2 py-0.5">
                        <Label className="cursor-pointer text-foreground">
                          Settings
                        </Label>
                        <Settings size={16} className="text-muted-foreground" />
                      </div>
                    </Dropdown.Item>

                    <Dropdown.Item
                      id="logout"
                      textValue="Logout"
                      variant="danger"
                      onPress={handleLogout}
                    >
                      <div className="flex w-full items-center justify-between gap-2 py-0.5">
                        <Label className="text-destructive cursor-pointer">
                          Log Out
                        </Label>
                        <LogOut size={16} className="text-destructive" />
                      </div>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown.Popover>
              </Dropdown>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="text-muted-foreground hover:text-primary transition font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/registration"
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition font-medium"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* ================= MOBILE HAMBURGER BUTTON ================= */}
          <div className="flex md:hidden items-center space-x-3">
            <ModeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-muted-foreground hover:text-primary focus:outline-none p-1"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* ================= MOBILE DROPDOWN MENU ================= */}
      {isOpen && (
        <div className="md:hidden bg-background border-b border-border px-4 pt-2 pb-4 space-y-3 shadow-lg absolute w-full left-0 z-40 transition-all">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className={`block px-3 py-2 rounded-md font-medium ${isActive("/") ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-muted"}`}
          >
            Home
          </Link>
          <Link
            href="/browse-artworks"
            onClick={() => setIsOpen(false)}
            className={`block px-3 py-2 rounded-md font-medium ${isActive("/browse-artworks") ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-muted"}`}
          >
            Browse
          </Link>

          {role !== "artist" && (
            <Link
              href="/plans"
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-2 rounded-md font-medium ${isActive("/plans") ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-muted"}`}
            >
              Plans
            </Link>
          )}

          <hr className="border-border/50 my-2" />

          {isPending ? (
            <div className="h-10 w-full bg-muted animate-pulse rounded-md" />
          ) : session ? (
            <div className="space-y-3 px-3">
              <div className="flex items-center gap-3 py-2">
                <Avatar
                  src={userImageUrl && !imageError ? userImageUrl : undefined}
                  showFallback
                  fallback={
                    <span className="font-bold text-base">{userInitial}</span>
                  }
                  className="w-10 h-10 bg-primary text-primary-foreground border border-border"
                  onError={() => setImageError(true)}
                />
                <div className="min-w-0 flex-1">
                  {userName && (
                    <p className="text-sm font-semibold flex items-center gap-2">
                      <span className="truncate">{userName}</span>
                      <span className="text-[9px] text-primary font-bold uppercase bg-primary/10 px-1 rounded shrink-0">
                        {userPlan}
                      </span>
                    </p>
                  )}
                  {userEmail && (
                    <p className="text-xs text-muted-foreground truncate">
                      {userEmail}
                    </p>
                  )}
                </div>
              </div>

              <Link
                href={dashboardPath}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 text-muted-foreground hover:text-primary py-2 transition text-sm font-medium"
              >
                <LayoutDashboard size={18} /> Dashboard
              </Link>

              <Link
                href={settingsPath}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 text-muted-foreground hover:text-primary py-2 transition text-sm font-medium"
              >
                <Settings size={18} /> Settings
              </Link>

              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="flex w-full items-center gap-2 text-destructive hover:opacity-90 py-2 transition text-sm font-medium"
              >
                <LogOut size={18} /> Log Out
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 pt-2 px-3">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="text-center text-muted-foreground hover:text-primary py-2 rounded-lg font-medium border border-border"
              >
                Login
              </Link>
              <Link
                href="/registration"
                onClick={() => setIsOpen(false)}
                className="text-center bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:opacity-90 transition"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default NavigationBar;

/* ================= থিম টগল বাটন ================= */
export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative w-9 h-9 shrink-0 rounded-lg border-border bg-background hover:bg-accent"
      title="Toggle theme"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90 text-foreground" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0 text-foreground" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
