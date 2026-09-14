import { AdminServicesClient } from "@/app/admin/services/AdminServicesClient";
import { listAllServices } from "@/lib/repository/services";

export default async function AdminServicesPage() {
  const services = await listAllServices();
  return <AdminServicesClient initial={services} />;
}
