import React from "react";
import SalesHistory from "./SalesHistory";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

async function getSalesData(artistId) {
  const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:5000";
  try {
    const idString =
      typeof artistId === "object" && artistId?.$oid ? artistId.$oid : artistId;

    const res = await fetch(
      `${baseUrl}/api/arthub/sales-report?artistId=${idString}`,
      {
        cache: "no-store",
      },
    );

    const result = await res.json();

    if (Array.isArray(result)) return result;
    if (result.success && Array.isArray(result.data)) return result.data;
    if (Array.isArray(result.transactions)) return result.transactions;

    return [];
  } catch (error) {
    console.error("Fetch error in Server Component:", error);
    return [];
  }
}

export default async function SalesHistoryPage() {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({
    headers: reqHeaders,
  });

  const artistId = session?.user?.id;

  const sales = await getSalesData(artistId || "");

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Sales History</h1>
      <p className="text-muted-foreground mb-6">Manage your artwork sales.</p>

      <SalesHistory sales={sales} />
    </div>
  );
}
