"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const UserDashboardHome = () => {
  // Mock data
  const user = {
    name: "Shakibul Islam",
    email: "shakib@example.com",
    role: "customer",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  };

  const recentTransactions = [
    {
      id: "TXN-1001",
      type: "Earned Points (Ad-to-Earn)",
      amount: "+50 pts",
      date: "2026-06-21",
    },
    {
      id: "TXN-1002",
      type: "Apparel Purchase",
      amount: "-$45.00",
      date: "2026-06-19",
    },
    {
      id: "TXN-1003",
      type: "Ad Reward",
      amount: "+15 pts",
      date: "2026-06-18",
    },
  ];

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-6 min-h-screen bg-transparent text-foreground">
      {/* Header with Role Badge */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">User Dashboard</h1>
        <span className="px-3 py-1 text-xs font-semibold tracking-wide uppercase rounded-full bg-secondary text-secondary-foreground border border-border">
          {user.role} Account
        </span>
      </div>

      {/* Main Column Stack */}
      <div className="space-y-6">
        {/* SECTION 1: Profile Block */}
        <section className="bg-card text-card-foreground p-6 rounded-2xl shadow-sm border border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="relative w-16 h-16 shrink-0">
              <Image
                src={user.avatar}
                alt={user.name}
                fill
                sizes="64px"
                className="rounded-full object-cover ring-2 ring-foreground/10 shadow-sm"
                priority
              />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-semibold truncate">{user.name}</h2>
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

        {/* SECTION 2: Recent Transactions History */}
        <section className="bg-card text-card-foreground p-6 rounded-2xl shadow-sm border border-border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-semibold">Recent History</h3>
            <Link
              href="/dashboard/transactions"
              className="text-xs font-medium opacity-70 hover:underline hover:opacity-100"
            >
              See full history
            </Link>
          </div>

          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-border text-[11px] uppercase tracking-wider opacity-60 font-semibold">
                  <th className="pb-2 px-2">ID</th>
                  <th className="pb-2 px-2">Type / Action</th>
                  <th className="pb-2 px-2">Date</th>
                  <th className="pb-2 px-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-sm">
                {recentTransactions.map((txn) => {
                  return (
                    <tr
                      key={txn.id}
                      className="hover:bg-muted/40 transition-colors"
                    >
                      <td className="py-3 px-2 font-mono text-xs opacity-60">
                        {txn.id}
                      </td>
                      <td className="py-3 px-2 font-medium">{txn.type}</td>
                      <td className="py-3 px-2 text-xs opacity-70">
                        {txn.date}
                      </td>
                      <td className="py-3 px-2 text-right font-semibold">
                        {txn.amount}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default UserDashboardHome;
