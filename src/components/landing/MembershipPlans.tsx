import { PlanCard, type PlanCardData } from "@/components/landing/PlanCard";

export function MembershipPlans({ plans }: { plans: PlanCardData[] }) {
  return (
    <section id="membership" className="bg-brand-cream-dark/60 py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-extrabold text-brand-maroon-dark">
            মেম্বারশিপ প্ল্যান
          </h2>
          <p className="mt-2 text-brand-ink/70">
            আপনার জন্য উপযুক্ত প্ল্যান বেছে নিন
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan, idx) => (
            <PlanCard key={plan.id} plan={plan} highlight={idx === 1} />
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-brand-ink/60">
          মূল্য শুধুমাত্র নির্দেশক। সর্বশেষ মূল্য ও অফারের জন্য WhatsApp-এ
          যোগাযোগ করুন।
        </p>
      </div>
    </section>
  );
}
