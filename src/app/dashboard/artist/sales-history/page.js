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
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* পেজ হেডিং */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Sales History</h1>
        <p className="text-sm text-slate-500">
          Track and manage your sold artworks details.
        </p>
      </div>

      {/* টেবিল কন্টেইনার (মোবাইলে স্ক্রোল করার জন্য overflow-x-auto দেওয়া হয়েছে) */}
      <div className="w-full bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse">
          {/* টেবিল হেডার (Table Head) */}
          <thead>
            <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 text-sm font-semibold">
              <th className="p-4">Artwork Title</th>
              <th className="p-4">Buyer Name</th>
              <th className="p-4">Purchase Date</th>
              <th className="p-4 text-right">Amount</th>
            </tr>
          </thead>

          {/* টেবিল বডি (Table Body) */}
          <tbody className="text-sm text-slate-600 divide-y divide-slate-100">
            {salesData.map((sale) => (
              <tr key={sale.id} className="hover:bg-slate-50 transition-colors">
                {/* আর্টওয়ার্ক টাইটেল */}
                <td className="p-4 font-medium text-slate-800">
                  {sale.artworkTitle}
                </td>
                {/* বায়ারের নাম */}
                <td className="p-4">{sale.buyerName}</td>
                {/* ক্রয়ের তারিখ */}
                <td className="p-4">{sale.purchaseDate}</td>
                {/* দাম বা অ্যামাউন্ট (ডান দিকে রাখা হয়েছে দেখতে সুন্দর লাগার জন্য) */}
                <td className="p-4 text-right font-semibold text-emerald-600">
                  {sale.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* যদি কোনো ডেটা না থাকে তার জন্য সেফটি চেক (ঐচ্ছিক) */}
        {salesData.length === 0 && (
          <div className="p-8 text-center text-slate-400">
            No sales history found.
          </div>
        )}
      </div>
    </div>
  );
}
