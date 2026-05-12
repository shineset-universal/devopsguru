import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  validateInviteCode,
  enrollStudentAtomic,
} from "@/services/enrollment/lib/invite-codes";
import {
  findStudentByEmail,
  createStudent,
} from "@/services/enrollment/lib/queries";
import {
  createMagicLink,
  sendMagicLinkEmail,
} from "@/services/auth/lib/magic-link";

const schema = z.object({
  name: z.string().min(2).max(150),
  email: z.string().email().max(255),
  phone: z.string().max(30).optional(),
  code: z.string().min(1).max(50),
});

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { name, email, phone, code } = parsed.data;

    const inviteCode = await validateInviteCode(code);
    if (!inviteCode) {
      return NextResponse.json(
        { error: "Invalid or expired invite code" },
        { status: 400 }
      );
    }

    let student = await findStudentByEmail(email);
    if (!student) {
      student = await createStudent(name, email, phone);
    }

    if (!student.is_active) {
      return NextResponse.json({ error: "Account is disabled" }, { status: 403 });
    }

    await enrollStudentAtomic(student.id, inviteCode.course_id, inviteCode.id);

    const token = await createMagicLink(email, "student");
    await sendMagicLinkEmail(email, token, "student");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[POST /api/enroll]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
