import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth-guards";
import { planUpsertSchema } from "@/lib/validators";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdminSession();
  if ("error" in guard) return guard.error;

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = planUpsertSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "তথ্য সঠিক নয়।" },
      { status: 400 },
    );
  }
  const data = parsed.data;

  const plan = await prisma.membershipPlan.update({
    where: { id },
    data: {
      name: data.name,
      slug: data.slug,
      price: data.price,
      durationDays: data.durationDays,
      chatCredits: data.chatCredits,
      features: data.features.split("\n").map((f) => f.trim()).filter(Boolean),
      active: data.active ?? true,
      sortOrder: data.sortOrder ?? 0,
    },
  });

  return NextResponse.json({ ok: true, plan });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdminSession();
  if ("error" in guard) return guard.error;

  const { id } = await params;
  const inUse = await prisma.membership.findFirst({ where: { planId: id } });
  if (inUse) {
    await prisma.membershipPlan.update({ where: { id }, data: { active: false } });
    return NextResponse.json({
      ok: true,
      note: "এই প্ল্যানটি সদস্যদের সাথে যুক্ত থাকায় মুছে ফেলা যায়নি, তবে নিষ্ক্রিয় করা হয়েছে।",
    });
  }

  await prisma.membershipPlan.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
