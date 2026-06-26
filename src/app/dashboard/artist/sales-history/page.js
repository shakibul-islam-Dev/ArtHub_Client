import React from "react";
import SalesHistory from "./SalesHistory";
import { auth } from "@/lib/auth"; // Better-Auth ইনস্ট্যান্স
import { headers } from "next/headers";

async function getSalesData(artistId) {
  const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:5000";
  try {
    // 💡 আইডি পাস করার সময় অবজেক্ট নাকি স্ট্রিং তা সেফটি চেক করে নেওয়া ভালো
    const idString =
      typeof artistId === "object" && artistId?.$oid ? artistId.$oid : artistId;

    const res = await fetch(
      `${baseUrl}/api/arthub/sales-report?artistId=${idString}`,
      {
        cache: "no-store",
      },
    );

    const result = await res.json();

    // আপনার নেক্সট-জেএস টার্মিনালে চেক করুন ব্যাকএন্ড থেকে কী অ্যারে আসছে
    console.log("=== BACKEND RAW RESPONSE IN SERVER ===", result);

    // ব্যাকএন্ড যদি সরাসরি অ্যারে পাঠায় অথবা `{ success: true, data: [...] }` ফরম্যাটে পাঠায়
    if (Array.isArray(result)) return result;
    if (result.success && Array.isArray(result.data)) return result.data;
    if (Array.isArray(result.transactions)) return result.transactions; // যদি ট্রানজেকশন কি-তে থাকে

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

  // Better-Auth থেকে ইউজার আইডি নেওয়া
  const artistId = session?.user?.id;

  console.log("=== LOGGED IN ARTIST ID ===", artistId);

  // 🛠️ ডিবাগিং ফলব্যাক: যদি সাময়িকভাবে artistId না-ও পাওয়া যায়,
  // তাও যেন আপনি UI দেখতে পারেন সেজন্য getSalesData() কল করা হচ্ছে।
  // আপনার ব্যাকএন্ডে আইডি ছাড়া রিকোয়েস্ট পাঠালে যদি সব ডাটা আসে, তবে এটি কাজ করবে।
  const sales = await getSalesData(artistId || "");

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Sales History</h1>
      <p className="text-muted-foreground mb-6">Manage your artwork sales.</p>

      {/* ক্লায়েন্ট কম্পোনেন্টে ডাটা পাস করা হলো */}
      <SalesHistory sales={sales} />
    </div>
  );
}
