"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

const UserDashboardHome = () => {
  // স্টেট ম্যানেজমেন্ট
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_URL;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(false);

        const userResponse = await fetch(`${apiUrl}/api/arthub/user`);
        if (!userResponse.ok) throw new Error("Failed to fetch user profile");
        const userData = await userResponse.json();
        console.log(userData);
        setUser(userData);
      } catch (err) {
        console.error("Dashboard data fetching error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [apiUrl]);

  // লোডিং স্টেট স্ক্রিন
  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-sm font-medium opacity-70">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground mb-2"></div>
        <span>Loading dashboard records...</span>
      </div>
    );
  }

  // এরর স্টেট স্ক্রিন
  if (error || !user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-4">
        <p className="text-lg font-bold text-red-500">
          Failed to load dashboard data
        </p>
        <p className="text-sm opacity-70 mt-1">
          Please make sure backend server is running.
        </p>
      </div>
    );
  }

  // --- কারেন্ট সেশনের রোল অনুযায়ী ডাইনামিক ইমেজ ও নাম কনফিগারেশন ---
  const currentRole = user.role?.toLowerCase() || "customer";

  let displayAvatar = "";
  let displayTitle = user.name || "No Name Provided";

  if (currentRole === "artist") {
    displayAvatar = user.avatar || user.profileImage;
  } else if (currentRole === "admin") {
    displayAvatar = user.avatar || user.profileImage;
  } else {
    displayAvatar = user.avatar || user.profileImage;
  }

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-6 min-h-screen bg-transparent text-foreground">
      {/* Header with Dynamic Role Badge */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">User Dashboard</h1>
        <span
          className={`px-3 py-1 text-xs font-semibold tracking-wide uppercase rounded-full border ${
            currentRole === "artist"
              ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
              : currentRole === "buyer"
                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                : "bg-secondary text-secondary-foreground border-border"
          }`}
        >
          {user.role || "Customer"} Account
        </span>
      </div>

      {/* Main Column Stack */}
      <div className="space-y-6">
        {/* SECTION 1: Dynamic Profile Block */}
        <section className="bg-card text-card-foreground p-6 rounded-2xl shadow-sm border border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            {/* ডাইনামিক ইমেজ ফ্রেম */}
            <div
              className={`relative w-16 h-16 shrink-0 bg-muted rounded-full overflow-hidden p-0.5 ring-2 ${
                currentRole === "artist"
                  ? "ring-amber-500/40"
                  : currentRole === "buyer"
                    ? "ring-emerald-500/40"
                    : "ring-foreground/10"
              }`}
            >
              <img
                src={displayAvatar}
                alt={displayTitle}
                className="w-full h-full object-cover rounded-full shadow-sm"
                loading="lazy"
              />
            </div>

            {/* ডাইনামিক নাম ও ইমেইল */}
            <div className="min-w-0">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h2 className="text-lg font-semibold truncate">
                  {displayTitle}
                </h2>
                {currentRole === "artist" && (
                  <span className="text-[10px] bg-amber-500 text-white px-1.5 py-0.5 rounded font-bold uppercase">
                    Pro
                  </span>
                )}
              </div>
              <p className="text-sm opacity-70 truncate">{user.email}</p>
            </div>
          </div>

          <Link
            href="/dashboard/profile/edit"
            className="w-full sm:w-auto text-center px-4 py-2 text-sm font-medium bg-secondary text-secondary-foreground hover:opacity-90 rounded-xl transition-opacity duration-200"
          >
            Edit Profile
          </Link>
        </section>
      </div>
    </div>
  );
};

export default UserDashboardHome;
