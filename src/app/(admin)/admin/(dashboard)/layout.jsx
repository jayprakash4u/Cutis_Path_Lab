"use client";

import AdminShell from "@/components/admin/AdminShell";

/**
 * Dashboard layout — authenticated shell with sidebar navigation.
 * Session gate lives inside AdminShell.
 */
export default function AdminDashboardLayout({ children }) {
  return <AdminShell>{children}</AdminShell>;
}
