import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { AdminNav } from "@/components/admin/AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-brand-cream-dark/40">
      <aside className="hidden w-60 shrink-0 flex-col bg-brand-maroon-dark p-4 md:flex">
        <Link href="/admin" className="mb-6 flex items-center gap-2 px-2 text-white">
          <span aria-hidden>❤</span>
          <span className="font-bold">মনের মানুষ Admin</span>
        </Link>
        <AdminNav />
      </aside>

      <div className="flex-1">
        <header className="flex h-16 items-center justify-between border-b border-brand-maroon/10 bg-white px-4 md:px-8">
          <span className="text-sm text-brand-ink/60">স্বাগতম, {session.label}</span>
          <Link href="/" className="text-sm text-brand-maroon underline">
            পাবলিক সাইট দেখুন
          </Link>
        </header>
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
