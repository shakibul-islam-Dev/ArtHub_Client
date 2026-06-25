"use client";

import React, { useState } from "react";
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
  const pathname = usePathname();
  const router = useRouter();

  const { data: session } = useSession();

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

  const role = session?.user?.role;
  const dashboardPath = `/dashboard/${role}`;
  const settingsPath = `/settings`;
  const isActive = (path) => pathname === path;

  const userName = session?.user?.name;
  const userEmail = session?.user?.email;

  // 🛠️ ডাটাবেজ বা সেশনের সম্ভাব্য সব ইমেজ ফিল্ড একসাথে হ্যান্ডেল করা হলো
  const userImageUrl =
    session?.user?.image || session?.user?.image_url || session?.user?.picture;
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

            {/* Dark Mode Toggle */}
            <ModeToggle />

            {session && (
              <Dropdown>
                <Dropdown.Trigger className="rounded-full cursor-pointer focus:outline-none">
                  <div>
                    {" "}
                    {/* Trigger এরর এড়াতে div র‍্যাপার যোগ করা হয়েছে */}
                    <Avatar
                      src={userImageUrl || undefined}
                      name={userInitial}
                      className="bg-primary text-primary-foreground font-semibold cursor-pointer border border-border"
                    >
                      {!userImageUrl && userInitial}
                    </Avatar>
                  </div>
                </Dropdown.Trigger>

                <Dropdown.Popover className="bg-popover text-popover-foreground border border-border">
                  <div className="px-3 pt-3 pb-2 border-b border-border/50">
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={userImageUrl || undefined}
                        name={userInitial}
                        size="sm"
                        className="bg-primary text-primary-foreground font-medium border border-border"
                      >
                        {!userImageUrl && userInitial}
                      </Avatar>
                      <div className="flex flex-col gap-0">
                        {userName && (
                          <p className="text-sm leading-5 font-semibold">
                            {userName}
                          </p>
                        )}
                        {userEmail && (
                          <p className="text-xs leading-none text-muted-foreground">
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
            )}

            {!session && (
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

          <hr className="border-border/50 my-2" />

          {session ? (
            <div className="space-y-3 px-3">
              <div className="flex items-center gap-3 py-2">
                <Avatar
                  src={userImageUrl || undefined}
                  name={userInitial}
                  className="w-10 h-10 bg-primary text-primary-foreground font-bold text-base border border-border"
                >
                  {!userImageUrl && userInitial}
                </Avatar>
                <div>
                  {userName && (
                    <p className="text-sm font-semibold">{userName}</p>
                  )}
                  {userEmail && (
                    <p className="text-xs text-muted-foreground">{userEmail}</p>
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
