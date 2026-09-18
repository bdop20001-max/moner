import { membershipWhatsappLink } from "@/lib/whatsapp";

export type PlanCardData = {
  id: string;
  name: string;
  price: number;
  durationDays: number;
  chatCredits: number;
  features: string[];
};

function durationLabel(days: number): string {
  if (days % 365 === 0) return `${days / 365} বছর`;
  if (days % 30 === 0) return `${days / 30} মাস`;
  return `${days} দিন`;
}

export function PlanCard({
  plan,
  highlight = false,
}: {
  plan: PlanCardData;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex flex-col rounded-2xl border p-6 shadow-sm ${
        highlight
          ? "border-brand-gold bg-brand-maroon text-brand-cream ring-2 ring-brand-gold"
          : "border-brand-maroon/15 bg-white text-brand-ink"
      }`}
    >
      {highlight && (
        <span className="mb-2 inline-block w-fit rounded-full bg-brand-gold px-3 py-1 text-xs font-bold text-brand-maroon-dark">
          সবচেয়ে জনপ্রিয়
        </span>
      )}
      <h3
        className={`text-xl font-bold ${highlight ? "text-brand-cream" : "text-brand-maroon-dark"}`}
      >
        {plan.name}
      </h3>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="text-3xl font-extrabold">৳{plan.price}</span>
        <span
          className={`text-sm ${highlight ? "text-brand-cream/70" : "text-brand-ink/60"}`}
        >
          / {durationLabel(plan.durationDays)}
        </span>
      </div>
      <p
        className={`mt-1 text-sm ${highlight ? "text-brand-cream/80" : "text-brand-ink/60"}`}
      >
        {plan.chatCredits} চ্যাট/কানেকশন ক্রেডিট
      </p>

      <ul className="mt-5 flex-1 space-y-2.5 text-sm">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <span
              className={highlight ? "text-brand-gold-light" : "text-brand-rose"}
              aria-hidden
            >
              ✓
            </span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <a
        href={membershipWhatsappLink(plan.name)}
        target="_blank"
        rel="noopener noreferrer"
        className={`mt-6 inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold shadow-sm transition-colors ${
          highlight
            ? "bg-brand-gold text-brand-maroon-dark hover:bg-brand-gold-light"
            : "bg-[#25D366] text-white hover:bg-[#1ebe57]"
        }`}
      >
        WhatsApp-এ মেম্বারশিপ নিন
      </a>
    </div>
  );
}
