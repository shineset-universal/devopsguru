import {
  validateInviteCode,
  enrollStudentAtomic,
} from "@/services/enrollment/lib/invite-codes";

jest.mock("@/lib/db", () => ({
  __esModule: true,
  default: {
    query: jest.fn(),
    connect: jest.fn(),
  },
}));

import pool from "@/lib/db";

const mockQuery = pool.query as jest.Mock;
const mockConnect = pool.connect as jest.Mock;

describe("validateInviteCode", () => {
  it("returns null when code does not exist or is exhausted", async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });
    const result = await validateInviteCode("BADCODE");
    expect(result).toBeNull();
  });

  it("returns the invite code row when valid", async () => {
    const row = {
      id: 1,
      code: "LINUX2026",
      course_id: 1,
      max_uses: 20,
      used_count: 5,
      expires_at: new Date(Date.now() + 86_400_000),
    };
    mockQuery.mockResolvedValueOnce({ rows: [row] });
    const result = await validateInviteCode("LINUX2026");
    expect(result).toEqual(row);
  });
});

describe("enrollStudentAtomic", () => {
  it("commits enrollment and increments used_count", async () => {
    const client = {
      query: jest.fn().mockResolvedValue({ rows: [] }),
      release: jest.fn(),
    };
    mockConnect.mockResolvedValueOnce(client);

    await enrollStudentAtomic(1, 1, 1);

    const calls = client.query.mock.calls.map((c: unknown[]) => c[0]);
    expect(calls[0]).toBe("BEGIN");
    expect(calls[1]).toContain("INSERT INTO enrollments");
    expect(calls[2]).toContain("UPDATE invite_codes");
    expect(calls[3]).toBe("COMMIT");
    expect(client.release).toHaveBeenCalled();
  });

  it("rolls back and re-throws on error", async () => {
    const client = {
      query: jest
        .fn()
        .mockResolvedValueOnce({}) // BEGIN
        .mockRejectedValueOnce(new Error("DB error")), // INSERT fails
      release: jest.fn(),
    };
    mockConnect.mockResolvedValueOnce(client);

    await expect(enrollStudentAtomic(1, 1, 1)).rejects.toThrow("DB error");
    expect(client.query).toHaveBeenCalledWith("ROLLBACK");
    expect(client.release).toHaveBeenCalled();
  });
});
