import { prisma } from "@/lib/db";
import { NewMemberForm } from "@/components/admin/NewMemberForm";

export const dynamic = "force-dynamic";

export default async function NewMemberPage() {
  const plans = await prisma.membershipPlan.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
    select: { id: true, name: true, price: true },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-brand-maroon-dark">নতুন সদস্য তৈরি করুন</h1>
      <p className="text-sm text-brand-ink/60">
        User ID ও temporary password স্বয়ংক্রিয়ভাবে তৈরি হবে। মেম্বারশিপ
        পেমেন্ট ও পরিচয় যাচাই করার পরই এই ফর্ম পূরণ করুন।
      </p>
      <NewMemberForm plans={plans} />
    </div>
  );
}
