import { listAllClients } from "@/lib/repository/clients";
import { AdminClientsClient } from "@/app/admin/clients/AdminClientsClient";

export default async function AdminClientsPage() {
  const clients = await listAllClients();
  return <AdminClientsClient initial={clients} />;
}
