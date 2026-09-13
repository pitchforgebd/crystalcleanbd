import { notFound } from "next/navigation";
import { AdminAccountClient } from "@/app/admin/account/AdminAccountClient";
import { getCurrentAdmin } from "@/lib/auth/current";

export default async function AdminAccountPage() {
  const account = await getCurrentAdmin();
  if (!account) notFound();
  return (
    <AdminAccountClient
      initial={{
        name: account.name,
        email: account.email,
        role: account.role,
      }}
    />
  );
}
