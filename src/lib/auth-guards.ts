import { NextResponse } from "next/server";
import { getSession, type SessionPayload } from "@/lib/session";
import { getMembershipAccess } from "@/lib/membership-access";

export async function requireMemberSession(): Promise<
  { session: SessionPayload } | { error: NextResponse }
> {
  const session = await getSession();
  if (!session || session.role !== "MEMBER") {
    return { error: NextResponse.json({ error: "অনুমতি নেই।" }, { status: 401 }) };
  }
  return { session };
}

export async function requireActiveMemberSession(): Promise<
  { session: SessionPayload } | { error: NextResponse }
> {
  const access = await getMembershipAccess();
  if (!access.session || access.session.role !== "MEMBER") {
    return { error: NextResponse.json({ error: "অনুগ্রহ করে সদস্য লগইন করুন।" }, { status: 401 }) };
  }
  if (!access.hasActiveMembership) {
    return {
      error: NextResponse.json(
        { error: "এই সুবিধাটি ব্যবহার করতে সক্রিয় Membership প্রয়োজন।" },
        { status: 403 },
      ),
    };
  }
  return { session: access.session };
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
