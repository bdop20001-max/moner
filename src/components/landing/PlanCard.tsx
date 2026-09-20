import { membershipWhatsappLink } from "@/lib/whatsapp";

export type PlanCardData = {
  id: string;
  name: string;
  price: number;
  durationDays: number;
  chatCredits: number;
  features: string[];
};

type PlanStyle = "free" | "gold" | "vip";

const PLAN_DETAILS: Record<PlanStyle, { tagline: string; badge?: string; button: string; unavailable?: string[] }> = {
  free: {
    tagline: "শুরু করুন সম্পূর্ণ ফ্রিতে",
    button: "ফ্রিতে শুরু করুন",
    unavailable: ["Member Profile Access নেই", "অন্য Members-এর সাথে Direct Chat নেই", "Contact Details Access নেই"],
  },
  gold: {
    tagline: "সঠিক মানুষের সাথে পরিচিত হওয়ার আরও সুযোগ",
    badge: "সবচেয়ে জনপ্রিয়",
    button: "Gold Membership নিন",
  },
  vip: {
    tagline: "আমাদের সর্বোচ্চ Membership Experience",
    badge: "Premium Experience",
    button: "VIP Membership নিন",
  },
};

function planStyle(name: string): PlanStyle {
  const normalized = name.toLowerCase();
  if (normalized.includes("vip")) return "vip";
  if (normalized.includes("gold")) return "gold";
  return "free";
}

export function PlanCard({ plan }: { plan: PlanCardData }) {
  const style = planStyle(plan.name);
  const details = PLAN_DETAILS[style];
  const isGold = style === "gold";
  const isVip = style === "vip";
  const isDark = isGold || isVip;

  return (
    <article
      className={`relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border p-6 shadow-xl transition-transform duration-300 hover:-translate-y-1 lg:p-7 ${
        isVip
          ? "border-brand-gold/70 bg-gradient-to-br from-[#17100f] via-[#281615] to-[#090707] text-brand-cream shadow-black/25"
          : isGold
            ? "border-brand-gold bg-gradient-to-br from-brand-maroon-dark via-brand-maroon to-[#4d091d] text-brand-cream shadow-brand-maroon/20 ring-2 ring-brand-gold/60"
            : "border-brand-maroon/10 bg-white text-brand-ink shadow-brand-maroon/10"
      }`}
    >
      {isVip && <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-brand-gold/15 blur-3xl" />}

      <div className="relative">
        {details.badge && (
          <span className={`mb-5 inline-flex rounded-full px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.12em] ${isVip ? "border border-brand-gold/50 bg-brand-gold/10 text-brand-gold-light" : "bg-brand-gold text-brand-maroon-dark shadow-sm"}`}>
            {details.badge}
          </span>
        )}
        <p className={`text-xs font-bold uppercase tracking-[0.2em] ${isDark ? "text-brand-gold-light" : "text-brand-maroon"}`}>
          {plan.name}
        </p>
        <div className="mt-3 flex items-end gap-2">
          <span className="text-4xl font-black tracking-tight">₹{plan.price.toLocaleString("en-IN")}</span>
          <span className={`pb-1 text-sm ${isDark ? "text-brand-cream/70" : "text-brand-ink/55"}`}>/ Year</span>
        </div>
        <p className={`mt-4 min-h-12 text-sm leading-6 ${isDark ? "text-brand-cream/75" : "text-brand-ink/65"}`}>
          {details.tagline}
        </p>
      </div>

      <div className={`relative my-6 h-px ${isDark ? "bg-brand-cream/15" : "bg-brand-maroon/10"}`} />

      <ul className="relative flex-1 space-y-3 text-sm leading-5">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-black ${isDark ? "bg-brand-gold/15 text-brand-gold-light" : "bg-emerald-100 text-emerald-700"}`} aria-hidden>✓</span>
            <span>{feature}</span>
          </li>
        ))}
        {details.unavailable?.map((feature) => (
          <li key={feature} className="flex items-start gap-3 text-brand-ink/45">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-maroon/5 text-[11px] font-black text-brand-maroon/50" aria-hidden>×</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <a
        href={membershipWhatsappLink(plan.name)}
        target="_blank"
        rel="noopener noreferrer"
        className={`relative mt-7 inline-flex min-h-12 items-center justify-center rounded-full px-5 text-sm font-extrabold shadow-lg transition-all hover:-translate-y-0.5 ${
          isVip
            ? "bg-gradient-to-r from-[#d6a937] to-brand-gold-light text-[#21120d] shadow-brand-gold/15 hover:brightness-105"
            : isGold
              ? "bg-brand-gold text-brand-maroon-dark shadow-black/10 hover:bg-brand-gold-light"
              : "bg-[#25D366] text-white shadow-[#25D366]/20 hover:bg-[#1ebe57]"
        }`}
      >
        {details.button}
      </a>
    </article>
  );
}
