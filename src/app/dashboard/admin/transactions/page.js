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
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Transactions</h1>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 font-semibold text-gray-700">
                Transaction ID
              </th>
              <th className="p-4 font-semibold text-gray-700">Type</th>
              <th className="p-4 font-semibold text-gray-700">User</th>
              <th className="p-4 font-semibold text-gray-700">Artist Email</th>
              <th className="p-4 font-semibold text-gray-700">Amount</th>
              <th className="p-4 font-semibold text-gray-700">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {transactions.map((txn) => (
              <tr key={txn.id} className="hover:bg-gray-50">
                <td className="p-4 text-gray-600 font-mono">{txn.id}</td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      txn.type === "Subscription"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {txn.type}
                  </span>
                </td>
                <td className="p-4 text-gray-800">{txn.user}</td>
                <td className="p-4 text-gray-600">{txn.email}</td>
                <td className="p-4 text-gray-800 font-medium">{txn.amount}</td>
                <td className="p-4 text-gray-600">{txn.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionsPage;
