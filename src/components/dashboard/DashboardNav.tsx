"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const LINKS = [
  { href: "/dashboard", label: "ড্যাশবোর্ড" },
  { href: "/dashboard/wallet", label: "ওয়ালেট" },
  { href: "/dashboard/membership", label: "মেম্বারশিপ" },
  { href: "/dashboard/profile", label: "প্রোফাইল এডিট" },
  { href: "/dashboard/saved", label: "সংরক্ষিত প্রোফাইল" },
  { href: "/dashboard/notifications", label: "নোটিফিকেশন" },
  { href: "/dashboard/settings", label: "পাসওয়ার্ড পরিবর্তন" },
];

export function DashboardNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <nav className="flex flex-col gap-1">
      {LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            pathname === link.href
              ? "bg-brand-maroon text-brand-cream"
              : "text-brand-ink/70 hover:bg-brand-maroon/5"
          }`}
        >
          {link.label}
        </Link>
      ))}
      <button
        type="button"
        onClick={logout}
        className="mt-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-rose-600 hover:bg-rose-50"
      >
        লগআউট
      </button>
    </nav>
  );
}
