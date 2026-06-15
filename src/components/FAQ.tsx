"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "How does Washermann work?",
    a: "Simple. Book a pickup from the app, choose your time, and a vetted Wash Rep collects your clothes. We handle the cleaning and deliver everything back to your door — clean, folded, and tracked in real time the whole way.",
  },
  {
    q: "Do I need a subscription?",
    a: "No. Washermann is fully on-demand. Order when you need it, as often or as rarely as you want. No locked-in plans, no monthly commitments, no hidden fees.",
  },
  {
    q: "How long does it take?",
    a: "We're building toward a 48-hour turnaround. During our launch phase, we'll always communicate your estimated delivery time clearly so you know exactly what to expect.",
  },
  {
    q: "Is my payment protected?",
    a: "Yes. Your payment is held securely and only released to the vendor once your delivery is confirmed. If something goes wrong, you are covered.",
  },
  {
    q: "What are WashPoints?",
    a: "WashPoints are Washermann's rewards currency. You earn them every time you place an order and spend them on future pickups. Full WashPoint details will be confirmed at launch.",
  },
  {
    q: "Can my company use Washermann as an employee benefit?",
    a: "Absolutely. Washermann is built for both individuals and organisations. Companies can allocate monthly wash credits to employees and receive a single invoice and usage report. Reach out to us directly to set this up.",
  },
  {
    q: "When are you launching?",
    a: "Soon — and if you're on the waitlist, you'll be the first to know. Join now to secure your priority access and early member rewards.",
  },
];

export default function FAQ() {
  const [active, setActive] = useState(0);

  return (
    <section id="faq" className="bg-white">
      <div className="mx-auto max-w-5xl px-6 py-20 md:py-28">
        <div className="mb-14 text-center">
          <span className="font-body text-sm font-semibold uppercase tracking-widest text-wm-green/50">
            You&apos;re probably wondering…
          </span>
          <h2 className="mt-3 font-display text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.02] tracking-tight text-wm-green">
            All the answers to your questions.
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 md:items-start">
          {/* Left: question cards */}
          <div className="flex flex-col gap-5">
            {FAQS.map((f, i) => (
              <div key={i}>
                <button
                  onClick={() => setActive(i)}
                  aria-expanded={active === i}
                  className={`w-full rounded-3xl px-7 py-6 text-left transition-colors ${
                    active === i ? "bg-wm-mint-soft" : "bg-wm-gray hover:bg-wm-gray/70"
                  }`}
                >
                  <span className="font-body text-sm font-semibold text-wm-green/50 underline underline-offset-4">
                    Q
                  </span>
                  <p className="mt-3 font-body text-base font-bold leading-snug text-wm-green">
                    {f.q}
                  </p>
                </button>

                {/* Mobile answer (inline) */}
                {active === i && (
                  <div className="mt-3 rounded-3xl bg-wm-green px-7 py-6 md:hidden">
                    <span className="font-body text-sm font-semibold text-wm-orange underline underline-offset-4">
                      A
                    </span>
                    <p className="mt-3 font-body text-base leading-relaxed text-white/90">
                      {FAQS[i].a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right: answer panel (desktop) */}
          <div className="sticky top-28 hidden rounded-3xl bg-wm-green px-8 py-7 md:block">
            <span className="font-body text-sm font-semibold text-wm-orange underline underline-offset-4">
              A
            </span>
            <p className="mt-4 font-body text-base font-bold leading-snug text-white">
              {FAQS[active].q}
            </p>
            <p className="mt-4 font-body text-base leading-relaxed text-white/80">
              {FAQS[active].a}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
