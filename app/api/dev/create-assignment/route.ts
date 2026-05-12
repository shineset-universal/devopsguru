import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import pool from "@/lib/db";

// Dev-only: creates an assignment directly in DB for E2E test setup.
const schema = z.object({
  courseId: z.number().int().positive(),
  lessonId: z.number().int().positive().optional(),
  title: z.string().min(1),
  maxScore: z.number().int().default(100),
  published: z.boolean().default(true),
});

export async function POST(req: NextRequest): Promise<NextResponse> {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { courseId, lessonId, title, maxScore, published } = parsed.data;
  const result = await pool.query<{ id: number }>(
    `INSERT INTO assignments (course_id, lesson_id, title, max_score, published)
     VALUES ($1, $2, $3, $4, $5) RETURNING id`,
    [courseId, lessonId ?? null, title, maxScore, published]
  );

  return NextResponse.json({ id: result.rows[0].id }, { status: 201 });
}
