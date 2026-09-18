import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireMemberSession } from "@/lib/auth-guards";
import { memberProfileUpdateSchema } from "@/lib/validators";

export async function PATCH(request: NextRequest) {
  const guard = await requireMemberSession();
  if ("error" in guard) return guard.error;

  const body = await request.json().catch(() => null);
  const parsed = memberProfileUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "তথ্য সঠিক নয়।" },
      { status: 400 },
    );
  }

  const { displayName, district, profession, bio, email, phone } = parsed.data;

  await prisma.member.update({
    where: { id: guard.session.sub },
    data: {
      displayName,
      district,
      profession: profession || null,
      bio: bio || null,
      email: email || null,
      phone: phone || null,
    },
  });

  return NextResponse.json({ ok: true });
}
