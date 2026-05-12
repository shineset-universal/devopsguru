import pool from "@/lib/db";

export interface Course {
  id: number;
  num: string;
  title: string;
  slug: string;
  description: string | null;
  level: "Beginner" | "Intermediate" | "Advanced" | "Capstone";
  weeks: string | null;
  accent_color: string;
  icon_key: string;
  is_capstone: boolean;
}

export interface Lesson {
  id: number;
  title: string;
  content: string | null;
  duration_min: number | null;
  sort_order: number;
  published: boolean;
  completed: boolean;
}

export interface CourseModule {
  id: number;
  course_id: number;
  title: string;
  sort_order: number;
  lessons: Lesson[];
}

export async function getEnrolledCourses(studentId: number): Promise<Course[]> {
  const result = await pool.query<Course>(
    `SELECT c.id, c.num, c.title, c.slug, c.description, c.level, c.weeks,
            c.accent_color, c.icon_key, c.is_capstone
     FROM courses c
     JOIN enrollments e ON e.course_id = c.id
     WHERE e.student_id = $1 AND c.is_active = true
     ORDER BY c.sort_order`,
    [studentId]
  );
  return result.rows;
}

export async function getCourseBySlug(
  slug: string,
  studentId: number
): Promise<Course | null> {
  const result = await pool.query<Course>(
    `SELECT c.id, c.num, c.title, c.slug, c.description, c.level, c.weeks,
            c.accent_color, c.icon_key, c.is_capstone
     FROM courses c
     JOIN enrollments e ON e.course_id = c.id
     WHERE c.slug = $1 AND e.student_id = $2 AND c.is_active = true`,
    [slug, studentId]
  );
  return result.rows[0] ?? null;
}

export async function getModulesWithLessons(
  courseId: number,
  studentId: number
): Promise<CourseModule[]> {
  const [modResult, lessonResult] = await Promise.all([
    pool.query<Omit<CourseModule, "lessons">>(
      "SELECT id, course_id, title, sort_order FROM modules WHERE course_id = $1 ORDER BY sort_order",
      [courseId]
    ),
    pool.query<Lesson & { module_id: number }>(
      `SELECT l.id, l.module_id, l.title, l.content, l.duration_min,
              l.sort_order, l.published,
              (lp.student_id IS NOT NULL) AS completed
       FROM lessons l
       JOIN modules m ON m.id = l.module_id
       LEFT JOIN lesson_progress lp
         ON lp.lesson_id = l.id AND lp.student_id = $2
       WHERE m.course_id = $1 AND l.published = true
       ORDER BY m.sort_order, l.sort_order`,
      [courseId, studentId]
    ),
  ]);

  const lessonsByModule = new Map<number, Lesson[]>();
  for (const lesson of lessonResult.rows) {
    const { module_id, ...rest } = lesson;
    const bucket = lessonsByModule.get(module_id) ?? [];
    bucket.push(rest);
    lessonsByModule.set(module_id, bucket);
  }

  return modResult.rows.map((mod) => ({
    ...mod,
    lessons: lessonsByModule.get(mod.id) ?? [],
  }));
}

export async function getLessonById(
  lessonId: number,
  studentId: number
): Promise<(Lesson & { video_url: string | null }) | null> {
  const result = await pool.query<
    Lesson & { video_url: string | null; course_id: number }
  >(
    `SELECT l.id, l.module_id, l.title, l.content, l.video_url, l.duration_min,
            l.sort_order, l.published,
            (lp.student_id IS NOT NULL) AS completed
     FROM lessons l
     JOIN modules m ON m.id = l.module_id
     JOIN enrollments e ON e.course_id = m.course_id AND e.student_id = $2
     LEFT JOIN lesson_progress lp
       ON lp.lesson_id = l.id AND lp.student_id = $2
     WHERE l.id = $1 AND l.published = true`,
    [lessonId, studentId]
  );
  return result.rows[0] ?? null;
}
