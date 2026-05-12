import { SignJWT, jwtVerify, type JWTPayload } from "jose";

export interface JWTClaims extends JWTPayload {
  sub: string;
  email: string;
  role: "student" | "admin";
  name: string;
}

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");
  return new TextEncoder().encode(secret);
}

export async function signToken(
  claims: Pick<JWTClaims, "sub" | "email" | "role" | "name">
): Promise<string> {
  return new SignJWT(claims as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifyToken(token: string): Promise<JWTClaims> {
  const { payload } = await jwtVerify(token, getSecret());
  return payload as JWTClaims;
}
