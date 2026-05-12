import {
  getMessages,
  sendMessage,
  getUnreadCountForAdmin,
} from "@/services/messages/lib/queries";

jest.mock("@/lib/db", () => ({
  __esModule: true,
  default: { query: jest.fn() },
}));

import pool from "@/lib/db";

const mockQuery = pool.query as jest.Mock;

describe("getMessages", () => {
  it("returns messages and marks instructor messages as read", async () => {
    const rows = [
      { id: 1, sender: "instructor", body: "Hello!", read_at: null },
    ];
    mockQuery
      .mockResolvedValueOnce({ rows }) // SELECT
      .mockResolvedValueOnce({ rows: [] }); // UPDATE read_at

    const result = await getMessages(1, 2);
    expect(result).toHaveLength(1);
    expect(mockQuery).toHaveBeenCalledTimes(2);
    const updateCall = mockQuery.mock.calls[1][0] as string;
    expect(updateCall).toContain("SET read_at = NOW()");
  });
});

describe("sendMessage", () => {
  it("inserts message and returns it", async () => {
    const row = { id: 5, course_id: 1, student_id: 2, sender: "student", body: "Help!" };
    mockQuery.mockResolvedValueOnce({ rows: [row] });

    const result = await sendMessage(1, 2, "student", "Help!");
    expect(result.body).toBe("Help!");
    expect(mockQuery).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO messages"),
      [1, 2, "student", "Help!"]
    );
  });
});

describe("getUnreadCountForAdmin", () => {
  it("parses and returns count as number", async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ count: "5" }] });
    const count = await getUnreadCountForAdmin();
    expect(count).toBe(5);
  });
});
