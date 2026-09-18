import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "mm_session";
const ONE_DAY = 60 * 60 * 24;

export type SessionRole = "ADMIN" | "MEMBER";

export type SessionPayload = {
  sub: string; // Admin.id or Member.id
  role: SessionRole;
  label: string; // display name / email, for UI convenience only
};

function getSecretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET environment variable is not set");
  }
  return new TextEncoder().encode(secret);
}

export async function signSessionToken(
  payload: SessionPayload,
  maxAgeSeconds = ONE_DAY * 7,
): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + maxAgeSeconds)
    .sign(getSecretKey());
}

export async function verifySessionToken(
  token: string,
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (
      typeof payload.sub === "string" &&
      (payload.role === "ADMIN" || payload.role === "MEMBER") &&
      typeof payload.label === "string"
    ) {
      return {
        sub: payload.sub,
        role: payload.role,
        label: payload.label,
      };
    }
    return null;
  } catch {
    return null;
  }
}
