import { randomBytes } from "node:crypto";
import { mkdir, readdir, stat, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Uploaded media handling.
 *
 * Files live OUTSIDE `public/`: Next builds the list of public assets at build
 * time, so anything written there at runtime is served as 404. They are stored
 * in `UPLOAD_DIR` (default `./uploads`) and streamed back by the
 * `/uploads/[...path]` route handler, which also keeps the folder safe to keep
 * across redeployments.
 */

/** Absolute path of the upload root. */
export function uploadsRoot(): string {
  const configured = process.env.UPLOAD_DIR?.trim();
  return configured ? path.resolve(configured) : path.join(process.cwd(), "uploads");
}

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB

/**
 * Allowed types, keyed by the extension we write. SVG is deliberately excluded:
 * it can carry script and would be served from our own origin.
 */
const ALLOWED = [
  { ext: "jpg", mime: "image/jpeg", magic: [0xff, 0xd8, 0xff] },
  { ext: "png", mime: "image/png", magic: [0x89, 0x50, 0x4e, 0x47] },
  { ext: "gif", mime: "image/gif", magic: [0x47, 0x49, 0x46, 0x38] },
  { ext: "webp", mime: "image/webp", magic: [0x52, 0x49, 0x46, 0x46] }, // "RIFF"
] as const;

export const ACCEPT_ATTRIBUTE = "image/jpeg,image/png,image/gif,image/webp";

export type UploadResult =
  | { ok: true; url: string; name: string; size: number }
  | { ok: false; error: string };

const startsWith = (bytes: Uint8Array, magic: readonly number[]) =>
  magic.every((byte, index) => bytes[index] === byte);

/** Trust the file's own bytes, not the browser-supplied content type. */
function detect(bytes: Uint8Array) {
  const match = ALLOWED.find((type) => startsWith(bytes, type.magic));
  if (!match) return null;
  // WEBP shares the RIFF header with other formats — check the sub-type too.
  if (match.ext === "webp") {
    const tag = String.fromCharCode(bytes[8], bytes[9], bytes[10], bytes[11]);
    if (tag !== "WEBP") return null;
  }
  return match;
}

export function humanSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Keep a readable trace of the original name without trusting it as a path. */
function safeStem(originalName: string): string {
  const base = path.basename(originalName).replace(/\.[^.]+$/, "");
  const slug = base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return slug || "image";
}

export async function saveUpload(file: File): Promise<UploadResult> {
  if (file.size === 0) return { ok: false, error: "The file is empty." };
  if (file.size > MAX_UPLOAD_BYTES) {
    return {
      ok: false,
      error: `File is ${humanSize(file.size)} — the limit is ${humanSize(MAX_UPLOAD_BYTES)}.`,
    };
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const type = detect(bytes);
  if (!type) {
    return { ok: false, error: "Only JPG, PNG, GIF and WEBP images are allowed." };
  }

  const now = new Date();
  const folder = path.join(
    uploadsRoot(),
    String(now.getFullYear()),
    String(now.getMonth() + 1).padStart(2, "0"),
  );
  const filename = `${safeStem(file.name)}-${randomBytes(6).toString("hex")}.${type.ext}`;

  try {
    await mkdir(folder, { recursive: true });
    await writeFile(path.join(folder, filename), bytes);
  } catch (error) {
    console.error("[saveUpload]", error);
    return { ok: false, error: "Could not store the file on the server." };
  }

  const url = `/uploads/${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}/${filename}`;
  return { ok: true, url, name: file.name, size: file.size };
}

export type StoredFile = {
  /** Public URL, e.g. /uploads/2026/09/photo-ab12cd.png */
  url: string;
  size: number;
  modifiedAt: Date;
};

/** Every file currently sitting in the upload folder. */
export async function listUploadedFiles(): Promise<StoredFile[]> {
  const root = uploadsRoot();
  const found: StoredFile[] = [];

  async function walk(dir: string) {
    let entries;
    try {
      entries = await readdir(dir, { withFileTypes: true });
    } catch {
      return; // folder does not exist yet
    }
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(full);
        continue;
      }
      if (entry.name.startsWith(".")) continue;
      const info = await stat(full);
      const relative = path.relative(root, full).split(path.sep).join("/");
      found.push({ url: `/uploads/${relative}`, size: info.size, modifiedAt: info.mtime });
    }
  }

  await walk(root);
  return found;
}

/** Deletes one uploaded file. Refuses anything outside the upload root. */
export async function deleteUpload(url: string): Promise<boolean> {
  if (!url.startsWith("/uploads/")) return false;
  const root = uploadsRoot();
  const target = path.resolve(root, url.slice("/uploads/".length));
  if (!target.startsWith(root + path.sep)) return false;

  try {
    await unlink(target);
    return true;
  } catch (error) {
    console.error("[deleteUpload]", error);
    return false;
  }
}
