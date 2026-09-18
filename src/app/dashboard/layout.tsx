import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import { Avatar } from "@/components/ui/Avatar";
import { DashboardNav } from "@/components/dashboard/DashboardNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session || session.role !== "MEMBER") {
    redirect("/login");
  }

  const member = await prisma.member.findUnique({ where: { id: session.sub } });
  if (!member) redirect("/login");

  return (
    <div className="flex min-h-screen flex-col bg-brand-cream-dark/40">
      <header className="border-b border-brand-maroon/10 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 text-brand-maroon">
            <span aria-hidden>❤</span>
            <span className="font-bold">মনের মানুষ</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-brand-ink/70 sm:inline">
              {member.displayName} ({member.userId})
            </span>
            <Avatar name={member.displayName} colorKey={member.avatarColor} size={36} />
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-6xl flex-1 gap-8 px-4 py-8">
        <aside className="hidden w-56 shrink-0 md:block">
          <DashboardNav />
        </aside>
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
