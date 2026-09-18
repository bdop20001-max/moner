import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SafetySection } from "@/components/landing/SafetySection";

export const metadata: Metadata = {
  title: "নিরাপত্তা",
  description: "মনের মানুষের নিরাপত্তা নীতিমালা ও পরামর্শ।",
};

const GUIDELINES = [
  {
    title: "বয়স যাচাইকরণ",
    body: "প্রতিটি সদস্যের বয়স ও পরিচয় মেম্বারশিপ নেওয়ার সময় যাচাই করা হয়। শুধুমাত্র ১৮ বছর বা তার বেশি বয়সীরাই সদস্য হতে পারেন।",
  },
  {
    title: "ভুয়া প্রোফাইল ও হয়রানি",
    body: "কোনো সদস্য ভুয়া তথ্য দিয়ে প্রোফাইল তৈরি করতে বা অন্য কাউকে হয়রানি করতে পারবেন না। প্রমাণিত হলে অ্যাকাউন্ট সাসপেন্ড করা হবে।",
  },
  {
    title: "গোপনীয়তা",
    body: "আপনার ব্যক্তিগত তথ্য (ফোন, ইমেইল) অন্য সদস্যদের কাছে সরাসরি প্রকাশ করা হয় না। শুধুমাত্র আপনার সম্মতিক্রমে যোগাযোগ সম্ভব।",
  },
  {
    title: "Report ও Block",
    body: "যেকোনো প্রোফাইল থেকে Report বা Block করার সুবিধা রয়েছে। আমাদের টিম প্রতিটি রিপোর্ট পর্যালোচনা করে।",
  },
  {
    title: "প্রথম সাক্ষাতের পরামর্শ",
    body: "প্রথমবার সরাসরি দেখা করার সময় সবসময় জনসমাগমপূর্ণ, পাবলিক স্থান বেছে নিন এবং কাছের কাউকে পরিকল্পনা সম্পর্কে জানিয়ে রাখুন।",
  },
];

export default function SecurityPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-12">
          <h1 className="text-3xl font-extrabold text-brand-maroon-dark">
            নিরাপত্তা
          </h1>
          <p className="mt-3 text-brand-ink/70">
            মনের মানুষে আপনার নিরাপত্তা ও গোপনীয়তা আমাদের কাছে সর্বোচ্চ
            গুরুত্বপূর্ণ।
          </p>

          <div className="mt-8 space-y-6">
            {GUIDELINES.map((g) => (
              <div
                key={g.title}
                className="rounded-2xl border border-brand-maroon/10 bg-white p-6"
              >
                <h2 className="font-bold text-brand-maroon-dark">{g.title}</h2>
                <p className="mt-2 text-sm text-brand-ink/70">{g.body}</p>
              </div>
            ))}
          </div>
        </div>

        <SafetySection />
      </main>
      <Footer />
    </>
  );
}
