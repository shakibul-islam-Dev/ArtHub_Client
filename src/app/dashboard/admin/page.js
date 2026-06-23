"use client";

import React, { useState } from "react";

const AdminDashboardHomePage = () => {
  const [users, setUsers] = useState([
    { id: 1, name: "Rahim Ahmed", email: "rahim@example.com", role: "admin" },
    { id: 2, name: "Karim Ullah", email: "karim@example.com", role: "artist" },
    { id: 3, name: "Sumon Das", email: "sumon@example.com", role: "user" },
  ]);

  const [newUser, setNewUser] = useState({ name: "", email: "", role: "user" });

  const handleAddUser = (e) => {
    e.preventDefault();
    if (newUser.name && newUser.email) {
      setUsers([...users, { ...newUser, id: Date.now() }]);
      setNewUser({ name: "", email: "", role: "user" });
    }
  };

  const handleRoleChange = (userId, newRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)),
    );
  };

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

      {/* Create User Form */}
      <form
        onSubmit={handleAddUser}
        className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm"
      >
        <h3 className="text-lg font-semibold mb-4 text-neutral-900 dark:text-neutral-100">
          Create New User
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            placeholder="Name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:ring-2 focus:ring-neutral-500 transition-all"
          />
          <input
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:ring-2 focus:ring-neutral-500 transition-all"
          />
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl"
          >
            <option value="user">User</option>
            <option value="artist">Artist</option>
            <option value="admin">Admin</option>
          </select>
          <button
            type="submit"
            className="px-4 py-2 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-xl font-medium hover:opacity-90 transition-opacity"
          >
            Add User
          </button>
        </div>
      </form>

      {/* User Table */}
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
            {users.map((user) => (
              <tr
                key={user.id}
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
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
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
