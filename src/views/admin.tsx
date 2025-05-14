import AdminProperties from "@/components/admin/admin-properties";
import AdminUsers from "@/components/admin/admin-users";
import { useTranslations } from "next-intl";

export default function AdminPage() {

   const t = useTranslations("admin");


  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">{t('manage_properties')}</h1>
      </div>
      <AdminProperties />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">{t('manage_users')}</h1>
      </div>
      <AdminUsers />
    </div>
  );
}
