import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const session = await getSession();

  const notifications = await prisma.notification.findMany({
    where: { memberId: session!.sub },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  if (notifications.some((n) => !n.read)) {
    await prisma.notification.updateMany({
      where: { memberId: session!.sub, read: false },
      data: { read: true },
    });
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-brand-maroon-dark">নোটিফিকেশন</h1>

      {notifications.length === 0 ? (
        <p className="text-sm text-brand-ink/60">কোনো নোটিফিকেশন নেই।</p>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="rounded-xl border border-brand-maroon/10 bg-white p-4 text-sm text-brand-ink/80"
            >
              <p>{n.body}</p>
              <p className="mt-1 text-xs text-brand-ink/40">
                {n.createdAt.toLocaleString("bn-BD")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
