"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FAQS = [
  {
    q: "How does Washermann actually work for employees?",
    a: "Employees download the mobile app, schedule a laundry pickup, and a vetted local washerman collects their clothes. They can track the order in real time. Once done, items are returned folded and fresh — typically within 24 hours. Payment is fully automatic, drawing from company benefits first, then wallet credits, then any coupons.",
  },
  {
    q: `What are "company benefit points" and how do they expire?`,
    a: "Company benefit points are credits allocated monthly by your employer to cover laundry costs. They expire at the end of each month to keep budgets predictable. A clear countdown in the app nudges employees to use them before they lapse.",
  },
  {
    q: "Can employees combine company credits with their own wallet?",
    a: "Yes — Washermann supports hybrid payment. Company credits are applied first, then personal wallet balance, then any coupons. The checkout screen shows a clear breakdown before you confirm.",
  },
  {
    q: "What happens if something goes wrong with my order?",
    a: "All payments are held in escrow until delivery is confirmed. If an item is damaged or not returned, our support team investigates and a refund or replacement is processed within 48 hours. Every washerman is vetted and insured.",
  },
  {
    q: "Is there a minimum number of employees required?",
    a: "No minimum. Whether you have 5 employees or 5,000, Washermann scales to fit. Pricing adjusts based on volume, and your HR dashboard gives full visibility regardless of team size.",
  },
];

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (i: number) => setOpenIdx(openIdx === i ? null : i);

  return (
    <section id="faq" className="relative w-full bg-wm-green overflow-hidden">

      {/* ── Header: ghost + headline ── */}
      <div className="relative flex items-center justify-center overflow-hidden min-h-[30vh] md:min-h-[48vh]">

        {/* Ghost: HAVE — top */}
        <span
          aria-hidden
          className="pointer-events-none select-none absolute inset-x-0 top-0 text-center font-display uppercase leading-none tracking-wide text-white/[0.07]"
          style={{ fontSize: "clamp(5rem,17vw,14rem)" }}
        >
          HAVE
        </span>

        {/* Headline */}
        <h2 className="relative z-10 font-display text-[clamp(2.8rem,7vw,6.5rem)] text-wm-mint uppercase leading-tight tracking-wide text-center px-6">
          All the answers<br />to your Q&apos;s
        </h2>

        {/* Ghost: QUESTIONS? — bottom */}
        <span
          aria-hidden
          className="pointer-events-none select-none absolute inset-x-0 bottom-0 text-center font-display uppercase leading-none tracking-wide text-white/[0.07]"
          style={{ fontSize: "clamp(4.5rem,14vw,12rem)" }}
        >
          QUESTIONS?
        </span>
      </div>

      {/* ── Accordion ── */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 pb-24 pt-4 flex flex-col gap-3">
        {FAQS.map((faq, i) => {
          const isOpen = openIdx === i;
          return (
            <div
              key={i}
              className="bg-white rounded-2xl overflow-hidden cursor-pointer select-none"
              onClick={() => toggle(i)}
            >
              {/* Question row */}
              <div className="flex items-center justify-between gap-4 px-6 py-5">
                <p className="text-wm-green font-medium text-base leading-snug flex-1">
                  {faq.q}
                </p>

                {/* +/− button */}
                <span
                  className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl text-wm-green font-semibold text-xl leading-none transition-colors"
                  style={{ background: "rgba(62,207,171,0.15)" }}
                >
                  {isOpen ? "−" : "+"}
                </span>
              </div>

              {/* Answer — animates open/closed */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="body"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.32, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-6 text-sm text-gray-500 leading-relaxed">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

    </section>
  );
}
