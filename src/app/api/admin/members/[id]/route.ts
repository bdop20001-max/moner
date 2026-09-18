import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth-guards";
import { adminUpdateMemberSchema } from "@/lib/validators";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdminSession();
  if ("error" in guard) return guard.error;

  const { id } = await params;
  const member = await prisma.member.findUnique({
    where: { id },
    include: {
      wallet: true,
      memberships: { include: { plan: true }, orderBy: { createdAt: "desc" } },
      transactions: { orderBy: { createdAt: "desc" }, take: 20 },
    },
  });
  if (!member) return NextResponse.json({ error: "সদস্য পাওয়া যায়নি।" }, { status: 404 });

  return NextResponse.json({ member });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdminSession();
  if ("error" in guard) return guard.error;

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = adminUpdateMemberSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "তথ্য সঠিক নয়।" },
      { status: 400 },
    );
  }
  const data = parsed.data;

  const member = await prisma.member.update({
    where: { id },
    data: {
      displayName: data.displayName,
      gender: data.gender,
      age: data.age,
      district: data.district,
      profession: data.profession || null,
      bio: data.bio || null,
      email: data.email || null,
      phone: data.phone || null,
      status: data.status,
      verification: data.verification,
      featured: data.featured,
    },
  });

  return NextResponse.json({ ok: true, member });
}
