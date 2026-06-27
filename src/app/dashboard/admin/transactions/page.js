"use client";

import React, { useState, useEffect } from "react";

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ব্যাকএন্ড থেকে ট্রানজেকশন ডেটা লোড করা
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/arthub/transactions",
        );
        if (!res.ok) throw new Error("Failed to fetch transactions");

        const resData = await res.json();
        // রেসপন্স অবজেক্ট বা অ্যারে হ্যান্ডলিং সেফটি ফিল্টার
        const data = Array.isArray(resData) ? resData : resData.data || [];
        setTransactions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-transparent text-neutral-500">
        <div className="animate-pulse">লেনদেনের তথ্য লোড হচ্ছে...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-transparent text-red-500 font-semibold">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="p-6 bg-neutral-50 dark:bg-neutral-950 min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-neutral-900 dark:text-neutral-50">
          Transactions Overview
        </h1>

        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[800px]">
              <thead className="bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
                <tr>
                  <th className="p-4 font-semibold text-neutral-700 dark:text-neutral-300 text-sm">
                    Transaction ID
                  </th>
                  <th className="p-4 font-semibold text-neutral-700 dark:text-neutral-300 text-sm">
                    Artwork Title
                  </th>
                  <th className="p-4 font-semibold text-neutral-700 dark:text-neutral-300 text-sm">
                    Buyer (Customer)
                  </th>
                  <th className="p-4 font-semibold text-neutral-700 dark:text-neutral-300 text-sm">
                    Artist Email
                  </th>
                  <th className="p-4 font-semibold text-neutral-700 dark:text-neutral-300 text-sm">
                    Amount
                  </th>
                  <th className="p-4 font-semibold text-neutral-700 dark:text-neutral-300 text-sm">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-sm">
                {transactions.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="p-8 text-center text-neutral-500"
                    >
                      এখনো কোনো লেনদেন সম্পন্ন হয়নি।
                    </td>
                  </tr>
                ) : (
                  transactions.map((txn) => {
                    // ডেট ফরম্যাটিং সেফটি লজিক
                    const txnDate = txn.createdAt || txn.date;
                    const formattedDate = txnDate
                      ? new Date(txnDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "N/A";

                    // ==========================================
                    // পুরনো ডেটার জন্য সেফটি অ্যান্ড ডায়নামিক ফলব্যাক ফিল্টার
                    // ==========================================

                    // ১. আর্টওয়ার্কের নাম টাইটেল থেকে অথবা অবজেক্ট পপুলেশন থাকলে সেখান থেকে আনা
                    const displayTitle =
                      txn.artwork_title ||
                      txn.title ||
                      (txn.artworkId && txn.artworkId.title) ||
                      "Exclusive Artwork";

                    // ২. বায়ারের ইমেইল আইডি জেনারেট করা (পুরনো ডেটাতে এটি userEmail হিসেবে আছে)
                    const displayBuyerEmail =
                      txn.buyer_email || txn.userEmail || "No Email";

                    // ৩. বায়ারের নাম (ইমেইলের প্রথম অংশ কেটে সুন্দর নাম জেনারেট করা যদি buyer_name না থাকে)
                    const defaultName =
                      displayBuyerEmail !== "No Email"
                        ? displayBuyerEmail
                            .split("@")[0]
                            .charAt(0)
                            .toUpperCase() +
                          displayBuyerEmail.split("@")[0].slice(1)
                        : "Guest User";
                    const displayBuyerName =
                      txn.buyer_name || txn.user || defaultName;

                    // ৪. আর্টিস্টের ইমেইল (অবজেক্ট পপুলেশন থেকে খোঁজা, না পেলে বায়ারের ইমেইলের সাথে কনফ্লিক্ট এড়াতে সেফটি দেওয়া)
                    const displayArtistEmail =
                      txn.artist_email ||
                      txn.email ||
                      (txn.artworkId && txn.artworkId.artist_email) ||
                      "artisan.hub@studio.com";

                    return (
                      <tr
                        key={txn._id || txn.id}
                        className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors"
                      >
                        {/* ১. ট্রানজেকশন আইডি */}
                        <td className="p-4 text-neutral-500 dark:text-neutral-400 font-mono text-xs">
                          {txn._id || txn.id}
                        </td>

                        {/* ২. আর্টওয়ার্কের নাম */}
                        <td className="p-4 text-neutral-900 dark:text-neutral-100 font-medium">
                          {displayTitle}
                        </td>

                        {/* ৩. ক্রেতার নাম ও ইমেইল */}
                        <td className="p-4">
                          <div className="text-neutral-900 dark:text-neutral-100 font-medium">
                            {displayBuyerName}
                          </div>
                          <div className="text-xs text-neutral-400 dark:text-neutral-500">
                            {displayBuyerEmail}
                          </div>
                        </td>

                        {/* ৪. আর্টিস্টের ইমেইল */}
                        <td className="p-4 text-neutral-600 dark:text-neutral-400">
                          {displayArtistEmail}
                        </td>

                        {/* ৫. টাকার পরিমাণ */}
                        <td className="p-4 text-neutral-900 dark:text-neutral-50 font-semibold">
                          $
                          {Number(
                            txn.amount || txn.price || 0,
                          ).toLocaleString()}
                        </td>

                        {/* ৬. তারিখ */}
                        <td className="p-4 text-neutral-600 dark:text-neutral-400">
                          {formattedDate}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;
