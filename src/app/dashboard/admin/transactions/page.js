"use client";
import React from "react";

const transactions = [
  {
    id: "TXN-001",
    type: "Subscription",
    user: "Rahim Ahmed",
    email: "rahim@example.com",
    amount: "$20.00",
    date: "2026-06-21",
  },
  {
    id: "TXN-002",
    type: "Purchase",
    user: "Karim Ullah",
    email: "karim@example.com",
    amount: "$150.00",
    date: "2026-06-20",
  },
  {
    id: "TXN-003",
    type: "Purchase",
    user: "Sumon Das",
    email: "sumon@example.com",
    amount: "$75.00",
    date: "2026-06-19",
  },
];

const TransactionsPage = () => {
  return (
    <div className="p-6 bg-neutral-50 dark:bg-neutral-950 min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-neutral-900 dark:text-neutral-50">
          Transactions
        </h1>

        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
              <tr>
                <th className="p-4 font-semibold text-neutral-700 dark:text-neutral-300">
                  Transaction ID
                </th>
                <th className="p-4 font-semibold text-neutral-700 dark:text-neutral-300">
                  Type
                </th>
                <th className="p-4 font-semibold text-neutral-700 dark:text-neutral-300">
                  User
                </th>
                <th className="p-4 font-semibold text-neutral-700 dark:text-neutral-300">
                  Artist Email
                </th>
                <th className="p-4 font-semibold text-neutral-700 dark:text-neutral-300">
                  Amount
                </th>
                <th className="p-4 font-semibold text-neutral-700 dark:text-neutral-300">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {transactions.map((txn) => (
                <tr
                  key={txn.id}
                  className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                >
                  <td className="p-4 text-neutral-600 dark:text-neutral-400 font-mono text-sm">
                    {txn.id}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        txn.type === "Subscription"
                          ? "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400"
                          : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                      }`}
                    >
                      {txn.type}
                    </span>
                  </td>
                  <td className="p-4 text-neutral-900 dark:text-neutral-100">
                    {txn.user}
                  </td>
                  <td className="p-4 text-neutral-600 dark:text-neutral-400">
                    {txn.email}
                  </td>
                  <td className="p-4 text-neutral-900 dark:text-neutral-50 font-medium">
                    {txn.amount}
                  </td>
                  <td className="p-4 text-neutral-600 dark:text-neutral-400">
                    {txn.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;
