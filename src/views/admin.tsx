import AdminProperties from "@/components/admin/admin-properties";
import AdminUsers from "@/components/admin/admin-users";

export default function AdminPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">Property Management</h1>
      </div>
      <AdminProperties />
      <AdminUsers />
    </div>
  );
}
