import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LoginForm } from "@/components/auth/LoginForm";
import { supportWhatsappLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "সদস্য লগইন",
};

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-md rounded-2xl border border-brand-maroon/10 bg-white p-8 shadow-sm">
          <h1 className="text-center text-2xl font-extrabold text-brand-maroon-dark">
            সদস্য লগইন
          </h1>
          <p className="mt-2 text-center text-sm text-brand-ink/60">
            Membership নেওয়ার পর Moner Manush কর্তৃপক্ষ আপনাকে User ID ও
            Password প্রদান করবে।
          </p>

          <div className="mt-6">
            <LoginForm />
          </div>

          <div className="mt-5 text-center">
            <a
              href={supportWhatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-[#128C4A] hover:underline"
            >
              পাসওয়ার্ড ভুলে গেছেন? WhatsApp-এ সহায়তা নিন
            </a>
          </div>

          <div className="mt-4 text-center">
            <Link href="/membership" className="text-sm text-brand-maroon underline">
              এখনো মেম্বার নন? মেম্বারশিপ প্ল্যান দেখুন
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
