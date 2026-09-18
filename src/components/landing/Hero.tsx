import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-cream to-brand-cream-dark">
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-brand-rose/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 top-40 h-72 w-72 rounded-full bg-brand-gold/20 blur-3xl" />

      <div className="relative mx-auto flex max-w-6xl flex-col items-center px-4 py-20 text-center md:py-28">
        <span className="rounded-full border border-brand-gold/40 bg-brand-gold/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-brand-maroon-dark">
          শুধুমাত্র ১৮+ বছর বয়সীদের জন্য
        </span>

        <h1 className="mt-6 max-w-3xl text-4xl font-extrabold leading-tight text-brand-maroon-dark md:text-5xl">
          কথা থেকে বন্ধুত্ব, বন্ধুত্ব থেকে সুন্দর সম্পর্ক
        </h1>

        <p className="mt-5 max-w-xl text-base text-brand-ink/70 md:text-lg">
          বাংলাদেশের প্রাপ্তবয়স্কদের জন্য নিরাপদ ও ব্যক্তিগত dating
          platform।
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/membership"
            className="inline-flex items-center justify-center rounded-full bg-brand-maroon px-7 py-3 text-sm font-semibold text-brand-cream shadow-md transition-colors hover:bg-brand-maroon-dark"
          >
            মেম্বারশিপ নিন
          </Link>
          <Link
            href="/profiles"
            className="inline-flex items-center justify-center rounded-full border border-brand-maroon px-7 py-3 text-sm font-semibold text-brand-maroon transition-colors hover:bg-brand-maroon/5"
          >
            প্রোফাইল দেখুন
          </Link>
        </div>

        <p className="mt-5 text-xs text-brand-ink/50">
          Account শুধুমাত্র Moner Manush কর্তৃপক্ষ তৈরি করে দেয়।
        </p>
      </div>
    </section>
  );
}
