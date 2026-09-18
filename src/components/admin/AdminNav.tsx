"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "ড্যাশবোর্ড" },
  { href: "/admin/members", label: "সদস্যরা" },
  { href: "/admin/plans", label: "মেম্বারশিপ প্ল্যান" },
  { href: "/admin/payments", label: "পেমেন্ট ও ওয়ালেট" },
  { href: "/admin/reports", label: "রিপোর্ট" },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
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
              ? "bg-brand-gold text-brand-maroon-dark"
              : "text-white/80 hover:bg-white/10"
          }`}
        >
          {link.label}
        </Link>
      ))}
      <button
        type="button"
        onClick={logout}
        className="mt-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-rose-300 hover:bg-rose-950/40"
      >
        লগআউট
      </button>
    </nav>
  );
}
