const SAFETY_POINTS = [
  "শুধুমাত্র ১৮+ বছর বয়সী ব্যবহারকারীরাই সদস্য হতে পারবেন।",
  "ভুয়া (fake) প্রোফাইল তৈরি এবং হয়রানি (harassment) সম্পূর্ণভাবে নিষিদ্ধ।",
  "আপনার ব্যক্তিগত তথ্য সবসময় গোপন রাখা হয়।",
  "যেকোনো সমস্যায় Report ও Block করার সুবিধা রয়েছে।",
  "সম্মতি (consent) ছাড়া কারো ছবি বা যোগাযোগের তথ্য প্রকাশ করা হয় না।",
  "প্রথমবার সরাসরি দেখা করার সময় সবসময় জনসমাগমপূর্ণ (public) স্থান বেছে নিন।",
];

export function SafetySection() {
  return (
    <section id="safety" className="mx-auto max-w-6xl px-4 py-16">
      <div className="grid gap-10 rounded-3xl bg-brand-maroon-dark px-6 py-12 text-brand-cream md:grid-cols-2 md:px-12">
        <div>
          <h2 className="text-3xl font-extrabold">আপনার নিরাপত্তা আমাদের অগ্রাধিকার</h2>
          <p className="mt-3 text-brand-cream/75">
            মনের মানুষ একটি নিরাপদ ও সম্মানজনক পরিবেশ বজায় রাখতে
            প্রতিশ্রুতিবদ্ধ।
          </p>
        </div>

        <ul className="space-y-3">
          {SAFETY_POINTS.map((point) => (
            <li key={point} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-gold text-xs font-bold text-brand-maroon-dark">
                ✓
              </span>
              <span className="text-sm text-brand-cream/90">{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
