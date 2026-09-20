/**
 * Demo data seed script.
 *
 * Everything created here is clearly marked `isDemo: true` (members) so it
 * can never be mistaken for a real user, and MUST be removed before running
 * the site with real members. No real people's names or photos are used —
 * members get a generated initials avatar (see src/lib/avatar.ts) instead
 * of a photo.
 */
import { PrismaClient } from "@prisma/client";
import { hashPassword, generateTempPassword } from "../src/lib/password";
import { pickAvatarColor } from "../src/lib/avatar";

const prisma = new PrismaClient();

const PLANS = [
  {
    slug: "free",
    name: "Free Plan",
    price: 0,
    durationDays: 365,
    chatCredits: 0,
    features: [
      "WhatsApp Support Agent-এর সাথে Chat",
      "Membership সম্পর্কে Basic Assistance",
      "Account Registration Support",
    ],
    sortOrder: 1,
  },
  {
    slug: "gold",
    name: "Gold Plan",
    price: 999,
    durationDays: 365,
    chatCredits: 60,
    features: [
      "Basic Member Profile Access",
      "Selected Profiles দেখার সুবিধা",
      "Chat/Connection Credits",
      "WhatsApp Customer Support",
      "Match/Connection Assistance",
      "নতুন Profile Recommendation",
      "Free Plan-এর সব সুবিধা",
    ],
    sortOrder: 2,
  },
  {
    slug: "vip",
    name: "VIP Plan",
    price: 1599,
    durationDays: 365,
    chatCredits: 150,
    features: [
      "Maximum Profile Access",
      "Higher Chat/Connection Limit",
      "Priority Match Recommendations",
      "Priority WhatsApp Support",
      "VIP Customer Assistance",
      "Premium Profile Suggestions",
      "Priority Connection Requests",
      "Gold Plan-এর সব সুবিধা",
    ],
    sortOrder: 3,
  },
];

const DEMO_MEMBERS: Array<{
  displayName: string;
  gender: "MALE" | "FEMALE";
  age: number;
  district: string;
  profession: string;
  bio: string;
  featured: boolean;
  verification: "UNVERIFIED" | "PENDING" | "VERIFIED";
}> = [
  { displayName: "নাদিয়া", gender: "FEMALE", age: 26, district: "ঢাকা", profession: "গ্রাফিক ডিজাইনার", bio: "বই পড়তে ও নতুন জায়গা ঘুরতে ভালোবাসি। সৎ ও হাসিখুশি মানুষ খুঁজছি।", featured: true, verification: "VERIFIED" },
  { displayName: "মেহজাবিন", gender: "FEMALE", age: 25, district: "চট্টগ্রাম", profession: "স্থপতি", bio: "স্থাপত্য, ভ্রমণ ও সৃজনশীল কাজ ভালোবাসি।", featured: true, verification: "VERIFIED" },
  { displayName: "তানিয়া", gender: "FEMALE", age: 24, district: "চট্টগ্রাম", profession: "শিক্ষিকা", bio: "সহজ-সরল জীবনযাপন পছন্দ করি। ভালো বন্ধুত্ব দিয়ে শুরু করতে চাই।", featured: true, verification: "VERIFIED" },
  { displayName: "লামিয়া", gender: "FEMALE", age: 29, district: "খুলনা", profession: "উদ্যোক্তা", bio: "নিজের কাজ, বই ও পরিবারকে সময় দিতে ভালোবাসি।", featured: true, verification: "VERIFIED" },
  { displayName: "মিম", gender: "FEMALE", age: 27, district: "সিলেট", profession: "ডাক্তার", bio: "ব্যস্ত জীবনের মাঝেও একজন বোঝাপড়ার মানুষ খুঁজছি।", featured: true, verification: "VERIFIED" },
  { displayName: "রুমানা", gender: "FEMALE", age: 23, district: "ঢাকা", profession: "স্নাতকোত্তর শিক্ষার্থী", bio: "সিনেমা, কফি ও নতুন কিছু শেখা পছন্দ করি।", featured: true, verification: "VERIFIED" },
  { displayName: "সাদিয়া", gender: "FEMALE", age: 23, district: "রাজশাহী", profession: "শিক্ষার্থী (স্নাতকোত্তর)", bio: "সিনেমা ও কফি পছন্দ করি। বিশ্বস্ত সম্পর্কে বিশ্বাসী।", featured: true, verification: "PENDING" },
  { displayName: "নুসরাত", gender: "FEMALE", age: 31, district: "বরিশাল", profession: "ব্যাংকার", bio: "শান্ত বিকেল, ভ্রমণ ও অর্থবহ আলাপ ভালো লাগে।", featured: true, verification: "VERIFIED" },
  { displayName: "সাবিহা", gender: "FEMALE", age: 25, district: "বরিশাল", profession: "ফ্রিল্যান্স রাইটার", bio: "লেখালেখি ও ফটোগ্রাফি আমার শখ।", featured: false, verification: "VERIFIED" },
  { displayName: "আফরিন", gender: "FEMALE", age: 30, district: "রংপুর", profession: "প্রভাষক", bio: "বই, গান ও পরিবার নিয়ে সময় কাটাতে ভালোবাসি।", featured: false, verification: "VERIFIED" },
];

