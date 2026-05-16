import { NextResponse } from "next/server";

export async function POST(): Promise<NextResponse> {
  return NextResponse.json({ error: "Magic link auth has been removed" }, { status: 410 });
}
