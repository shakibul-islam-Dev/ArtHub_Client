"use client";

import React, { useState, useEffect } from "react";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ১. সব ইউজার লোড করা (UserController.getAll)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:5000";
        const res = await fetch(`${baseUrl}/api/arthub/user`, {
          cache: "no-store",
        });

        if (!res.ok) throw new Error("Failed to fetch users");

        const resData = await res.json();
        const data = resData.data || (Array.isArray(resData) ? resData : []);
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // ২. ইউজারের রোল পরিবর্তন করা (UserController.update মেথড ব্যবহার করে)
  const handleRoleChange = async (userId, newRole) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:5000";
      const res = await fetch(`${baseUrl}/api/arthub/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!res.ok) throw new Error("Failed to update role");

      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u)),
      );
    } catch (err) {
      alert(`Error updating role: ${err.message}`);
    }
  };

  // ৩. ইউজার ডিলিট করা (UserController.delete)
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user/artist?"))
      return;

    try {
      const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:5000";

      // 🔥 ফিক্সড: এন্ডপয়েন্ট 'users' থেকে পরিবর্তন করে 'user' করা হয়েছে
      const res = await fetch(`${baseUrl}/api/arthub/user/${userId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete user");

      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      alert(`Error deleting user: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-transparent text-neutral-500">
        <div className="animate-pulse font-medium">
          ইউজারদের তথ্য লোড হচ্ছে...
        </div>
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
          Manage Users & Artists
        </h1>

        <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[700px] border-collapse">
              <thead className="bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
                <tr>
                  <th className="p-4 font-semibold text-neutral-700 dark:text-neutral-300 text-sm">
                    Name
                  </th>
                  <th className="p-4 font-semibold text-neutral-700 dark:text-neutral-300 text-sm">
                    Email
                  </th>
                  <th className="p-4 font-semibold text-neutral-700 dark:text-neutral-300 text-sm">
                    Role
                  </th>
                  <th className="p-4 font-semibold text-neutral-700 dark:text-neutral-300 text-sm">
                    Change Role
                  </th>
                  <th className="p-4 font-semibold text-neutral-700 dark:text-neutral-300 text-sm">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-sm">
                {users.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="p-8 text-center text-neutral-500"
                    >
                      কোনো ইউজার পাওয়া যায়নি।
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                    >
                      <td className="p-4 text-neutral-900 dark:text-neutral-100 font-medium">
                        {user.name || "N/A"}
                      </td>
                      <td className="p-4 text-neutral-600 dark:text-neutral-400">
                        {user.email}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                            user.role === "admin"
                              ? "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
                              : user.role === "artist"
                                ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                                : "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400"
                          }`}
                        >
                          {user.role || "user"}
                        </span>
                      </td>
                      <td className="p-4">
                        <select
                          value={user.role || "user"}
                          onChange={(e) =>
                            handleRoleChange(user._id, e.target.value)
                          }
                          className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-1.5 text-sm text-neutral-700 dark:text-neutral-300 focus:outline-none cursor-pointer"
                        >
                          <option value="user">User</option>
                          <option value="artist">Artist</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
