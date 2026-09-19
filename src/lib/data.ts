import { prisma } from "@/lib/db";
import type { ProfileCardData } from "@/components/profiles/ProfileCard";
import type { PlanCardData } from "@/components/landing/PlanCard";

const PROFILE_CARD_SELECT = {
  id: true,
  displayName: true,
  age: true,
  district: true,
  profession: true,
  verification: true,
  avatarColor: true,
  isDemo: true,
  photos: {
    where: { isPrivate: false },
    select: { url: true },
    orderBy: { sortOrder: "asc" as const },
    take: 1,
  },
} as const;

const DEMO_PROFILES: ProfileCardData[] = [
  { id: "demo-001", displayName: "নাদিয়া", age: 26, district: "ঢাকা", profession: "গ্রাফিক ডিজাইনার", verification: "VERIFIED", avatarColor: "rose", imageUrl: "/images/profiles/nadia.jpg", isDemo: true },
  { id: "demo-002", displayName: "তানিয়া", age: 24, district: "চট্টগ্রাম", profession: "শিক্ষিকা", verification: "VERIFIED", avatarColor: "gold", imageUrl: "/images/profiles/tania.jpg", isDemo: true },
  { id: "demo-003", displayName: "মিম", age: 28, district: "সিলেট", profession: "ডাক্তার", verification: "VERIFIED", avatarColor: "rose", imageUrl: "/images/profiles/mim.jpg", isDemo: true },
  { id: "demo-004", displayName: "মেহজাবিন", age: 25, district: "চট্টগ্রাম", profession: "স্থপতি", verification: "VERIFIED", avatarColor: "blue", imageUrl: "/images/profiles/mehjabin.jpg", isDemo: true },
  { id: "demo-005", displayName: "সাদিয়া", age: 27, district: "রাজশাহী", profession: "সাংবাদিক", verification: "VERIFIED", avatarColor: "gold", imageUrl: "/images/profiles/sadia.jpg", isDemo: true },
  { id: "demo-006", displayName: "লামিয়া", age: 29, district: "খুলনা", profession: "উদ্যোক্তা", verification: "VERIFIED", avatarColor: "green", imageUrl: "/images/profiles/lamia.jpg", isDemo: true },
  { id: "demo-007", displayName: "রুমানা", age: 23, district: "ঢাকা", profession: "স্নাতকোত্তর শিক্ষার্থী", verification: "VERIFIED", avatarColor: "rose", imageUrl: "/images/profiles/rumana.jpg", isDemo: true },
  { id: "demo-008", displayName: "নুসরাত", age: 31, district: "বরিশাল", profession: "ব্যাংকার", verification: "VERIFIED", avatarColor: "green", imageUrl: "/images/profiles/nusrat.jpg", isDemo: true },
];

const DEMO_PLANS: PlanCardData[] = [
  { id: "plan-basic", name: "Basic Plan", price: 299, durationDays: 30, chatCredits: 20, features: ["সীমিত প্রোফাইল অ্যাক্সেস", "২০টি চ্যাট/কানেকশন ক্রেডিট", "বেসিক সাপোর্ট"] },
  { id: "plan-premium", name: "Premium Plan", price: 599, durationDays: 30, chatCredits: 60, features: ["বেশি প্রোফাইল অ্যাক্সেস", "৬০টি চ্যাট/কানেকশন ক্রেডিট", "প্রায়োরিটি সাপোর্ট"] },
  { id: "plan-vip", name: "VIP Plan", price: 999, durationDays: 30, chatCredits: 150, features: ["সর্বোচ্চ প্রোফাইল অ্যাক্সেস", "১৫০টি চ্যাট/কানেকশন ক্রেডিট", "VIP কাস্টমার সাপোর্ট"] },
];

export async function getFeaturedProfiles(limit = 8): Promise<ProfileCardData[]> {
  try {
    const profiles = await prisma.member.findMany({
      where: { featured: true, status: "ACTIVE", gender: "FEMALE" },
      select: PROFILE_CARD_SELECT,
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return profiles.map(({ photos, ...profile }) => ({
      ...profile,
      imageUrl: photos[0]?.url ?? null,
    }));
  } catch {
    return DEMO_PROFILES.slice(0, limit);
  }
}

export async function getPublicProfiles(params: {
  district?: string;
  page?: number;
  pageSize?: number;
}): Promise<{ profiles: ProfileCardData[]; total: number }> {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 12;

  const where = {
    status: "ACTIVE" as const,
    gender: "FEMALE" as const,
    ...(params.district ? { district: params.district } : {}),
  };

  try {
    const [rows, total] = await Promise.all([
      prisma.member.findMany({
        where,
        select: PROFILE_CARD_SELECT,
        orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.member.count({ where }),
    ]);
    const profiles = rows.map(({ photos, ...profile }) => ({
      ...profile,
      imageUrl: photos[0]?.url ?? null,
    }));
    return { profiles, total };
  } catch {
    const filtered = DEMO_PROFILES.filter(
      (profile) =>
        !params.district || profile.district === params.district,
    );
    const start = (page - 1) * pageSize;
    return { profiles: filtered.slice(start, start + pageSize), total: filtered.length };
  }
}

export async function getActivePlans(): Promise<PlanCardData[]> {
  try {
    const plans = await prisma.membershipPlan.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
    });
    return plans.map((plan) => ({
      id: plan.id,
      name: plan.name,
      price: plan.price,
      durationDays: plan.durationDays,
      chatCredits: plan.chatCredits,
      features: (plan.features as string[]) ?? [],
    }));
  } catch {
    return DEMO_PLANS;
  }
}

export async function getDistrictList(): Promise<string[]> {
  try {
    const rows = await prisma.member.findMany({
      where: { status: "ACTIVE", gender: "FEMALE" },
      select: { district: true },
      distinct: ["district"],
      orderBy: { district: "asc" },
    });
    return rows.map((r) => r.district);
  } catch {
    return [...new Set(DEMO_PROFILES.map((profile) => profile.district))].sort();
  }
}
