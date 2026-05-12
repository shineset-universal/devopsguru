import {
  markLessonComplete,
  getLessonProgress,
} from "@/services/courses/lib/progress";

jest.mock("@/lib/db", () => ({
  __esModule: true,
  default: { query: jest.fn() },
}));

jest.mock("@/services/certificates/lib/generator", () => ({
  checkAndIssueCertificate: jest.fn().mockResolvedValue(undefined),
}));

import pool from "@/lib/db";

const mockQuery = pool.query as jest.Mock;

describe("markLessonComplete", () => {
  it("inserts into lesson_progress with ON CONFLICT DO NOTHING", async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });
    await markLessonComplete(1, 5);
    expect(mockQuery).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO lesson_progress"),
      [1, 5]
    );
  });
});

describe("getLessonProgress", () => {
  it("returns parsed total and completed counts", async () => {
    mockQuery.mockResolvedValueOnce({
      rows: [{ total: "10", completed: "7" }],
    });
    const result = await getLessonProgress(1, 2);
    expect(result).toEqual({ total: 10, completed: 7 });
  });

  it("returns zero counts when no lessons exist", async () => {
    mockQuery.mockResolvedValueOnce({
      rows: [{ total: "0", completed: "0" }],
    });
    const result = await getLessonProgress(1, 99);
    expect(result).toEqual({ total: 0, completed: 0 });
  });
});
