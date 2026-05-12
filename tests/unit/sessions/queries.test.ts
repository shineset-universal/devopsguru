import {
  getUpcomingSessions,
  getPastSessions,
} from "@/services/sessions/lib/queries";

jest.mock("@/lib/db", () => ({
  __esModule: true,
  default: { query: jest.fn() },
}));

import pool from "@/lib/db";

const mockQuery = pool.query as jest.Mock;

describe("getUpcomingSessions", () => {
  it("returns upcoming sessions for enrolled student", async () => {
    const rows = [
      {
        id: 1,
        title: "K8s Networking Deep Dive",
        scheduled_at: new Date(Date.now() + 86_400_000),
        course_title: "Kubernetes Orchestration",
      },
    ];
    mockQuery.mockResolvedValueOnce({ rows });
    const result = await getUpcomingSessions(1);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("K8s Networking Deep Dive");
  });

  it("returns empty when no upcoming sessions", async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });
    const result = await getUpcomingSessions(1);
    expect(result).toEqual([]);
  });
});

describe("getPastSessions", () => {
  it("returns past sessions ordered descending", async () => {
    const rows = [
      { id: 2, title: "Docker Intro", scheduled_at: new Date(Date.now() - 86_400_000) },
    ];
    mockQuery.mockResolvedValueOnce({ rows });
    const result = await getPastSessions(1);
    expect(result[0].title).toBe("Docker Intro");
  });
});
