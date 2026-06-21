"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, authClient } from "@/lib/auth-client";
import { LogOut, LayoutDashboard, Settings, Menu, X } from "lucide-react";
import { Avatar, Dropdown, Label } from "@heroui/react";

const NavigationBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  // Guard clause
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

  const role = session?.user?.role || "user";
  const dashboardPath = `/dashboard/${role}`;
  const settingsPath = `/settings`;
  const isActive = (path) => pathname === path;

  // ইউজার নামের প্রথম অক্ষর
  const userInitial = session?.user?.name
    ? session.user.name.trim().charAt(0).toUpperCase()
    : "U";
  const userName = session?.user?.name || "User";
  const userEmail = session?.user?.email || "user@example.com";

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link
            href="/"
            className="font-bold text-2xl text-blue-600 flex items-center"
          >
            Art Hub
          </Link>

          {/* ================= DESKTOP & TABLET MENU ================= */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className={
                isActive("/")
                  ? "text-blue-600 font-bold"
                  : "text-gray-600 hover:text-blue-600 transition"
              }
            >
              Home
            </Link>
            <Link
              href="/browse-artworks"
              className={
                isActive("/browse-artworks")
                  ? "text-blue-600 font-bold"
                  : "text-gray-600 hover:text-blue-600 transition"
              }
            >
              Browse
            </Link>

            {session ? (
              <Dropdown>
                <Dropdown.Trigger className="rounded-full cursor-pointer focus:outline-none">
                  <Avatar className="bg-blue-600 text-white font-semibold cursor-pointer">
                    <Avatar.Fallback>{userInitial}</Avatar.Fallback>
                  </Avatar>
                </Dropdown.Trigger>

                <Dropdown.Popover>
                  <div className="px-3 pt-3 pb-2 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <Avatar
                        size="sm"
                        className="bg-blue-600 text-white font-medium"
                      >
                        <Avatar.Fallback>{userInitial}</Avatar.Fallback>
                      </Avatar>
                      <div className="flex flex-col gap-0">
                        <p className="text-sm leading-5 font-semibold text-gray-800">
                          {userName}
                        </p>
                        <p className="text-xs leading-none text-gray-500">
                          {userEmail}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Dropdown.Menu>
                    {/* ড্যাশবোর্ড */}
                    <Dropdown.Item
                      id="dashboard"
                      textValue="Dashboard"
                      onPress={() => router.push(dashboardPath)}
                    >
                      <div className="flex w-full items-center justify-between gap-2 py-0.5">
                        <Label className="cursor-pointer">Dashboard</Label>
                        <LayoutDashboard size={16} className="text-gray-500" />
                      </div>
                    </Dropdown.Item>

                    {/* সেটিংস (নতুন যুক্ত করা হয়েছে) */}
                    <Dropdown.Item
                      id="settings"
                      textValue="Settings"
                      onPress={() => router.push(settingsPath)}
                    >
                      <div className="flex w-full items-center justify-between gap-2 py-0.5">
                        <Label className="cursor-pointer">Settings</Label>
                        <Settings size={16} className="text-gray-500" />
                      </div>
                    </Dropdown.Item>

                    {/* লগআউট */}
                    <Dropdown.Item
                      id="logout"
                      textValue="Logout"
                      variant="danger"
                      onPress={handleLogout}
                    >
                      <div className="flex w-full items-center justify-between gap-2 py-0.5">
                        <Label className="text-danger cursor-pointer">
                          Log Out
                        </Label>
                        <LogOut size={16} className="text-danger" />
                      </div>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown.Popover>
              </Dropdown>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-blue-600 transition"
                >
                  Login
                </Link>
                <Link
                  href="/registration"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* ================= MOBILE HAMBURGER BUTTON ================= */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-blue-600 focus:outline-none p-1"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* ================= MOBILE DROPDOWN MENU ================= */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-4 space-y-3 shadow-lg absolute w-full left-0 z-40">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className={`block px-3 py-2 rounded-md font-medium ${isActive("/") ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"}`}
          >
            Home
          </Link>
          <Link
            href="/browse-artworks"
            onClick={() => setIsOpen(false)}
            className={`block px-3 py-2 rounded-md font-medium ${isActive("/browse-artworks") ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"}`}
          >
            Browse
          </Link>

          <hr className="border-gray-100 my-2" />

          {session ? (
            <div className="space-y-3 px-3">
              <div className="flex items-center gap-3 py-2">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-base">
                  {userInitial}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {userName}
                  </p>
                  <p className="text-xs text-gray-500">{userEmail}</p>
                </div>
              </div>

              {/* মোবাইল ড্যাশবোর্ড লিংক */}
              <Link
                href={dashboardPath}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 py-2 transition text-sm font-medium"
              >
                <LayoutDashboard size={18} /> Dashboard
              </Link>

              {/* মোবাইল সেটিংস লিংক (নতুন যুক্ত করা হয়েছে) */}
              <Link
                href={settingsPath}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 py-2 transition text-sm font-medium"
              >
                <Settings size={18} /> Settings
              </Link>

              {/* মোবাইল লগআউট বাটন */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="flex w-full items-center gap-2 text-red-600 hover:text-red-700 py-2 transition text-sm font-medium"
              >
                <LogOut size={18} /> Log Out
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 pt-2 px-3">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="text-center text-gray-600 hover:text-blue-600 py-2 rounded-lg font-medium border border-gray-200"
              >
                Login
              </Link>
              <Link
                href="/registration"
                onClick={() => setIsOpen(false)}
                className="text-center bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
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
