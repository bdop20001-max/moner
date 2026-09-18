import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { PlanForm } from "@/components/admin/PlanForm";

export const dynamic = "force-dynamic";

export default async function EditPlanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const plan = await prisma.membershipPlan.findUnique({ where: { id } });
  if (!plan) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-brand-maroon-dark">প্ল্যান এডিট করুন</h1>
      <PlanForm
        initial={{
          id: plan.id,
          name: plan.name,
          slug: plan.slug,
          price: plan.price,
          durationDays: plan.durationDays,
          chatCredits: plan.chatCredits,
          features: (plan.features as string[]) ?? [],
          active: plan.active,
          sortOrder: plan.sortOrder,
        }}
      />
    </div>
  );
}
