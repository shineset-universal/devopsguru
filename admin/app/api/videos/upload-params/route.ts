export const dynamic = "force-dynamic";

/**
 * Returns Cloudinary unsigned upload parameters for direct-from-browser uploads.
 * Requires admin session — prevents unauthenticated uploads to the Cloudinary account.
 */

import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const session = await getAdminSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const cloudName    = process.env.CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    return NextResponse.json({ error: "Cloudinary is not configured" }, { status: 503 });
  }

  return NextResponse.json({ cloudName, uploadPreset });
}
