import type { Metadata } from "next";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export const metadata: Metadata = {
  title: "Admin লগইন",
};

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-maroon-dark px-4">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-brand-maroon p-8 shadow-xl">
        <h1 className="text-center text-2xl font-extrabold text-white">
          মনের মানুষ — Admin
        </h1>
        <p className="mt-1 text-center text-sm text-white/60">
          শুধুমাত্র কর্তৃপক্ষের জন্য
        </p>
        <div className="mt-6">
          <AdminLoginForm />
        </div>
      </div>
    </main>
  );
}
