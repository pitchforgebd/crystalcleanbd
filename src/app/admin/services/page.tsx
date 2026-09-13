import { AdminServicesClient } from "@/app/admin/services/AdminServicesClient";
import { listServices } from "@/lib/repository/services";

export default async function AdminServicesPage() {
  const services = await listServices();
  return <AdminServicesClient initial={services} />;
}
