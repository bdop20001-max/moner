import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireActiveMemberSession } from "@/lib/auth-guards";

export async function POST(request: NextRequest) {
  const guard = await requireActiveMemberSession();
  if ("error" in guard) return guard.error;

  const body = await request.json().catch(() => null);
  const memberId = typeof body?.memberId === "string" ? body.memberId : null;
  if (!memberId || memberId === guard.session.sub) {
    return NextResponse.json({ error: "অবৈধ অনুরোধ।" }, { status: 400 });
  }

  const existing = await prisma.savedProfile.findUnique({
    where: { memberId_savedId: { memberId: guard.session.sub, savedId: memberId } },
  });

  if (existing) {
    await prisma.savedProfile.delete({ where: { id: existing.id } });
    return NextResponse.json({ saved: false });
  }

  await prisma.savedProfile.create({
    data: { memberId: guard.session.sub, savedId: memberId },
  });

  return NextResponse.json({ saved: true });
}
