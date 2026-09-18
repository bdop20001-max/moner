const STEPS = [
  {
    title: "WhatsApp-এ মেম্বারশিপ প্ল্যান নির্বাচন করুন",
    desc: "আপনার পছন্দের প্ল্যান বেছে নিয়ে WhatsApp-এ আমাদের মেসেজ করুন।",
  },
  {
    title: "পেমেন্ট ও বয়স/পরিচয় ভেরিফিকেশন সম্পন্ন করুন",
    desc: "আমাদের টিম আপনার বয়স ও পরিচয় নিশ্চিত করবে এবং পেমেন্ট সম্পন্ন করবে।",
  },
  {
    title: "Admin থেকে User ID ও Password গ্রহণ করুন",
    desc: "ভেরিফিকেশনের পর আমরা আপনাকে একটি ইউনিক User ID ও temporary Password পাঠাবো।",
  },
  {
    title: "লগইন করে প্রোফাইল ও ফিচার ব্যবহার করুন",
    desc: "লগইন করে আপনার প্রোফাইল সম্পূর্ণ করুন এবং মনের মানুষ খোঁজা শুরু করুন।",
  },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-extrabold text-brand-maroon-dark">
          কীভাবে কাজ করে
        </h2>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step, idx) => (
          <div
            key={step.title}
            className="rounded-2xl border border-brand-maroon/10 bg-white p-6 shadow-sm"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-maroon text-sm font-bold text-brand-cream">
              {idx + 1}
            </div>
            <h3 className="mt-4 font-bold text-brand-maroon-dark">
              {step.title}
            </h3>
            <p className="mt-2 text-sm text-brand-ink/70">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
