import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-brand-maroon/10 bg-brand-maroon-dark text-brand-cream/90">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 text-lg font-bold text-brand-cream">
            <span aria-hidden>❤</span> মনের মানুষ
          </div>
          <p className="mt-3 max-w-xs text-sm text-brand-cream/70">
            বাংলাদেশের প্রাপ্তবয়স্কদের জন্য নিরাপদ ও ব্যক্তিগত dating
            platform। শুধুমাত্র ১৮ বছর বা তার বেশি বয়সীদের জন্য।
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-brand-gold-light">
            লিংক
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-brand-cream/80">
            <li>
              <Link href="/profiles" className="hover:text-brand-cream">
                প্রোফাইল
              </Link>
            </li>
            <li>
              <Link href="/membership" className="hover:text-brand-cream">
                মেম্বারশিপ
              </Link>
            </li>
            <li>
              <Link href="/security" className="hover:text-brand-cream">
                নিরাপত্তা
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-brand-cream">
                যোগাযোগ
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-brand-cream">
                সদস্য লগইন
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-brand-gold-light">
            যোগাযোগ
          </h3>
          <address className="mt-3 space-y-2 text-sm not-italic text-brand-cream/70">
            <p>ধানমন্ডি, ঢাকা ১২০৯, বাংলাদেশ</p>
            <p>
              <a href="tel:+8801826785574" className="hover:text-brand-cream">
                +880 1826-785574
              </a>
            </p>
            <p>
              <a
                href="mailto:support@monermanush.net"
                className="hover:text-brand-cream"
              >
                support@monermanush.net
              </a>
            </p>
          </address>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-brand-gold-light">
            গুরুত্বপূর্ণ তথ্য
          </h3>
          <p className="mt-3 text-sm text-brand-cream/70">
            এই ওয়েবসাইট শুধুমাত্র dating platform — এটি matrimonial বা
            বিয়ের ওয়েবসাইট নয়। এখানে কোনো Sign Up option নেই; Membership
            নেওয়ার পর কর্তৃপক্ষ User ID ও Password তৈরি করে দেয়।
          </p>
        </div>
      </div>

      <div className="border-t border-brand-cream/10 px-4 py-5 text-center text-xs text-brand-cream/60">
        © {new Date().getFullYear()} মনের মানুষ (Moner Manush) — সর্বস্বত্ব
        সংরক্ষিত। শুধুমাত্র ১৮+ ব্যবহারকারীদের জন্য।
      </div>
    </footer>
  );
}
