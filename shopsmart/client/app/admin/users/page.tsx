"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth-context";

const MOCK_USERS = [
  { id: "1", email: "admin@shopsmart.test", fullName: "Super Admin", role: "super_admin", active: true },
  { id: "2", email: "user@example.com", fullName: "Jane Doe", role: "customer", active: true },
  { id: "3", email: "other@example.com", fullName: "John Smith", role: "customer", active: false },
];

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const filtered = MOCK_USERS.filter((u) => {
    const matchSearch =
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.fullName.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-primary">
          Users
        </h1>
        <div className="flex gap-2">
          <input
            type="search"
            placeholder="Search users…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-[var(--radius-sm)] border border-border bg-surface px-3 py-2 text-sm text-primary placeholder:text-muted-foreground focus-visible:outline focus-visible:ring-2 focus-visible:ring-accent"
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-[var(--radius-sm)] border border-border bg-surface px-3 py-2 text-sm text-primary focus-visible:outline focus-visible:ring-2 focus-visible:ring-accent"
          >
            <option value="all">All roles</option>
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
            <option value="super_admin">Super Admin</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 font-semibold text-primary">User</th>
              <th className="px-4 py-3 font-semibold text-primary">Role</th>
              <th className="px-4 py-3 font-semibold text-primary">Status</th>
              <th className="px-4 py-3 font-semibold text-primary">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">
                  <p className="font-medium text-primary">{u.fullName}</p>
                  <p className="text-xs text-muted-foreground">{u.email}</p>
                </td>
                <td className="px-4 py-3 capitalize text-muted-foreground">{u.role}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      u.active ? "bg-green-100 text-green-800" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {u.active ? "Active" : "Suspended"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button type="button" className="text-accent hover:underline">
                    View
                  </button>
                  {currentUser?.role === "super_admin" && u.role !== "super_admin" && (
                    <>
                      {" "}
                      <button type="button" className="text-accent hover:underline">
                        Assign role
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
