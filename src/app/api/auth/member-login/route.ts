import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { createSessionCookie } from "@/lib/session";
import { checkRateLimit } from "@/lib/rate-limit";
import { memberLoginSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = memberLoginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "ইউজার আইডি ও পাসওয়ার্ড সঠিকভাবে দিন।" },
      { status: 400 },
    );
  }
  const { userId, password } = parsed.data;

  const ip = request.headers.get("x-forwarded-for") ?? "local";
  const rl = checkRateLimit(`member-login:${ip}:${userId.toLowerCase()}`);
  if (!rl.allowed) {
    return NextResponse.json(
      {
        error:
          "অনেকবার ভুল চেষ্টা হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন বা WhatsApp-এ সহায়তা নিন।",
      },
      { status: 429 },
    );
  }

  const member = await prisma.member.findUnique({
    where: { userId: userId.trim() },
  });

  if (!member) {
    return NextResponse.json(
      { error: "ইউজার আইডি বা পাসওয়ার্ড ভুল।" },
      { status: 401 },
    );
  }

  if (member.status !== "ACTIVE") {
    return NextResponse.json(
      {
        error:
          "আপনার অ্যাকাউন্ট বর্তমানে সক্রিয় নয়। সহায়তার জন্য WhatsApp-এ যোগাযোগ করুন।",
      },
      { status: 403 },
    );
  }

  const ok = await verifyPassword(password, member.passwordHash);
  if (!ok) {
    return NextResponse.json(
      { error: "ইউজার আইডি বা পাসওয়ার্ড ভুল।" },
      { status: 401 },
    );
  }

  await createSessionCookie({
    sub: member.id,
    role: "MEMBER",
    label: member.displayName,
  });

  return NextResponse.json({
    ok: true,
    mustChangePassword: member.mustChangePassword,
  });
}
