import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth-guards";
import { walletAdjustSchema } from "@/lib/validators";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdminSession();
  if ("error" in guard) return guard.error;

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = walletAdjustSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "তথ্য সঠিক নয়।" },
      { status: 400 },
    );
  }
  const { amount, credits, note } = parsed.data;

  const wallet = await prisma.$transaction(async (tx) => {
    const existing = await tx.wallet.upsert({
      where: { memberId: id },
      create: { memberId: id, balance: 0, chatCredits: 0 },
      update: {},
    });

    const updated = await tx.wallet.update({
      where: { memberId: id },
      data: {
        balance: existing.balance + amount,
        chatCredits: existing.chatCredits + credits,
      },
    });

    await tx.walletTransaction.create({
      data: {
        memberId: id,
        type: amount >= 0 || credits >= 0 ? "ADMIN_CREDIT" : "ADMIN_DEBIT",
        amount,
        credits,
        note: note || "Admin দ্বারা ওয়ালেট সমন্বয়",
      },
    });

    return updated;
  });

  return NextResponse.json({ ok: true, wallet });
}
