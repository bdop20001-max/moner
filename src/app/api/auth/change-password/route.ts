import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { hashPassword, verifyPassword } from "@/lib/password";
import { changePasswordSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "MEMBER") {
    return NextResponse.json({ error: "অনুমতি নেই।" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = changePasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "তথ্য সঠিক নয়।" },
      { status: 400 },
    );
  }

  const member = await prisma.member.findUnique({
    where: { id: session.sub },
  });
  if (!member) {
    return NextResponse.json({ error: "সদস্য পাওয়া যায়নি।" }, { status: 404 });
  }

  const ok = await verifyPassword(
    parsed.data.currentPassword,
    member.passwordHash,
  );
  if (!ok) {
    return NextResponse.json(
      { error: "বর্তমান পাসওয়ার্ড ভুল।" },
      { status: 400 },
    );
  }

  const newHash = await hashPassword(parsed.data.newPassword);
  await prisma.member.update({
    where: { id: member.id },
    data: { passwordHash: newHash, mustChangePassword: false },
  });

  return NextResponse.json({ ok: true });
}
