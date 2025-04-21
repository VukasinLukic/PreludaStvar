import AdminDashboard from "@/components/admin/AdminDashboard";

export default function AdminPage() {
  // The AdminAuthLayout handles the auth check.
  // This page only renders if the user is authenticated.
  return <AdminDashboard />;
} 