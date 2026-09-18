import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const TX_LABEL: Record<string, string> = {
  RECHARGE: "রিচার্জ",
  ADMIN_CREDIT: "অ্যাডমিন ক্রেডিট",
  ADMIN_DEBIT: "অ্যাডমিন ডেবিট",
  MEMBERSHIP_PURCHASE: "মেম্বারশিপ ক্রয়",
  CONNECTION_SPEND: "কানেকশন খরচ",
};

export default async function AdminPaymentsPage() {
  const transactions = await prisma.walletTransaction.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { member: { select: { displayName: true, userId: true } } },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-brand-maroon-dark">পেমেন্ট ও ওয়ালেট লেনদেন</h1>

      <div className="overflow-x-auto rounded-2xl border border-brand-maroon/10 bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-black/5 text-brand-ink/50">
              <th className="px-4 py-3">তারিখ</th>
              <th className="px-4 py-3">সদস্য</th>
              <th className="px-4 py-3">ধরন</th>
              <th className="px-4 py-3">পরিমাণ (৳)</th>
              <th className="px-4 py-3">ক্রেডিট</th>
              <th className="px-4 py-3">নোট</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id} className="border-b border-black/5 last:border-0">
                <td className="px-4 py-3 text-brand-ink/70">{t.createdAt.toLocaleString("bn-BD")}</td>
                <td className="px-4 py-3">
                  {t.member.displayName} <span className="text-brand-ink/50">({t.member.userId})</span>
                </td>
                <td className="px-4 py-3">{TX_LABEL[t.type] ?? t.type}</td>
                <td className="px-4 py-3">৳{t.amount}</td>
                <td className="px-4 py-3">{t.credits}</td>
                <td className="px-4 py-3 text-brand-ink/60">{t.note ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {transactions.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-brand-ink/60">কোনো লেনদেন নেই।</p>
        )}
      </div>
    </div>
  );
}
