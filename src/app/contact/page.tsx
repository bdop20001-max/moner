import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { whatsappLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "যোগাযোগ",
  description: "মনের মানুষ কর্তৃপক্ষের সাথে যোগাযোগ করুন।",
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-4 py-16 text-center">
          <h1 className="text-3xl font-extrabold text-brand-maroon-dark">
            যোগাযোগ করুন
          </h1>
          <p className="mt-3 text-brand-ink/70">
            মেম্বারশিপ, সহায়তা অথবা যেকোনো প্রশ্নের জন্য আমাদের WhatsApp-এ
            মেসেজ করুন। আমরা দ্রুত উত্তর দেওয়ার চেষ্টা করি।
          </p>

          <a
            href={whatsappLink(
              "আসসালামু আলাইকুম, আমি Moner Manush সম্পর্কে জানতে চাই।",
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-7 py-3 text-sm font-semibold text-white shadow-md hover:bg-[#1ebe57]"
          >
            WhatsApp-এ মেসেজ করুন
          </a>

          <p className="mt-10 text-xs text-brand-ink/50">
            নোট: Moner Manush-এ কোনো public Sign Up option নেই। অ্যাকাউন্ট
            শুধুমাত্র মেম্বারশিপ ও ভেরিফিকেশনের পর কর্তৃপক্ষ তৈরি করে দেয়।
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
