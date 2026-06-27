"use client";

import React, { useState, useEffect } from "react";

const AdminDashboardHomePage = () => {
  // নিশ্চিত করুন শুরুতে এটি একটি খালি অ্যারে []
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/arthub/user");
        if (!response.ok) {
          throw new Error("ডেটা লোড করতে সমস্যা হয়েছে!");
        }
        const resData = await response.json();

        // ১. যদি ব্যাকএন্ড সরাসরি ইউজারদের অ্যারে পাঠায় [{}, {}, {}]
        if (Array.isArray(resData)) {
          setUsers(resData);
        }
        // ২. যদি ব্যাকএন্ড কোনো অবজেক্টের ভেতর অ্যারে পাঠায় (যেমন: { users: [...] } বা { data: [...] })
        else if (resData && Array.isArray(resData.users)) {
          setUsers(resData.users);
        } else if (resData && Array.isArray(resData.data)) {
          setUsers(resData.data);
        }
        // ৩. কোনোটিই না মিললে এরর হ্যান্ডেল করা
        else {
          throw new Error("ব্যাকএন্ড থেকে সঠিক অ্যারে ডেটা পাওয়া যায়নি।");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/arthub/user/${userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: newRole }),
        },
      );

      if (!response.ok) {
        throw new Error("রোল আপডেট করা যায়নি");
      }

      setUsers((prev) =>
        // এখানে সেফটি চেক রাখা হয়েছে যেন prev কোনো কারণে অ্যারে না হলেও ক্র্যাশ না করে
        Array.isArray(prev)
          ? prev.map((u) =>
              u.id === userId || u._id === userId ? { ...u, role: newRole } : u,
            )
          : [],
      );
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading)
    return (
      <div className="text-center p-10 text-neutral-500">লোড হচ্ছে...</div>
    );
  if (error)
    return <div className="text-center p-10 text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">
          Admin Home Panel
        </h1>
        <p className="text-neutral-500 mt-1">
          Manage platform users and their roles.
        </p>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950">
              <th className="p-4 font-semibold text-neutral-600 dark:text-neutral-400">
                Name
              </th>
              <th className="p-4 font-semibold text-neutral-600 dark:text-neutral-400">
                Email
              </th>
              <th className="p-4 font-semibold text-neutral-600 dark:text-neutral-400">
                Role
              </th>
              <th className="p-4 font-semibold text-neutral-600 dark:text-neutral-400">
                Change Role
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {/* এখানে একটি সেফগার্ড ট্রিক (users && Array.isArray(users)) ব্যবহার করা হয়েছে */}
            {Array.isArray(users) &&
              users.map((user) => (
                <tr
                  key={user.id || user._id}
                  className="hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors"
                >
                  <td className="p-4 text-neutral-900 dark:text-neutral-100">
                    {user.name}
                  </td>
                  <td className="p-4 text-neutral-500">{user.email}</td>
                  <td className="p-4 capitalize">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(user.id || user._id, e.target.value)
                      }
                      className="px-3 py-1 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm"
                    >
                      <option value="user">User</option>
                      <option value="artist">Artist</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboardHomePage;
