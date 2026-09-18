import type { Member, MemberPhoto } from "@prisma/client";

export function daysRemaining(expiryDate: Date | null | undefined): number {
  if (!expiryDate) return 0;
  const ms = new Date(expiryDate).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

export function maskPhone(phone: string | null | undefined): string {
  if (!phone) return "যোগ করা হয়নি";
  const digits = phone.replace(/\s+/g, "");
  if (digits.length < 6) return "৷৷৷৷৷৷";
  return `${digits.slice(0, 4)}৷৷৷৷${digits.slice(-2)}`;
}

export function maskEmail(email: string | null | undefined): string {
  if (!email) return "যোগ করা হয়নি";
  const [user, domain] = email.split("@");
  if (!domain) return email;
  const visible = user.slice(0, Math.min(2, user.length));
  return `${visible}${"*".repeat(Math.max(1, user.length - 2))}@${domain}`;
}

type CompletionInput = Pick<
  Member,
  "displayName" | "district" | "profession" | "bio" | "email" | "phone"
> & { photos?: MemberPhoto[] };

export function profileCompletionPercent(member: CompletionInput): number {
  const checks = [
    !!member.displayName,
    !!member.district,
    !!member.profession,
    !!member.bio && member.bio.length > 20,
    !!member.email,
    !!member.phone,
    !!member.photos && member.photos.length > 0,
  ];
  const done = checks.filter(Boolean).length;
  return Math.round((done / checks.length) * 100);
}
