import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import pool from "@/lib/db";

const resend = new Resend(process.env.RESEND_API_KEY);

const schema = z.object({
  name: z.string().min(2).max(150),
  email: z.string().email().max(255),
  message: z.string().min(10).max(5000),
});

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { name, email, message } = parsed.data;

    await pool.query(
      "INSERT INTO contact_requests (name, email, message) VALUES ($1, $2, $3)",
      [name, email, message]
    );

    const adminEmail = process.env.ADMIN_EMAIL ?? "sarmen@devopsguru.am";
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? "noreply@devopsguru.am",
      to: adminEmail,
      subject: `New contact request from ${name}`,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[POST /api/contact]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
