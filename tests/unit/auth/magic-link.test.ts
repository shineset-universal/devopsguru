import { consumeMagicLink, createMagicLink } from "@/services/auth/lib/magic-link";

jest.mock("@/lib/db", () => ({
  __esModule: true,
  default: { query: jest.fn() },
}));

jest.mock("resend", () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: { send: jest.fn().mockResolvedValue({}) },
  })),
}));

import pool from "@/lib/db";

const mockQuery = pool.query as jest.Mock;

describe("createMagicLink", () => {
  it("inserts a magic link and returns a hex token", async () => {
    mockQuery
      .mockResolvedValueOnce({ rows: [{ value: "15" }] }) // site_settings
      .mockResolvedValueOnce({ rows: [] }); // insert

    const token = await createMagicLink("test@example.com", "student");
    expect(token).toMatch(/^[0-9a-f]{64}$/);
    expect(mockQuery).toHaveBeenCalledTimes(2);
  });
});

describe("consumeMagicLink", () => {
  it("returns null when token does not exist", async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });
    const result = await consumeMagicLink("nonexistent");
    expect(result).toBeNull();
  });

  it("returns null when link is already used", async () => {
    mockQuery.mockResolvedValueOnce({
      rows: [
        {
          id: 1,
          email: "a@b.com",
          role: "student",
          expires_at: new Date(Date.now() + 60_000),
          used: true,
        },
      ],
    });
    const result = await consumeMagicLink("used-token");
    expect(result).toBeNull();
  });

  it("returns null when link is expired", async () => {
    mockQuery.mockResolvedValueOnce({
      rows: [
        {
          id: 1,
          email: "a@b.com",
          role: "student",
          expires_at: new Date(Date.now() - 1000),
          used: false,
        },
      ],
    });
    const result = await consumeMagicLink("expired-token");
    expect(result).toBeNull();
  });

  it("marks link as used and returns payload on success", async () => {
    mockQuery
      .mockResolvedValueOnce({
        rows: [
          {
            id: 7,
            email: "a@b.com",
            role: "student",
            expires_at: new Date(Date.now() + 60_000),
            used: false,
          },
        ],
      })
      .mockResolvedValueOnce({ rows: [] }); // update

    const result = await consumeMagicLink("valid-token");
    expect(result).toEqual({ email: "a@b.com", role: "student" });
    expect(mockQuery).toHaveBeenCalledWith(
      "UPDATE magic_links SET used = true WHERE id = $1",
      [7]
    );
  });
});
