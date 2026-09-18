import { PlanForm } from "@/components/admin/PlanForm";

export default function NewPlanPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-brand-maroon-dark">নতুন মেম্বারশিপ প্ল্যান</h1>
      <PlanForm
        initial={{
          name: "",
          slug: "",
          price: 0,
          durationDays: 30,
          chatCredits: 0,
          features: [],
          active: true,
          sortOrder: 0,
        }}
      />
    </div>
  );
}
