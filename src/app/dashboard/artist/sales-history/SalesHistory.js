"use client";

import React from "react";

// ১. বিগিনারদের বোঝার সুবিধার জন্য কিছু ডামি ডেটা (Mock Data)
const salesData = [
  {
    id: 1,
    artworkTitle: "Mystic Ocean",
    buyerName: "John Doe",
    purchaseDate: "2026-06-15",
    amount: "$120.00",
  },
  {
    id: 2,
    artworkTitle: "Neon Sunset",
    buyerName: "Rahim Ahmed",
    purchaseDate: "2026-06-12",
    amount: "$250.00",
  },
  {
    id: 3,
    artworkTitle: "Vintage Forest",
    buyerName: "Sarah Smith",
    purchaseDate: "2026-06-10",
    amount: "$95.00",
  },
  {
    id: 4,
    artworkTitle: "Abstract Thoughts",
    buyerName: "Karim Ali",
    purchaseDate: "2026-05-28",
    amount: "$410.00",
  },
];

export default function SalesHistory() {
  return (
    <div className="p-6 bg-background min-h-screen text-foreground transition-colors">
      {/* পেজ হেডিং */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Sales History</h1>
        <p className="text-sm text-muted-foreground">
          Track and manage your sold artworks details.
        </p>
      </div>

      {/* টেবিল কন্টেইনার */}
      <div className="w-full bg-card text-card-foreground rounded-xl border border-border shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse">
          {/* টেবিল হেডার (Table Head) */}
          <thead>
            <tr className="bg-muted/50 border-b border-border text-muted-foreground text-sm font-semibold">
              <th className="p-4">Artwork Title</th>
              <th className="p-4">Buyer Name</th>
              <th className="p-4">Purchase Date</th>
              <th className="p-4 text-right">Amount</th>
            </tr>
          </thead>

          {/* টেবিল বডি (Table Body) */}
          <tbody className="text-sm text-foreground/90 divide-y divide-border/40">
            {salesData.map((sale) => (
              <tr key={sale.id} className="hover:bg-muted/30 transition-colors">
                {/* আর্টওয়ার্ক টাইটেল */}
                <td className="p-4 font-medium text-foreground">
                  {sale.artworkTitle}
                </td>
                {/* বায়ারের নাম */}
                <td className="p-4 text-muted-foreground">{sale.buyerName}</td>
                {/* ক্রয়ের তারিখ */}
                <td className="p-4 text-muted-foreground">
                  {sale.purchaseDate}
                </td>
                {/* দাম বা অ্যামাউন্ট */}
                <td className="p-4 text-right font-semibold text-emerald-600 dark:text-emerald-400">
                  {sale.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* যদি কোনো ডেটা না থাকে তার জন্য সেফটি চেক */}
        {salesData.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            No sales history found.
          </div>
        )}
      </div>
    </div>
  );
}
