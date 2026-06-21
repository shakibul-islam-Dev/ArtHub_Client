"use client";
import React, { useState } from "react";

const AdminDashboardHomePage = () => {
  // Mock Data
  const [users, setUsers] = useState([
    { id: 1, name: "Rahim Ahmed", email: "rahim@example.com", role: "admin" },
    { id: 2, name: "Karim Ullah", email: "karim@example.com", role: "artist" },
    { id: 3, name: "Sumon Das", email: "sumon@example.com", role: "user" },
  ]);

  const [newUser, setNewUser] = useState({ name: "", email: "", role: "user" });

  // Add new user
  const handleAddUser = (e) => {
    e.preventDefault();
    if (newUser.name && newUser.email) {
      setUsers([...users, { ...newUser, id: Date.now() }]);
      setNewUser({ name: "", email: "", role: "user" });
    }
  };

  // Update role
  const handleRoleChange = (userId, newRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)),
    );
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Home Panel</h1>

      {/* Create User Form */}
      <form
        onSubmit={handleAddUser}
        style={{
          marginBottom: "20px",
          padding: "15px",
          border: "1px solid #ccc",
        }}
      >
        <h3>Create New User</h3>
        <input
          placeholder="Name"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
        />
        <input
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />
        <select
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
        >
          <option value="user">User</option>
          <option value="artist">Artist</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Add User</button>
      </form>

      {/* User Table */}
      <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
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
  );
};

export default AdminDashboardHomePage;
