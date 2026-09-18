import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth-guards";
import { planUpsertSchema } from "@/lib/validators";

export async function GET() {
  const guard = await requireAdminSession();
  if ("error" in guard) return guard.error;

  const plans = await prisma.membershipPlan.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json({ plans });
}

export async function POST(request: NextRequest) {
  const guard = await requireAdminSession();
  if ("error" in guard) return guard.error;

  const body = await request.json().catch(() => null);
  const parsed = planUpsertSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "তথ্য সঠিক নয়।" },
      { status: 400 },
    );
  }
  const data = parsed.data;

  const existing = await prisma.membershipPlan.findUnique({ where: { slug: data.slug } });
  if (existing) {
    return NextResponse.json({ error: "এই slug ইতিমধ্যে ব্যবহৃত হয়েছে।" }, { status: 400 });
  }

  const plan = await prisma.membershipPlan.create({
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
