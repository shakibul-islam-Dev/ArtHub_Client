"use client";
import React, { useState } from "react";

const initialUsers = [
  { id: 1, name: "Rahim Ahmed", email: "rahim@example.com", role: "admin" },
  { id: 2, name: "Karim Ullah", email: "karim@example.com", role: "artist" },
  { id: 3, name: "Sumon Das", email: "sumon@example.com", role: "user" },
];

const UsersPage = () => {
  const [users, setUsers] = useState(initialUsers);

  const handleRoleChange = (userId, newRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)),
    );
  };

  return (
    <div className="p-6 bg-neutral-50 dark:bg-neutral-950 min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-neutral-900 dark:text-neutral-50">
          Manage Users
        </h1>

        <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
              <tr>
                <th className="p-4 font-semibold text-neutral-700 dark:text-neutral-300">
                  Name
                </th>
                <th className="p-4 font-semibold text-neutral-700 dark:text-neutral-300">
                  Email
                </th>
                <th className="p-4 font-semibold text-neutral-700 dark:text-neutral-300">
                  Role
                </th>
                <th className="p-4 font-semibold text-neutral-700 dark:text-neutral-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                >
                  <td className="p-4 text-neutral-900 dark:text-neutral-100 font-medium">
                    {user.name}
                  </td>
                  <td className="p-4 text-neutral-600 dark:text-neutral-400">
                    {user.email}
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 capitalize">
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(user.id, e.target.value)
                      }
                      className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-1.5 text-sm text-neutral-700 dark:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-400"
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
    </div>
  );
};

export default UsersPage;
