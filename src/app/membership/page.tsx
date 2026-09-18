import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MembershipPlans } from "@/components/landing/MembershipPlans";
import { getActivePlans } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "মেম্বারশিপ",
  description: "মনের মানুষের মেম্বারশিপ প্ল্যানসমূহ দেখুন।",
};

export default async function MembershipPage() {
  const plans = await getActivePlans();

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 pt-12 text-center">
          <h1 className="text-3xl font-extrabold text-brand-maroon-dark">
            মেম্বারশিপ প্ল্যান
          </h1>
          <p className="mt-3 text-brand-ink/70">
            মনে রাখবেন — এখানে কোনো Sign Up option নেই। WhatsApp-এ যোগাযোগ
            করে মেম্বারশিপ নিলে, পেমেন্ট ও যাচাইকরণের পর Moner Manush
            কর্তৃপক্ষ আপনাকে User ID ও Password তৈরি করে দেবে।
          </p>
        </div>
        <MembershipPlans plans={plans} />
      </main>
      <Footer />
    </>
  );
}