async function main() {
  const adminEmail = (process.env.SEED_ADMIN_EMAIL ?? "admin@monermanush.net").toLowerCase();
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe123!";

  const existingAdmin = await prisma.admin.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    await prisma.admin.create({
      data: {
        email: adminEmail,
        passwordHash: await hashPassword(adminPassword),
        name: "Moner Manush Admin",
      },
    });
    console.log(`Created admin: ${adminEmail} / ${adminPassword} (change this password immediately)`);
  } else {
    console.log(`Admin already exists: ${adminEmail}`);
  }

  for (const plan of PLANS) {
    await prisma.membershipPlan.upsert({
      where: { slug: plan.slug },
      update: {
        name: plan.name,
        price: plan.price,
        durationDays: plan.durationDays,
        chatCredits: plan.chatCredits,
        features: plan.features,
        sortOrder: plan.sortOrder,
      },
      create: {
        slug: plan.slug,
        name: plan.name,
        price: plan.price,
        durationDays: plan.durationDays,
        chatCredits: plan.chatCredits,
        features: plan.features,
        sortOrder: plan.sortOrder,
      },
    });
  }
  console.log(`Seeded ${PLANS.length} membership plans.`);

  const premiumPlan = await prisma.membershipPlan.findUniqueOrThrow({ where: { slug: "gold" } });

  let created = 0;
  for (const [index, demo] of DEMO_MEMBERS.entries()) {
    const userId = `MM-DEMO${(index + 1).toString().padStart(3, "0")}`;
    const exists = await prisma.member.findUnique({ where: { userId } });
    if (exists) continue;

    const tempPassword = generateTempPassword();
    const member = await prisma.member.create({
      data: {
        userId,
        passwordHash: await hashPassword(tempPassword),
        mustChangePassword: true,
        displayName: demo.displayName,
        gender: demo.gender,
        age: demo.age,
        district: demo.district,
        profession: demo.profession,
        bio: demo.bio,
        avatarColor: pickAvatarColor(demo.displayName + userId),
        status: "ACTIVE",
        verification: demo.verification,
        featured: demo.featured,
        isDemo: true,
      },
    });

    await prisma.wallet.create({
      data: { memberId: member.id, balance: 150, chatCredits: premiumPlan.chatCredits },
    });

    const startDate = new Date();
    const expiryDate = new Date(startDate);
    expiryDate.setDate(expiryDate.getDate() + premiumPlan.durationDays);

    await prisma.membership.create({
      data: {
        memberId: member.id,
        planId: premiumPlan.id,
        startDate,
        expiryDate,
        status: "ACTIVE",
      },
    });

    created += 1;
  }
  console.log(`Seeded ${created} demo members (isDemo=true).`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
