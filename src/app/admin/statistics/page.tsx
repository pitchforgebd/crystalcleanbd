import { listAllStatistics } from "@/lib/repository/statistics";
import { AdminStatisticsClient } from "@/app/admin/statistics/AdminStatisticsClient";

export default async function AdminStatisticsPage() {
  const statistics = await listAllStatistics();
  return <AdminStatisticsClient initial={statistics} />;
}
