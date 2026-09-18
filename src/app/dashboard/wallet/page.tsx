import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import { WhatsAppRechargeForm } from "@/components/dashboard/WhatsAppRechargeForm";

export const dynamic = "force-dynamic";

const TX_LABEL: Record<string, string> = {
  RECHARGE: "রিচার্জ",
  ADMIN_CREDIT: "অ্যাডমিন ক্রেডিট",
  ADMIN_DEBIT: "অ্যাডমিন ডেবিট",
  MEMBERSHIP_PURCHASE: "মেম্বারশিপ ক্রয়",
  CONNECTION_SPEND: "কানেকশন খরচ",
};

export default async function WalletPage() {
  const session = await getSession();
  const memberId = session!.sub;

  const [member, wallet, transactions] = await Promise.all([
    prisma.member.findUniqueOrThrow({ where: { id: memberId } }),
    prisma.wallet.findUnique({ where: { memberId } }),
    prisma.walletTransaction.findMany({
      where: { memberId },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-brand-maroon-dark">ওয়ালেট</h1>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-brand-maroon/10 bg-white p-6">
          <p className="text-sm text-brand-ink/60">বর্তমান ব্যালেন্স</p>
          <p className="mt-1 text-3xl font-extrabold text-brand-maroon-dark">
            ৳{wallet?.balance ?? 0}
          </p>
          <p className="mt-3 text-sm text-brand-ink/60">
            চ্যাট/কানেকশন ক্রেডিট: {wallet?.chatCredits ?? 0}
          </p>
        </div>

        <WhatsAppRechargeForm userId={member.userId} />
      </div>

      <div className="rounded-2xl border border-brand-maroon/10 bg-white p-6">
        <h2 className="font-bold text-brand-maroon-dark">লেনদেনের ইতিহাস</h2>
        {transactions.length === 0 ? (
          <p className="mt-3 text-sm text-brand-ink/60">এখনো কোনো লেনদেন নেই।</p>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-brand-ink/50">
                  <th className="py-2 pr-4">তারিখ</th>
                  <th className="py-2 pr-4">ধরন</th>
                  <th className="py-2 pr-4">পরিমাণ</th>
                  <th className="py-2 pr-4">ক্রেডিট</th>
                  <th className="py-2">নোট</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.id} className="border-t border-black/5">
                    <td className="py-2 pr-4 text-brand-ink/70">
                      {t.createdAt.toLocaleDateString("bn-BD")}
                    </td>
                    <td className="py-2 pr-4">{TX_LABEL[t.type] ?? t.type}</td>
                    <td className="py-2 pr-4">৳{t.amount}</td>
                    <td className="py-2 pr-4">{t.credits}</td>
                    <td className="py-2 text-brand-ink/60">{t.note ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
