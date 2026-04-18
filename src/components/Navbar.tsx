"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMenu } from "@/context/menu-context";

const navLinks = [
  { label: "How It Works",  href: "#how-it-works" },
  { label: "Features",      href: "#features"     },
  { label: "For Companies", href: "#experiences"  },
];

const megaLinks = [
  { label: "For Companies", href: "#experiences" },
  { label: "For Vendors",   href: "#experiences" },
  { label: "Pricing",       href: "#cta"         },
  { label: "FAQ's",         href: "#faq"         },
  { label: "Contact",       href: "#"            },
];

export default function Navbar() {
  const { megaOpen, setMegaOpen }   = useMenu();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hidden,     setHidden]     = useState(false);
  const lastScroll                  = useRef(0);

  /* Hide navbar on scroll down */
  useEffect(() => {
    const handler = () => {
      const y = window.scrollY;
      setHidden(y > lastScroll.current && y > 80 && !megaOpen);
      lastScroll.current = y;
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [megaOpen]);

  /* Lock body scroll when mega menu is open */
  useEffect(() => {
    document.body.style.overflow = megaOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [megaOpen]);

  const handleNavClick = (href: string) => {
    setMegaOpen(false);
    setMobileOpen(false);
    setTimeout(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };

  return (
    <>
      {/* ── Navbar bar ── */}
      <motion.header
        animate={{ y: hidden ? "-100%" : "0%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed top-0 inset-x-0 z-50 bg-wm-green"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-[60px] flex items-center justify-between">

          {/* Left: logo + nav pills */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); setMegaOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className="flex-shrink-0 mr-1"
            >
              <Image src="/logo.png" alt="Washermann" width={52} height={52} priority />
            </a>

            {navLinks.map((l) => (
              <button
                key={l.href}
                onClick={() => handleNavClick(l.href)}
                className="bg-white/4 text-white/90 text-sm font-medium px-5 py-2 rounded-full hover:bg-white/15 transition-colors"
              >
                {l.label}
              </button>
            ))}

            {/* ••• triggers mega menu */}
            <button
              onClick={() => setMegaOpen(!megaOpen)}
              className="bg-white/8 border border-white/12 text-white/70 text-xs px-4 py-2 rounded-full hover:bg-white/15 transition-colors leading-none"
              aria-label="More"
            >
              •••
            </button>
          </div>

          {/* Mobile: logo */}
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            className="flex-shrink-0 md:hidden"
          >
            <Image src="/logo.png" alt="Washermann" width={36} height={36} priority />
          </a>

          {/* GET STARTED */}
          <a
            href="#cta"
            className="hidden md:inline-flex items-center bg-white text-wm-green font-semibold text-sm px-6 py-2.5 rounded-xl hover:bg-white/90 transition-colors tracking-wide uppercase"
          >
            Get Started
          </a>

          {/* Mobile hamburger */}
          <button
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5 ml-auto"
          >
            <motion.span animate={mobileOpen ? { rotate: 45, y: 7 }  : { rotate: 0, y: 0 }} className="block h-0.5 w-6 bg-white origin-center" />
            <motion.span animate={mobileOpen ? { opacity: 0 }        : { opacity: 1 }}       className="block h-0.5 w-6 bg-white" />
            <motion.span animate={mobileOpen ? { rotate: -45, y: -7 }: { rotate: 0, y: 0 }} className="block h-0.5 w-6 bg-white origin-center" />
          </button>
        </div>
      </motion.header>

      {/* ── Mega menu overlay (desktop ···) ── */}
      <AnimatePresence>
        {megaOpen && (
          <motion.div
            key="mega-menu"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
            className="fixed inset-0 z-40 bg-wm-green flex flex-col overflow-hidden"
          >
            {/* Spacer for navbar */}
            <div className="h-[60px] flex-shrink-0" />

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 px-6 lg:px-16 py-10 lg:py-14 gap-12 overflow-auto">

              {/* Left — nav links */}
              <div className="flex flex-col justify-between">
                <div className="flex flex-col gap-1">
                  {/* CLOSE button */}
                  <button
                    onClick={() => setMegaOpen(false)}
                    className="self-start flex items-center gap-2 bg-wm-mint text-wm-green font-semibold text-xs px-4 py-2 rounded-full mb-8 hover:bg-wm-mint/90 transition-colors uppercase tracking-widest"
                  >
                    Close
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  {/* Menu links */}
                  {megaLinks.map((l, i) => (
                    <motion.button
                      key={l.label}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.06, duration: 0.4 }}
                      onClick={() => handleNavClick(l.href)}
                      className="text-left font-display text-[clamp(2.8rem,6vw,5.5rem)] leading-none text-white uppercase tracking-wide hover:text-wm-mint transition-colors"
                    >
                      {l.label}
                    </motion.button>
                  ))}
                </div>

                {/* Social icons */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.45 }}
                  className="flex items-center gap-4 mt-10"
                >
                  {/* Instagram */}
                  <a href="#" aria-label="Instagram" className="text-white/60 hover:text-white transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                    </svg>
                  </a>
                  {/* LinkedIn */}
                  <a href="#" aria-label="LinkedIn" className="text-white/60 hover:text-white transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                  {/* TikTok */}
                  <a href="#" aria-label="TikTok" className="text-white/60 hover:text-white transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/>
                    </svg>
                  </a>
                </motion.div>
              </div>

              {/* Right — WhatsApp panel */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="flex flex-col justify-center gap-6 lg:pl-10 w-full max-w-120"
              >
                {/* QR + headline */}
                <div className="flex flex-row items-start gap-6">
                  <div className="flex-shrink-0 w-32 h-32 bg-white rounded-xl overflow-hidden">
                    <Image
                      src="/whatsapp-qr.png"
                      alt="WhatsApp QR"
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h2 className="font-display text-[clamp(2.4rem,4.8vw,6rem)] text-white uppercase leading-none tracking-wide">
                    Shall we connect on WhatsApp?
                  </h2>
                </div>

                <p className="text-white/65 text-base leading-relaxed max-w-md">
                  Because we prefer genuine, quick, and straightforward exchanges.
                  Scan the QR code, send your message, and we&apos;ll reply (very quickly).
                </p>

                <div className="flex flex-col gap-3 items-start">
                  <a
                    href="https://wa.me/234800000000"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center bg-wm-mint text-wm-green font-bold text-sm uppercase tracking-widest px-8 py-5 rounded-2xl hover:bg-wm-mint/90 transition-colors"
                  >
                    Open WhatsApp
                  </a>
                  <a
                    href="https://wa.me/234800000000"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center border border-white/25 text-white font-semibold text-sm uppercase tracking-widest px-8 py-4 rounded-2xl hover:bg-white/8 transition-colors"
                  >
                    Chat with Washermann
                  </a>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Mobile overlay ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed inset-0 z-40 bg-wm-green flex flex-col px-6 pt-24 pb-10 gap-6"
          >
            {megaLinks.map((l, i) => (
              <motion.button
                key={l.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08 + i * 0.06 }}
                onClick={() => handleNavClick(l.href)}
                className="text-left font-display text-4xl text-white uppercase hover:text-wm-mint transition-colors"
              >
                {l.label}
              </motion.button>
            ))}
            <motion.a
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              href="#cta"
              onClick={() => setMobileOpen(false)}
              className="mt-auto self-start bg-white text-wm-green font-bold text-sm px-8 py-3 rounded-xl uppercase tracking-wide"
            >
              Get Started
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
