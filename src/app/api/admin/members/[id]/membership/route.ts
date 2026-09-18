import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth-guards";
import { z } from "zod";

const assignSchema = z.object({
  planId: z.string().min(1),
  startDate: z.string().optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdminSession();
  if ("error" in guard) return guard.error;

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = assignSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "তথ্য সঠিক নয়।" }, { status: 400 });
  }

  const plan = await prisma.membershipPlan.findUnique({
    where: { id: parsed.data.planId },
  });
  if (!plan) {
    return NextResponse.json({ error: "প্ল্যান পাওয়া যায়নি।" }, { status: 404 });
  }

  const startDate = parsed.data.startDate ? new Date(parsed.data.startDate) : new Date();
  const expiryDate = new Date(startDate);
  expiryDate.setDate(expiryDate.getDate() + plan.durationDays);

  await prisma.$transaction(async (tx) => {
    await tx.membership.updateMany({
      where: { memberId: id, status: "ACTIVE" },
      data: { status: "CANCELLED" },
    });

    await tx.membership.create({
      data: { memberId: id, planId: plan.id, startDate, expiryDate, status: "ACTIVE" },
    });

    await tx.wallet.upsert({
      where: { memberId: id },
      create: { memberId: id, balance: 0, chatCredits: plan.chatCredits },
      update: { chatCredits: { increment: plan.chatCredits } },
    });

    await tx.walletTransaction.create({
      data: {
        memberId: id,
        type: "MEMBERSHIP_PURCHASE",
        amount: plan.price,
        credits: plan.chatCredits,
        note: `${plan.name} মেম্বারশিপ (admin কর্তৃক নির্ধারিত)`,
      },
    });
  });

  return NextResponse.json({ ok: true });
}
