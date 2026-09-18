import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth-guards";
import { z } from "zod";

const updateSchema = z.object({
  status: z.enum(["OPEN", "REVIEWED", "RESOLVED"]),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdminSession();
  if ("error" in guard) return guard.error;

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "তথ্য সঠিক নয়।" }, { status: 400 });
  }

  const report = await prisma.report.update({
    where: { id },
    data: { status: parsed.data.status },
  });

  return NextResponse.json({ ok: true, report });
}
