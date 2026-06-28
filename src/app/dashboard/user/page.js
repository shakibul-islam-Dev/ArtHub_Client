"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

const UserDashboardHome = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { data: session, isPending: sessionLoading } = authClient.useSession();

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (sessionLoading) return;

      if (!session?.user?.id) {
        setLoading(false);
        setError(true);
        setErrorMessage("Unauthorized: Please log in first.");
        return;
      }

      try {
        setLoading(true);
        setError(false);

        const { data: tokenData, error: tokenError } = await authClient.token();

        if (tokenError || !tokenData?.token) {
          throw new Error(
            "Failed to retrieve auth token. Please re-authenticate.",
          );
        }

        const jwtToken = tokenData.token;
        const userId = session.user.id;
        const baseUrl = process.env.NEXT_PUBLIC_URL;
        const targetUrl = `${baseUrl}/api/arthub/user/${userId}`;

        const userResponse = await fetch(targetUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        });

        if (!userResponse.ok) {
          throw new Error(`Server returned status: ${userResponse.status}`);
        }

        const resData = await userResponse.json();

        const userData = resData?.success ? resData.data : resData;

        if (userData) {
          setUser(userData);
        }
      } catch (err) {
        console.error("Dashboard error:", err);
        setError(true);
        setErrorMessage(err.message || "Failed to fetch user profile");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [session, sessionLoading]);

  // Loading State UI
  if (sessionLoading || loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-sm font-medium opacity-70">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground mb-2"></div>
        <span>Loading dashboard records...</span>
      </div>
    );
  }

  // Error State UI
  if (error || !user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-4">
        <p className="text-lg font-bold text-red-500">{errorMessage}</p>
        <p className="text-sm opacity-70 mt-1">
          Please ensure backend server is running and database is connected.
        </p>
      </div>
    );
  }

  const currentRole = user.role?.toLowerCase() || "user";

  let displayAvatar =
    user.image_url ||
    user.imageUrl ||
    user.image ||
    user.avatar ||
    session?.user?.image;
  const displayTitle = user.name || user.username || "No Name Provided";

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-6 min-h-screen bg-transparent text-foreground">
      {/* Header with Dynamic Role Badge */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">User Dashboard</h1>
        <span
          className={`px-3 py-1 text-xs font-semibold tracking-wide uppercase rounded-full border ${
            currentRole === "artist"
              ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
              : currentRole === "admin"
                ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
          }`}
        >
          {user.role || "User"} Account
        </span>
      </div>

      {/* Main Column Stack */}
      <div className="space-y-6">
        <section className="bg-card text-card-foreground p-6 rounded-2xl shadow-sm border border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div
              className={`relative w-16 h-16 shrink-0 bg-muted rounded-full overflow-hidden p-0.5 ring-2 transition-all duration-300 ${
                currentRole === "artist"
                  ? "ring-amber-500"
                  : currentRole === "admin"
                    ? "ring-blue-500"
                    : "ring-emerald-500"
              }`}
            >
              {displayAvatar ? (
                <img
                  src={displayAvatar}
                  alt={displayTitle}
                  className="w-full h-full object-cover rounded-full shadow-sm"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = "none";
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-bold text-lg uppercase bg-muted text-muted-foreground">
                  {(displayTitle || "U").charAt(0)}
                </div>
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h2 className="text-lg font-semibold truncate">
                  {displayTitle}
                </h2>
                <span
                  className={`text-[10px] text-white px-1.5 py-0.5 rounded font-bold uppercase tracking-wide ${
                    currentRole === "artist"
                      ? "bg-amber-500"
                      : currentRole === "admin"
                        ? "bg-blue-500"
                        : "bg-emerald-500"
                  }`}
                >
                  {user.role || "user"}
                </span>
              </div>
              <p className="text-sm opacity-70 truncate">
                {user.email || "No Email Provided"}
              </p>
            </div>
          </div>

          <Link
            href="/settings"
            className="w-full sm:w-auto text-center px-4 py-2 text-sm font-medium bg-secondary text-secondary-foreground hover:opacity-90 rounded-xl"
          >
            Edit Profile
          </Link>
        </section>
      </div>
    </div>
  );
};

export default UserDashboardHome;
