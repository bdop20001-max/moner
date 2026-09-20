import "server-only";

import { prisma } from "@/lib/db";
import { getSession, type SessionPayload } from "@/lib/session";

export type MembershipAccess = {
  session: SessionPayload | null;
  hasActiveMembership: boolean;
  planName: string | null;
  expiresAt: Date | null;
};

export function freeProfileLimit(): number {
  const configured = Number(process.env.NEXT_PUBLIC_FREE_PROFILE_LIMIT ?? "8");
  return Number.isInteger(configured) && configured > 0 ? configured : 8;
}

export async function getMembershipAccess(): Promise<MembershipAccess> {
  const session = await getSession();
  if (!session || session.role !== "MEMBER") {
    return { session, hasActiveMembership: false, planName: null, expiresAt: null };
  }

  try {
    const member = await prisma.member.findFirst({
      where: { id: session.sub, status: "ACTIVE" },
      select: {
        memberships: {
          where: { status: "ACTIVE", expiryDate: { gt: new Date() } },
          orderBy: { expiryDate: "desc" },
          take: 1,
          select: { expiryDate: true, plan: { select: { name: true } } },
        },
      },
    });
    const membership = member?.memberships[0];

    return {
      session,
      hasActiveMembership: Boolean(membership),
      planName: membership?.plan.name ?? null,
      expiresAt: membership?.expiryDate ?? null,
    };
  } catch {
    return { session, hasActiveMembership: false, planName: null, expiresAt: null };
  }
}
