"use client";

import Link from "next/link";
import { useState } from "react";
import { whatsappLink } from "@/lib/whatsapp";

const NAV_LINKS = [
  { href: "/", label: "হোম" },
  { href: "/profiles", label: "প্রোফাইল" },
  { href: "/membership", label: "মেম্বারশিপ" },
  { href: "/security", label: "নিরাপত্তা" },
  { href: "/contact", label: "যোগাযোগ" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-brand-maroon/10 bg-brand-cream/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-brand-maroon">
          <span className="text-2xl" aria-hidden>
            ❤
          </span>
          <span className="text-xl font-bold tracking-tight">মনের মানুষ</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-brand-ink/80 transition-colors hover:text-brand-maroon"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-[#25D366] px-4 py-2 text-sm font-semibold text-[#128C4A] transition-colors hover:bg-[#25D366]/10"
          >
            WhatsApp
          </a>
          <Link
            href="/login"
            className="rounded-full bg-brand-maroon px-5 py-2.5 text-sm font-semibold text-brand-cream shadow-sm transition-colors hover:bg-brand-maroon-dark"
          >
            লগইন
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="মেনু খুলুন"
          aria-expanded={open}
          className="flex h-10 w-10 items-center justify-center rounded-md text-brand-maroon md:hidden"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-brand-maroon/10 bg-brand-cream px-4 pb-4 md:hidden">
          <nav className="flex flex-col gap-1 pt-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-2.5 text-sm font-medium text-brand-ink/80 hover:bg-brand-maroon/5"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 rounded-full border border-[#25D366] px-4 py-2.5 text-center text-sm font-semibold text-[#128C4A]"
            >
              WhatsApp
            </a>
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-brand-maroon px-4 py-2.5 text-center text-sm font-semibold text-brand-cream"
            >
              লগইন
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
