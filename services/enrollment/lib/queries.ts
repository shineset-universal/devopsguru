import pool from "@/lib/db";

export interface Student {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  is_active: boolean;
  created_at: Date;
}

export async function findStudentByEmail(
  email: string
): Promise<Student | null> {
  const result = await pool.query<Student>(
    "SELECT id, name, email, phone, is_active, created_at FROM students WHERE email = $1",
    [email]
  );
  return result.rows[0] ?? null;
}

export async function createStudent(
  name: string,
  email: string,
  phone?: string
): Promise<Student> {
  const result = await pool.query<Student>(
    "INSERT INTO students (name, email, phone) VALUES ($1, $2, $3) RETURNING id, name, email, phone, is_active, created_at",
    [name, email, phone ?? null]
  );
  return result.rows[0];
}
