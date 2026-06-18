"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, authClient } from "@/lib/auth-client";
import {
  LogOut,
  LayoutDashboard,
  Settings,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";

const NavigationBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/login";
        },
      },
    });
  };

  const isActive = (path) => pathname === path;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="font-bold text-2xl text-blue-600">
            Art Hub
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className={
                isActive("/") ? "text-blue-600 font-bold" : "text-gray-600"
              }
            >
              Home
            </Link>
            <Link
              href="/browse-artworks"
              className={
                isActive("/browse-artworks")
                  ? "text-blue-600 font-bold"
                  : "text-gray-600"
              }
            >
              Browse
            </Link>

            {session ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 border rounded-full px-3 py-1 hover:bg-gray-50"
                >
                  <img
                    src={
                      session.user.image ||
                      `https://ui-avatars.com/api/?name=${session.user.name}`
                    }
                    className="w-8 h-8 rounded-full"
                  />
                  <ChevronDown size={16} />
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-xl shadow-xl py-2">
                    <Link
                      href="/dashboard"
                      className="px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <LayoutDashboard size={16} /> Dashboard
                    </Link>
                    <Link
                      href="/settings"
                      className="px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Settings size={16} /> Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="text-gray-600">
                  Login
                </Link>
                <Link
                  href="/registration"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t p-4 space-y-4">
          <Link href="/" className="block">
            Home
          </Link>
          <Link href="/browse-artworks" className="block">
            Browse
          </Link>
          {session ? (
            <>
              <Link href="/dashboard" className="block">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="text-red-600 block">
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="block bg-blue-600 text-white text-center py-2 rounded"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default NavigationBar;
