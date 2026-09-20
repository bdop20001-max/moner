import { PlanCard, type PlanCardData } from "@/components/landing/PlanCard";

export function MembershipPlans({ plans }: { plans: PlanCardData[] }) {
  return (
    <section id="membership" className="relative overflow-hidden bg-brand-cream-dark/60 py-20">
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-brand-gold/10 blur-3xl" />
      <div className="mx-auto max-w-6xl px-4">
        <div className="relative mb-12 text-center">
          <span className="inline-flex rounded-full border border-brand-gold/50 bg-white/70 px-4 py-1.5 text-xs font-bold tracking-wide text-brand-maroon backdrop-blur">
            ১ বছরের জন্য সেরা মূল্য
          </span>
          <h2 className="mt-4 text-3xl font-extrabold text-brand-maroon-dark md:text-4xl">
            মেম্বারশিপ প্ল্যান
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-brand-ink/65">
            আপনার প্রয়োজন অনুযায়ী প্ল্যান বেছে নিন এবং WhatsApp-এ আমাদের
            সাপোর্ট টিমের সাথে যোগাযোগ করুন।
          </p>
        </div>

        <div className="relative grid items-stretch gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>

        <div className="relative mx-auto mt-10 max-w-2xl rounded-2xl border border-brand-gold/40 bg-white/80 px-5 py-4 text-center shadow-sm backdrop-blur">
          <p className="font-bold text-brand-maroon-dark">
            একবার পেমেন্ট করুন, পুরো ১ বছর Membership উপভোগ করুন।
          </p>
        </div>
      </div>
    </section>
  );
}
