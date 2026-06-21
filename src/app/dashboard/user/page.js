import React from "react";

const UserDashboardHome = () => {
  // Mock data - replace with your auth context or state management
  const user = {
    name: "Shakibul Islam",
    email: "shakib@example.com",
    role: "customer", // e.g., 'customer', 'admin'
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
    <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header with Role Badge */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          User Dashboard
        </h1>
        <span className="px-3 py-1 text-xs font-semibold tracking-wide uppercase rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-400 border border-indigo-200/30">
          {user.role} Account
        </span>
      </div>

      {/* Main Column Stack */}
      <div className="space-y-6">
        {/* SECTION 1: Profile Block */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500 shadow-sm"
            />
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {user.name}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user.email}
              </p>
            </div>
          </div>

          <a
            href="/dashboard/profile/edit"
            className="w-full sm:w-auto text-center px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-950/80 rounded-xl transition-colors duration-200"
          >
            Edit Profile
          </a>
        </section>

        {/* SECTION 2: Recent Transactions History (Positioned Directly Under Profile) */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              Recent History
            </h3>
            <a
              href="/dashboard/transactions"
              className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              See full history
            </a>
          </div>

          {/* Conditional rendering based on role if needed */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700 text-[11px] uppercase tracking-wider text-gray-400 font-semibold">
                  <th className="pb-2 px-2">ID</th>
                  <th className="pb-2 px-2">Type / Action</th>
                  <th className="pb-2 px-2">Date</th>
                  <th className="pb-2 px-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50 text-sm text-gray-700 dark:text-gray-300">
                {recentTransactions.map((txn) => (
                  <tr
                    key={txn.id}
                    className="hover:bg-gray-50/50 dark:hover:bg-gray-700/10 transition-colors"
                  >
                    <td className="py-3 px-2 font-mono text-xs text-gray-400">
                      {txn.id}
                    </td>
                    <td className="py-3 px-2 font-medium">{txn.type}</td>
                    <td className="py-3 px-2 text-xs text-gray-500">
                      {txn.date}
                    </td>
                    <td
                      className={`py-3 px-2 text-right font-semibold ${
                        txn.amount.startsWith("+")
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-gray-900 dark:text-white"
                      }`}
                    >
                      {txn.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default UserDashboardHome;
