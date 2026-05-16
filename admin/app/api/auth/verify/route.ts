import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ error: "Magic link auth has been removed" }, { status: 410 });
}
