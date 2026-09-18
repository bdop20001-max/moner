import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { createSessionCookie } from "@/lib/session";
import { checkRateLimit } from "@/lib/rate-limit";
import { adminLoginSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = adminLoginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "ইমেইল ও পাসওয়ার্ড সঠিকভাবে দিন।" },
      { status: 400 },
    );
  }
  const { email, password } = parsed.data;

  const ip = request.headers.get("x-forwarded-for") ?? "local";
  const rl = checkRateLimit(`admin-login:${ip}:${email.toLowerCase()}`);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "অনেকবার ভুল চেষ্টা হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন।" },
      { status: 429 },
    );
  }

  const admin = await prisma.admin.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!admin) {
    return NextResponse.json(
      { error: "ইমেইল বা পাসওয়ার্ড ভুল।" },
      { status: 401 },
    );
  }

  const ok = await verifyPassword(password, admin.passwordHash);
  if (!ok) {
    return NextResponse.json(
      { error: "ইমেইল বা পাসওয়ার্ড ভুল।" },
      { status: 401 },
    );
  }

  await createSessionCookie({
    sub: admin.id,
    role: "ADMIN",
    label: admin.name,
  });

  return NextResponse.json({ ok: true });
}
