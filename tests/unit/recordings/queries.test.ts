import {
  getEnrolledRecordings,
  getRecordingVideoUrl,
} from "@/services/recordings/lib/queries";

jest.mock("@/lib/db", () => ({
  __esModule: true,
  default: { query: jest.fn() },
}));

import pool from "@/lib/db";

const mockQuery = pool.query as jest.Mock;

describe("getEnrolledRecordings", () => {
  it("returns recordings for enrolled student", async () => {
    const rows = [
      { id: 1, title: "Kubernetes Intro", course_title: "Kubernetes Orchestration" },
    ];
    mockQuery.mockResolvedValueOnce({ rows });
    const result = await getEnrolledRecordings(1);
    expect(result).toEqual(rows);
    expect(mockQuery).toHaveBeenCalledWith(
      expect.stringContaining("JOIN enrollments"),
      [1]
    );
  });

  it("returns empty array when student has no enrollments", async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });
    const result = await getEnrolledRecordings(99);
    expect(result).toEqual([]);
  });
});

describe("getRecordingVideoUrl", () => {
  it("returns video_url when student is enrolled", async () => {
    mockQuery.mockResolvedValueOnce({
      rows: [{ video_url: "https://res.cloudinary.com/test/video.mp4" }],
    });
    const url = await getRecordingVideoUrl(1, 1);
    expect(url).toBe("https://res.cloudinary.com/test/video.mp4");
  });

  it("returns null when student is not enrolled or recording not found", async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });
    const url = await getRecordingVideoUrl(1, 99);
    expect(url).toBeNull();
  });
});
