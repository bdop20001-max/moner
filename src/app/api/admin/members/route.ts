import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth-guards";
import { adminCreateMemberSchema } from "@/lib/validators";
import { generateMemberUserId, generateTempPassword, hashPassword } from "@/lib/password";
import { pickAvatarColor } from "@/lib/avatar";

export async function GET(request: NextRequest) {
  const guard = await requireAdminSession();
  if ("error" in guard) return guard.error;

  const { searchParams } = new URL(request.url);
  const gender = searchParams.get("gender");
  const status = searchParams.get("status");
  const q = searchParams.get("q");

  const where: Prisma.MemberWhereInput = {};
  if (gender === "MALE" || gender === "FEMALE") where.gender = gender;
  if (status === "ACTIVE" || status === "INACTIVE" || status === "SUSPENDED") where.status = status;
  if (q) {
    where.OR = [
      { displayName: { contains: q, mode: "insensitive" } },
      { userId: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
    ];
  }

  const members = await prisma.member.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return NextResponse.json({ members });
}

async function uniqueUserId(): Promise<string> {
  for (let i = 0; i < 20; i++) {
    const candidate = generateMemberUserId();
    const exists = await prisma.member.findUnique({ where: { userId: candidate } });
    if (!exists) return candidate;
  }
  throw new Error("Could not generate a unique member ID");
}

export async function POST(request: NextRequest) {
  const guard = await requireAdminSession();
  if ("error" in guard) return guard.error;

  const body = await request.json().catch(() => null);
  const parsed = adminCreateMemberSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "তথ্য সঠিক নয়।" },
      { status: 400 },
    );
  }
  const data = parsed.data;

  const userId = await uniqueUserId();
  const tempPassword = generateTempPassword();
  const passwordHash = await hashPassword(tempPassword);

  const plan = data.planId
    ? await prisma.membershipPlan.findUnique({ where: { id: data.planId } })
    : null;

  const member = await prisma.$transaction(async (tx) => {
    const created = await tx.member.create({
      data: {
        userId,
        passwordHash,
        mustChangePassword: true,
        displayName: data.displayName,
        gender: data.gender,
        age: data.age,
        district: data.district,
        profession: data.profession || null,
        bio: data.bio || null,
        email: data.email || null,
        phone: data.phone || null,
        avatarColor: data.avatarColor || pickAvatarColor(data.displayName + userId),
        isDemo: false,
      },
    });

    await tx.wallet.create({
      data: { memberId: created.id, balance: 0, chatCredits: plan?.chatCredits ?? 0 },
    });

    if (plan) {
      const startDate = new Date();
      const expiryDate = new Date(startDate);
      expiryDate.setDate(expiryDate.getDate() + plan.durationDays);

      await tx.membership.create({
        data: {
          memberId: created.id,
          planId: plan.id,
          startDate,
          expiryDate,
          status: "ACTIVE",
        },
      });

      await tx.walletTransaction.create({
        data: {
          memberId: created.id,
          type: "MEMBERSHIP_PURCHASE",
          amount: plan.price,
          credits: plan.chatCredits,
          note: `${plan.name} মেম্বারশিপ (admin কর্তৃক তৈরি)`,
        },
      });
    }

    return created;
  });

  return NextResponse.json({
    ok: true,
    member: { id: member.id, userId: member.userId },
    tempPassword,
  });
}
