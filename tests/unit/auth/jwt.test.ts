import { signToken, verifyToken } from "@/services/auth/lib/jwt";

describe("jwt", () => {
  it("signs and verifies a token with correct claims", async () => {
    const claims = {
      sub: "42",
      email: "test@example.com",
      role: "student" as const,
      name: "Aram",
    };
    const token = await signToken(claims);
    expect(typeof token).toBe("string");

    const payload = await verifyToken(token);
    expect(payload.sub).toBe("42");
    expect(payload.email).toBe("test@example.com");
    expect(payload.role).toBe("student");
    expect(payload.name).toBe("Aram");
  });

  it("rejects a token signed with a different secret", async () => {
    const original = process.env.JWT_SECRET;
    process.env.JWT_SECRET = "other-secret-32-chars-minimum-ok";
    const token = await signToken({
      sub: "1",
      email: "x@x.com",
      role: "student",
      name: "X",
    });

    process.env.JWT_SECRET = original;
    await expect(verifyToken(token)).rejects.toThrow();
  });

  it("rejects a tampered token", async () => {
    const token = await signToken({
      sub: "1",
      email: "x@x.com",
      role: "student",
      name: "X",
    });
    await expect(verifyToken(token + "tampered")).rejects.toThrow();
  });
});
