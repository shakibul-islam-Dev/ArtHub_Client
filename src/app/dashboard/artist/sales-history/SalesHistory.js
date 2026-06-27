"use client";

import React from "react";

export default function SalesHistory({ sales = [] }) {
  const salesData = Array.isArray(sales) ? sales : [];

  return (
    <div className="w-full bg-card rounded-xl border border-border shadow-sm overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-muted/50 border-b border-border text-muted-foreground text-sm font-semibold">
            <th className="p-4">Artwork Title</th>
            <th className="p-4">Buyer Name / Email</th>
            <th className="p-4">Purchase Date</th>
            <th className="p-4 text-right">Amount</th>
          </tr>
        </thead>
        <tbody className="text-sm text-foreground/90 divide-y divide-border/40">
          {salesData.length > 0 ? (
            salesData.map((sale) => {
              const title =
                sale.artworkTitle ||
                sale.artworkId?.title ||
                sale.artwork?.title ||
                (sale.artworkId?.$oid
                  ? `Artwork ID: ...${sale.artworkId.$oid.slice(-6)}`
                  : "Untitled Artwork");

              const buyer =
                sale.buyerName ||
                sale.userId?.name ||
                sale.user?.name ||
                sale.userEmail ||
                "Anonymous Buyer";

              const amount = sale.amount || sale.price || 0;

              let rawDate = sale.purchaseDate || sale.createdAt;
              if (rawDate && typeof rawDate === "object" && rawDate.$date) {
                rawDate = rawDate.$date;
              }

              const rowKey =
                sale._id?.$oid ||
                sale.id ||
                sale._id ||
                Math.random().toString();

              return (
                <tr
                  key={rowKey}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="p-4 font-medium max-w-[200px] truncate">
                    {title}
                  </td>
                  <td className="p-4 text-muted-foreground">{buyer}</td>
                  <td className="p-4">
                    {rawDate
                      ? new Date(rawDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "N/A"}
                  </td>
                  <td className="p-4 text-right font-semibold text-emerald-600">
                    ${Number(amount).toFixed(2)}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="4" className="p-8 text-center text-muted-foreground">
                No sales records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
