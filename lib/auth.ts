import { SignJWT, jwtVerify } from "jose";

export type Role = "user" | "admin";

const SESSION_SECRET = process.env.SESSION_SECRET || "dev-secret-change-in-production";
const secret = new TextEncoder().encode(SESSION_SECRET);

const COOKIE_MAX_AGE = 604800; // 7 days

export async function createSessionToken(role: Role): Promise<string> {
  return new SignJWT({ role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${COOKIE_MAX_AGE}s`)
    .sign(secret);
}

export async function verifySessionToken(token: string): Promise<{ role: Role } | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    const role = payload.role;
    if (role !== "user" && role !== "admin") return null;
    return { role };
  } catch {
    return null;
  }
}

export function buildSessionCookie(token: string): string {
  const isProduction = process.env.NODE_ENV === "production";
  const parts = [
    `auth_session=${token}`,
    `Path=/`,
    `HttpOnly`,
    `SameSite=Lax`,
    `Max-Age=${COOKIE_MAX_AGE}`,
  ];
  if (isProduction) parts.push("Secure");
  return parts.join("; ");
}

export function buildExpiredSessionCookie(): string {
  return "auth_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0";
}
