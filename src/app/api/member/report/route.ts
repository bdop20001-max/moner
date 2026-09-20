import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireActiveMemberSession } from "@/lib/auth-guards";
import { reportSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  const guard = await requireActiveMemberSession();
  if ("error" in guard) return guard.error;

  const body = await request.json().catch(() => null);
  const parsed = reportSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "তথ্য সঠিক নয়।" }, { status: 400 });
  }
  if (parsed.data.reportedId === guard.session.sub) {
    return NextResponse.json({ error: "অবৈধ অনুরোধ।" }, { status: 400 });
  }

  await prisma.report.create({
    data: {
      reporterId: guard.session.sub,
      reportedId: parsed.data.reportedId,
      reason: parsed.data.reason,
      details: parsed.data.details || null,
    },
  });

  return NextResponse.json({ ok: true });
}
