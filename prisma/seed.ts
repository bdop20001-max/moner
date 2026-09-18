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
    slug: "basic",
    name: "Basic Plan",
    price: 299,
    durationDays: 30,
    chatCredits: 20,
    features: [
      "সীমিত প্রোফাইল অ্যাক্সেস",
      "২০টি চ্যাট/কানেকশন ক্রেডিট",
      "বেসিক সাপোর্ট",
    ],
    sortOrder: 1,
  },
  {
    slug: "premium",
    name: "Premium Plan",
    price: 599,
    durationDays: 30,
    chatCredits: 60,
    features: [
      "বেশি প্রোফাইল অ্যাক্সেস",
      "৬০টি চ্যাট/কানেকশন ক্রেডিট",
      "প্রায়োরিটি সাপোর্ট",
    ],
    sortOrder: 2,
  },
  {
    slug: "vip",
    name: "VIP Plan",
    price: 999,
    durationDays: 30,
    chatCredits: 150,
    features: [
      "সর্বোচ্চ প্রোফাইল অ্যাক্সেস",
      "১৫০টি চ্যাট/কানেকশন ক্রেডিট (higher wallet credits)",
      "VIP কাস্টমার সাপোর্ট",
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
  { displayName: "ফারহান", gender: "MALE", age: 29, district: "ঢাকা", profession: "সফটওয়্যার ইঞ্জিনিয়ার", bio: "শান্ত স্বভাবের, সঙ্গীতপ্রেমী। আন্তরিক সম্পর্কের খোঁজে আছি।", featured: true, verification: "VERIFIED" },
  { displayName: "তানিয়া", gender: "FEMALE", age: 24, district: "চট্টগ্রাম", profession: "শিক্ষিকা", bio: "সহজ-সরল জীবনযাপন পছন্দ করি। ভালো বন্ধুত্ব দিয়ে শুরু করতে চাই।", featured: true, verification: "VERIFIED" },
  { displayName: "রাফি", gender: "MALE", age: 31, district: "চট্টগ্রাম", profession: "ব্যবসায়ী", bio: "পরিবারকেন্দ্রিক মানুষ, ভ্রমণ করতে ভালোবাসি।", featured: true, verification: "PENDING" },
  { displayName: "মিম", gender: "FEMALE", age: 27, district: "সিলেট", profession: "ডাক্তার", bio: "ব্যস্ত জীবনের মাঝেও একজন বোঝাপড়ার মানুষ খুঁজছি।", featured: true, verification: "VERIFIED" },
  { displayName: "শাকিল", gender: "MALE", age: 28, district: "সিলেট", profession: "সাংবাদিক", bio: "কৌতূহলী মন, নতুন মানুষের সাথে কথা বলতে ভালো লাগে।", featured: true, verification: "UNVERIFIED" },
  { displayName: "সাদিয়া", gender: "FEMALE", age: 23, district: "রাজশাহী", profession: "শিক্ষার্থী (স্নাতকোত্তর)", bio: "সিনেমা ও কফি পছন্দ করি। বিশ্বস্ত সম্পর্কে বিশ্বাসী।", featured: true, verification: "PENDING" },
  { displayName: "ইমরান", gender: "MALE", age: 33, district: "খুলনা", profession: "প্রকৌশলী", bio: "স্পষ্টবাদী ও দায়িত্বশীল। দীর্ঘমেয়াদী সম্পর্ক চাই।", featured: true, verification: "VERIFIED" },
  { displayName: "লামিয়া", gender: "FEMALE", age: 25, district: "বরিশাল", profession: "ফ্রিল্যান্স রাইটার", bio: "লেখালেখি ও ফটোগ্রাফি আমার শখ।", featured: false, verification: "VERIFIED" },
  { displayName: "তানভীর", gender: "MALE", age: 30, district: "রংপুর", profession: "ব্যাংকার", bio: "খেলাধুলা পছন্দ করি, বিশেষ করে ক্রিকেট।", featured: false, verification: "UNVERIFIED" },
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

  const premiumPlan = await prisma.membershipPlan.findUniqueOrThrow({ where: { slug: "premium" } });

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
