import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer";
import pool from "@/lib/db";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#050810",
    padding: 60,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 10,
    color: "#7a8aaa",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 12,
  },
  name: {
    fontSize: 32,
    color: "#e8edf8",
    marginBottom: 8,
    textAlign: "center",
  },
  course: {
    fontSize: 18,
    color: "#00d4ff",
    marginBottom: 40,
    textAlign: "center",
  },
  issued: {
    fontSize: 10,
    color: "#7a8aaa",
  },
  divider: {
    width: 80,
    height: 2,
    backgroundColor: "#00d4ff",
    marginVertical: 24,
  },
});

export async function generateCertificatePdf(
  studentId: number,
  courseId: number
): Promise<Buffer> {
  const result = await pool.query<{ student_name: string; course_title: string }>(
    `SELECT s.name AS student_name, c.title AS course_title
     FROM students s, courses c
     WHERE s.id = $1 AND c.id = $2`,
    [studentId, courseId]
  );

  const { student_name, course_title } = result.rows[0];

  const doc = React.createElement(
    Document,
    null,
    React.createElement(
      Page,
      { size: "A4", orientation: "landscape", style: styles.page },
      React.createElement(Text, { style: styles.label }, "Certificate of Completion"),
      React.createElement(View, { style: styles.divider }),
      React.createElement(Text, { style: styles.label }, "This certifies that"),
      React.createElement(Text, { style: styles.name }, student_name),
      React.createElement(
        Text,
        { style: styles.label },
        "has successfully completed"
      ),
      React.createElement(Text, { style: styles.course }, course_title),
      React.createElement(
        Text,
        { style: styles.issued },
        `Issued ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`
      )
    )
  );

  return renderToBuffer(doc);
}
