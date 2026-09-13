"use server";

import { requireOwner } from "@/lib/auth/current";
import { deleteUpload } from "@/lib/uploads";
import { scanStorage } from "@/server/storage-scan";

/**
 * Deletes unused uploads. The list of candidates is recomputed here rather than
 * trusted from the browser, so a stale page (or a tampered request) can never
 * delete a file that is actually in use.
 */
export async function deleteOrphanUploads(
  raw: unknown,
): Promise<{ ok: true; data: { deleted: number; freedBytes: number } } | { ok: false; error: string }> {
  const guard = await requireOwner();
  if (!guard.ok) return guard;

  const requested = Array.isArray(raw) ? raw.filter((item): item is string => typeof item === "string") : [];
  if (requested.length === 0) return { ok: false, error: "Nothing was selected." };

  const report = await scanStorage();
  const deletable = new Map(report.orphans.map((file) => [file.url, file.size]));

  let deleted = 0;
  let freedBytes = 0;
  for (const url of requested) {
    const size = deletable.get(url);
    if (size === undefined) continue; // now referenced, or inside the grace window
    if (await deleteUpload(url)) {
      deleted += 1;
      freedBytes += size;
    }
  }

  if (deleted === 0) {
    return { ok: false, error: "Nothing was deleted — those files are in use or too recent." };
  }
  return { ok: true, data: { deleted, freedBytes } };
}
