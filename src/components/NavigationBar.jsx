"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavigationBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path) => pathname === path;

  return (
    <nav className="bg-white border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="font-bold text-xl">
              Art Hub
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            <Link
              href="/"
              className={`px-3 py-2 ${isActive("/") ? "text-primary font-bold" : "text-gray-600"}`}
            >
              Home
            </Link>
            <Link
              href="/browse"
              className={`px-3 py-2 ${isActive("/browse") ? "text-primary font-bold" : "text-gray-600"}`}
            >
              Browse Artworks
            </Link>

            {/* Simple Dropdown Trigger */}
            <div className="relative">
              <button className="text-gray-600 hover:text-primary px-3 py-2">
                Dashboard
              </button>
            </div>

            <Link
              href="/login"
              className="bg-primary text-white px-4 py-2 rounded-md"
            >
              Login
            </Link>
          </div>

          {/* Hamburger Menu Button */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="sm:hidden px-4 pt-2 pb-4 space-y-1">
          <Link href="/" className="block px-3 py-2 text-gray-600">
            Home
          </Link>
          <Link href="/browse" className="block px-3 py-2 text-gray-600">
            Browse Artworks
          </Link>
          <Link
            href="/login"
            className="block px-3 py-2 text-primary font-bold"
          >
            Login
          </Link>
        </div>
      )}
    </nav>
  );
};

export default NavigationBar;
