"use client";

import { useEffect, useState } from "react";

const LINKS = [
  { label: "Why Washermann", href: "/#why" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Who it's for", href: "/#who" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/#faq" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-wm-green/90 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
        {/* Brand wordmark */}
        <a href="#top" className="flex items-center gap-2 shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/wordmark.png" alt="Washermann" className="h-8 w-auto" />
        </a>

        {/* Desktop nav pills */}
        <div className="hidden md:flex items-center gap-1 rounded-full">
          {LINKS.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              className={`font-body text-sm text-white/90 rounded-full px-4 py-2 transition-colors hover:bg-white/10 ${
                i === 0 ? "border border-white/15" : ""
              }`}
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Join the Waitlist + mobile toggle */}
        <div className="flex items-center gap-3">
          <a
            href="#waitlist"
            className="hidden sm:inline-flex items-center rounded-full bg-wm-mint-btn px-5 py-2.5 font-body text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
          >
            Join the Waitlist
          </a>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            className="md:hidden flex h-10 w-10 flex-col items-center justify-center gap-1.5"
          >
            <span className="h-0.5 w-6 bg-white" />
            <span className="h-0.5 w-6 bg-white" />
            <span className="h-0.5 w-6 bg-white" />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-white/10 bg-wm-green px-6 py-4">
          <div className="flex flex-col gap-1">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 font-body text-white/90 hover:bg-white/10"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#waitlist"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-wm-mint-btn px-5 py-3 text-center font-body font-semibold text-white"
            >
              Join the Waitlist
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
