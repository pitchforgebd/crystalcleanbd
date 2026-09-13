import { listClients } from "@/lib/repository/clients";
import { AdminClientsClient } from "@/app/admin/clients/AdminClientsClient";

export default async function AdminClientsPage() {
  const clients = await listClients();
  return <AdminClientsClient initial={clients} />;
}
