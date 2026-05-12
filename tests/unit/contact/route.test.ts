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
import { POST } from "@/app/api/contact/route";
import { NextRequest } from "next/server";

const mockQuery = pool.query as jest.Mock;

function makeRequest(body: unknown): NextRequest {
  return new NextRequest("http://localhost:3000/api/contact", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

describe("POST /api/contact", () => {
  it("saves contact request and returns success", async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });

    const res = await POST(makeRequest({
      name: "Aram Hakobyan",
      email: "aram@example.com",
      message: "I want to enroll in the DevOps course.",
    }));

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(mockQuery).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO contact_requests"),
      ["Aram Hakobyan", "aram@example.com", "I want to enroll in the DevOps course."]
    );
  });

  it("returns 400 for invalid input", async () => {
    const res = await POST(makeRequest({ name: "X", email: "bad", message: "hi" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 when message is too short", async () => {
    const res = await POST(makeRequest({
      name: "Aram",
      email: "aram@example.com",
      message: "short",
    }));
    expect(res.status).toBe(400);
  });
});
