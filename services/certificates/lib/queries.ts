import pool from "@/lib/db";

export interface Certificate {
  id: number;
  student_id: number;
  course_id: number;
  issued_at: Date;
  cert_url: string | null;
  course_title: string;
  student_name: string;
}

export async function getCertificatesForStudent(
  studentId: number
): Promise<Certificate[]> {
  const result = await pool.query<Certificate>(
    `SELECT cert.id, cert.student_id, cert.course_id, cert.issued_at,
            cert.cert_url, c.title AS course_title, s.name AS student_name
     FROM certificates cert
     JOIN courses c ON c.id = cert.course_id
     JOIN students s ON s.id = cert.student_id
     WHERE cert.student_id = $1
     ORDER BY cert.issued_at DESC`,
    [studentId]
  );
  return result.rows;
}

export async function getCertificateById(
  certificateId: number,
  studentId: number
): Promise<Certificate | null> {
  const result = await pool.query<Certificate>(
    `SELECT cert.id, cert.student_id, cert.course_id, cert.issued_at,
            cert.cert_url, c.title AS course_title, s.name AS student_name
     FROM certificates cert
     JOIN courses c ON c.id = cert.course_id
     JOIN students s ON s.id = cert.student_id
     WHERE cert.id = $1 AND cert.student_id = $2`,
    [certificateId, studentId]
  );
  return result.rows[0] ?? null;
}

export async function insertCertificate(
  studentId: number,
  courseId: number,
  certUrl: string | null
): Promise<void> {
  await pool.query(
    `INSERT INTO certificates (student_id, course_id, cert_url)
     VALUES ($1, $2, $3)
     ON CONFLICT (student_id, course_id) DO NOTHING`,
    [studentId, courseId, certUrl]
  );
}
