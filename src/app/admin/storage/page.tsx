import { AdminStorageClient } from "@/app/admin/storage/AdminStorageClient";
import { AdminCard, AdminPageHeader } from "@/components/admin/AdminUi";
import { getCurrentAdmin } from "@/lib/auth/current";
import { GRACE_HOURS, scanStorage } from "@/server/storage-scan";

export default async function AdminStoragePage() {
  const admin = await getCurrentAdmin();

  if (admin?.role !== "owner") {
    return (
      <div>
        <AdminPageHeader title="Storage" description="Deleting files is limited to owners." />
        <AdminCard>
          <p className="text-sm text-[var(--ink-muted)]">
            Your account has the editor role. Ask an owner if files need clearing out.
          </p>
        </AdminCard>
      </div>
    );
  }

  const report = await scanStorage();
  const serialise = (files: typeof report.files) =>
    files.map((file) => ({
      url: file.url,
      size: file.size,
      modifiedAt: file.modifiedAt.toISOString(),
    }));

  return (
    <AdminStorageClient
      orphans={serialise(report.orphans)}
      recent={serialise(report.recent)}
      fileCount={report.files.length}
      totalBytes={report.totalBytes}
      orphanBytes={report.orphanBytes}
      graceHours={GRACE_HOURS}
    />
  );
}
