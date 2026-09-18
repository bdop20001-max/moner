import { NextResponse } from "next/server";
import { getSession, type SessionPayload } from "@/lib/session";

export async function requireMemberSession(): Promise<
  { session: SessionPayload } | { error: NextResponse }
> {
  const session = await getSession();
  if (!session || session.role !== "MEMBER") {
    return { error: NextResponse.json({ error: "অনুমতি নেই।" }, { status: 401 }) };
  }
  return { session };
}

export async function requireAdminSession(): Promise<
  { session: SessionPayload } | { error: NextResponse }
> {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return { error: NextResponse.json({ error: "অনুমতি নেই।" }, { status: 401 }) };
  }
  return { session };
}
