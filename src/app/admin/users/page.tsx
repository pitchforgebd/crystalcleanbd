import { AdminUsersClient } from "@/app/admin/users/AdminUsersClient";
import { AdminCard, AdminPageHeader } from "@/components/admin/AdminUi";
import { getCurrentAdmin } from "@/lib/auth/current";
import { listAdminUsers } from "@/lib/repository/admin";

export default async function AdminUsersPage() {
  const admin = await getCurrentAdmin();

  // The actions enforce this too; the page just avoids showing the list.
  if (admin?.role !== "owner") {
    return (
      <div>
        <AdminPageHeader
          title="Admin Users"
          description="Managing admins is limited to owners."
        />
        <AdminCard>
          <p className="text-sm text-[var(--ink-muted)]">
            Your account has the editor role. Ask an owner if you need access here.
          </p>
        </AdminCard>
      </div>
    );
  }

  const users = await listAdminUsers();
  return <AdminUsersClient initial={users} currentId={admin.id} />;
}
