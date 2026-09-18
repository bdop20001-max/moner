import { cookies } from "next/headers";
import {
  SESSION_COOKIE,
  signSessionToken,
  verifySessionToken,
  type SessionPayload,
} from "@/lib/jwt";

const ONE_DAY = 60 * 60 * 24;

export { SESSION_COOKIE };
export type { SessionPayload };

export async function createSessionCookie(
  payload: SessionPayload,
  maxAgeSeconds = ONE_DAY * 7,
) {
  const token = await signSessionToken(payload, maxAgeSeconds);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: maxAgeSeconds,
  });
}

export async function destroySessionCookie() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}
