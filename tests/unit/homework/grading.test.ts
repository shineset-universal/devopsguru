import { submitHomework } from "@/services/homework/lib/queries";
import { gradeSubmission } from "@/services/homework/lib/grading";

jest.mock("@/lib/db", () => ({
  __esModule: true,
  default: { query: jest.fn() },
}));

jest.mock("@/services/certificates/lib/generator", () => ({
  checkAndIssueCertificate: jest.fn().mockResolvedValue(undefined),
}));

import pool from "@/lib/db";
import { checkAndIssueCertificate } from "@/services/certificates/lib/generator";

const mockQuery = pool.query as jest.Mock;

describe("submitHomework", () => {
  it("upserts submission when not yet graded", async () => {
    mockQuery
      .mockResolvedValueOnce({ rows: [{ graded_at: null }] }) // check graded_at
      .mockResolvedValueOnce({
        rows: [{ id: 1, assignment_id: 2, student_id: 3, content: "my answer" }],
      }); // upsert

    const result = await submitHomework(2, 3, "my answer");
    expect(result.content).toBe("my answer");
  });

  it("throws ALREADY_GRADED when graded_at is set", async () => {
    mockQuery.mockResolvedValueOnce({
      rows: [{ graded_at: new Date() }],
    });
    await expect(submitHomework(2, 3, "late answer")).rejects.toThrow(
      "ALREADY_GRADED"
    );
  });

  it("allows first-time submission (no prior submission row)", async () => {
    mockQuery
      .mockResolvedValueOnce({ rows: [] }) // no existing submission
      .mockResolvedValueOnce({ rows: [{ id: 5, content: "fresh" }] });

    const result = await submitHomework(10, 1, "fresh");
    expect(result.id).toBe(5);
  });
});

describe("gradeSubmission", () => {
  it("updates grade and triggers certificate check", async () => {
    mockQuery
      .mockResolvedValueOnce({
        rows: [{ assignment_id: 2, student_id: 3 }],
      }) // UPDATE submissions
      .mockResolvedValueOnce({ rows: [{ course_id: 1 }] }); // SELECT course_id

    await gradeSubmission(7, 85, "Good work!");
    expect(checkAndIssueCertificate).toHaveBeenCalledWith(3, 1);
  });

  it("does nothing when submission id does not exist", async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });
    await gradeSubmission(999, 80, "");
    expect(checkAndIssueCertificate).not.toHaveBeenCalled();
  });
});
