import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/current";
import { MAX_UPLOAD_BYTES, humanSize, saveUpload } from "@/lib/uploads";

/**
 * Admin media upload. A route handler rather than a Server Action because
 * actions cap the request body at a size that photos routinely exceed.
 */
export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: 401 });
  }

  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > MAX_UPLOAD_BYTES * 1.1) {
    return NextResponse.json(
      { ok: false, error: `The limit is ${humanSize(MAX_UPLOAD_BYTES)} per file.` },
      { status: 413 },
    );
  }

  let file: File | null = null;
  try {
    const form = await request.formData();
    const value = form.get("file");
    if (value instanceof File) file = value;
  } catch (error) {
    console.error("[upload] malformed body", error);
    return NextResponse.json({ ok: false, error: "Malformed upload." }, { status: 400 });
  }

  if (!file) {
    return NextResponse.json({ ok: false, error: "No file was received." }, { status: 400 });
  }

  const result = await saveUpload(file);
  return NextResponse.json(result, { status: result.ok ? 201 : 400 });
}
