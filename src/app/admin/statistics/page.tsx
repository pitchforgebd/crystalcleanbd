import { listStatistics } from "@/lib/repository/statistics";
import { AdminStatisticsClient } from "@/app/admin/statistics/AdminStatisticsClient";

export default async function AdminStatisticsPage() {
  const statistics = await listStatistics();
  return <AdminStatisticsClient initial={statistics} />;
}
