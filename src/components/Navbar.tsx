"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// In-page targets are root-relative ("/#id"), never a bare "#id" — a bare hash
// looks for the element on the CURRENT page, so it does nothing on /blog.
//
// When we're already on home we scroll ourselves (see scrollToHash) rather than
// letting the browser do fragment navigation: under the App Router the native
// fragment scroll doesn't fire here — the URL hash updates but the page never
// moves. Scrolling explicitly also lets us offset the fixed 80px header, which a
// raw anchor jump would hide the section behind.
const LINKS = [
  { label: "Why Washermann", href: "/#why" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Who it's for", href: "/#who" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/#faq" },
];

const isHashLink = (href: string) => href.includes("#");

// Height of the fixed header (h-20), so a section doesn't land underneath it.
const HEADER_OFFSET = 80;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // The logo always takes you home: from any other route it navigates to "/",
  // and when you're already home it scrolls back to the top.
  const onLogoClick = (e: React.MouseEvent) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Scroll to an in-page section ourselves. Only when we're already on home —
  // from any other route we let the browser navigate to "/#id" normally.
  const onHashClick = (e: React.MouseEvent, href: string) => {
    setOpen(false); // always close the mobile menu, whichever path we take below
    if (pathname !== "/") return;
    const id = href.split("#")[1];
    const el = id ? document.getElementById(id) : null;
    if (!el) return; // target missing → fall back to default behaviour
    e.preventDefault();
    // scroll-margin-top keeps the section clear of the fixed header.
    el.style.scrollMarginTop = `${HEADER_OFFSET}px`;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    history.pushState(null, "", href);
  };

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
        {/* Brand wordmark — ALWAYS goes to the home page, from any route. */}
        <Link
          href="/"
          onClick={onLogoClick}
          aria-label="Washermann — home"
          className="flex items-center gap-2 shrink-0"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/wordmark.png" alt="Washermann" className="h-4 w-auto" />
        </Link>

        {/* Desktop nav pills */}
        <div className="hidden md:flex items-center gap-1 rounded-full">
          {LINKS.map((l, i) => {
            const cls = `font-body text-sm text-white/90 rounded-full px-4 py-2 transition-colors hover:bg-white/10 ${
              i === 0 ? "border border-white/15" : ""
            }`;
            return isHashLink(l.href) ? (
              <a key={l.href} href={l.href} onClick={(e) => onHashClick(e, l.href)} className={cls}>
                {l.label}
              </a>
            ) : (
              <Link key={l.href} href={l.href} className={cls}>
                {l.label}
              </Link>
            );
          })}
        </div>

        {/* Join the Waitlist + mobile toggle */}
        <div className="flex items-center gap-3">
          <a
            href="/#waitlist"
            onClick={(e) => onHashClick(e, "/#waitlist")}
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
            {LINKS.map((l) => {
              const cls = "rounded-xl px-4 py-3 font-body text-white/90 hover:bg-white/10";
              return isHashLink(l.href) ? (
                <a key={l.href} href={l.href} onClick={(e) => onHashClick(e, l.href)} className={cls}>
                  {l.label}
                </a>
              ) : (
                <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className={cls}>
                  {l.label}
                </Link>
              );
            })}
            <a
              href="/#waitlist"
              onClick={(e) => onHashClick(e, "/#waitlist")}
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
