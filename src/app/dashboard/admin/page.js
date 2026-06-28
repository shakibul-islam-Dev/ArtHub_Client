"use client";

import React, { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";

const AdminDashboardHomePage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);

        const { data: tokenData, error: tokenError } = await authClient.token();

        if (tokenError || !tokenData?.token) {
          throw new Error("Authentication token missing. Please log in again.");
        }

        const jwtToken = tokenData.token;
        const baseUrl = process.env.NEXT_PUBLIC_URL;

        const response = await fetch(`${baseUrl}/api/arthub/user`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Data Featch Failed");
        }
        const resData = await response.json();

        if (Array.isArray(resData)) {
          setUsers(resData);
        } else if (resData && Array.isArray(resData.users)) {
          setUsers(resData.users);
        } else if (resData && Array.isArray(resData.data)) {
          setUsers(resData.data);
        } else {
          throw new Error("Server  returned status: 400");
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
      const { data: tokenData, error: tokenError } = await authClient.token();

      if (tokenError || !tokenData?.token) {
        throw new Error("Action denied: Token missing.");
      }

      const jwtToken = tokenData.token;
      const baseUrl = process.env.NEXT_PUBLIC_URL;

      const response = await fetch(`${baseUrl}/api/arthub/user/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        throw new Error("ROLE UPDATE FAILED");
      }

      setUsers((prev) =>
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
    return <div className="text-center p-10 text-neutral-500">Loading...</div>;
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
                      className="px-3 py-1 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm transition-colors"
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
