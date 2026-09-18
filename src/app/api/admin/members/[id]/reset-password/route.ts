import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth-guards";
import { generateTempPassword, hashPassword } from "@/lib/password";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdminSession();
  if ("error" in guard) return guard.error;

  const { id } = await params;
  const tempPassword = generateTempPassword();
  const passwordHash = await hashPassword(tempPassword);

  await prisma.member.update({
    where: { id },
    data: { passwordHash, mustChangePassword: true },
  });

  return NextResponse.json({ ok: true, tempPassword });
}
