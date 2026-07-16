"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import WashRepForm from "./WashRepForm";
import SalesRepForm from "./SalesRepForm";
import { whatsappLink, WHATSAPP_COMPANY_MESSAGE, SITE } from "@/lib/site";

type Key = "overview" | "employee" | "rep" | "company" | "individual";

const TABS: { key: Key; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "employee", label: "Employee" },
  { key: "rep", label: "Rep" },
  { key: "company", label: "Company" },
  { key: "individual", label: "Individual" },
];

const CARDS: { key: Key; role: string; blurb: string; icon: string }[] = [
  { key: "employee", role: "Employee", blurb: "Order, track, and pay in seconds.", icon: "/icons/employee.svg" },
  { key: "rep", role: "Rep", blurb: "Refer customers & vendors, earn cash.", icon: "/icons/washerman.svg" },
  { key: "company", role: "Company", blurb: "Control budgets and reporting.", icon: "/icons/company.svg" },
  { key: "individual", role: "Individual", blurb: "Order for yourself or gift a week.", icon: "/icons/employee.svg" },
];

const PERSONAS: Record<
  Exclude<Key, "overview">,
  {
    headline: string;
    intro?: string;
    points: string[];
    steps?: string[];
    illustration: string;
  }
> = {
  employee: {
    headline: "Laundry handled while you work.",
    intro: "Your company's wash credit, applied automatically at checkout.",
    points: [
      "Book a pickup in seconds",
      "Track live, from pickup to delivery",
      "Company credit applied first, your wallet only if needed",
    ],
    illustration: "/illustrations/persona-employee.svg",
  },
  company: {
    headline: "The low-cost benefit with the highest impact.",
    intro:
      "79% of employees link better work-life balance to higher productivity. Give your team 3+ hours back every week.",
    points: [
      "Time back = better productivity",
      "Less stress = better performance",
      "Benefits they use = stronger retention",
    ],
    steps: [
      "Allocate a monthly wash credit per employee",
      "Employees use it directly from the app",
      "You get a single monthly invoice and usage report",
      "Zero complexity. Real impact.",
    ],
    illustration: "/illustrations/persona-company.svg",
  },
  rep: {
    headline: "Refer, and get paid in cash.",
    intro: "Bring customers and vendors to Washermann and earn a cash reward for each one.",
    points: [
      "Earn cash for every customer and vendor you refer",
      "Your own referral code, tracked in a personal dashboard",
      "Request payouts straight to your bank account",
    ],
    steps: [
      "Apply with the form below",
      "We review and email you an invite",
      "Complete a short tutorial and assessment",
      "Get your code and start earning",
    ],
    illustration: "/illustrations/persona-salesrep.svg",
  },
  individual: {
    headline: "No company plan? No problem.",
    intro: "Order for yourself, or gift a laundry-free week to someone you care about.",
    points: [
      "Fully on-demand — no subscription, no commitment",
      "Earn WashPoints on every order",
      "Gift clean clothes to anyone",
    ],
    illustration: "/illustrations/persona-individual.svg",
  },
};

function WhoItsForInner() {
  const searchParams = useSearchParams();
  const apply = searchParams.get("apply")?.toLowerCase();
  const isRepApply = apply === "rep" || apply === "sales-rep" || apply === "wash-rep";
  const [tab, setTab] = useState<Key>(() => (isRepApply ? "rep" : "overview"));
  const [showRep, setShowRep] = useState(isRepApply);

  useEffect(() => {
    if (isRepApply) {
      document.getElementById("who")?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isRepApply]);

  return (
    <section id="who" className="bg-wm-peach">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="text-center">
          <span className="font-body text-sm font-semibold uppercase tracking-widest text-wm-green/50">
            Who it&apos;s for
          </span>
          <h2 className="mt-3 font-display text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.05] tracking-tight text-wm-green">
            One platform, a lane for everyone.
          </h2>
        </div>

        {/* Tabs */}
        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`rounded-full px-5 py-2.5 font-body text-sm transition-colors ${
                tab === t.key
                  ? "bg-wm-green text-white"
                  : "bg-white/60 text-wm-green hover:bg-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Panel */}
        <div className="mt-12">
          {tab === "overview" ? (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
                className="grid grid-cols-2 gap-4 md:grid-cols-4"
              >
                {CARDS.map((c, i) => (
                  <button
                    key={c.key}
                    onClick={() => setTab(c.key)}
                    style={{ rotate: `${[-3, 2, -1.5, 3, -2][i]}deg` }}
                    className="flex flex-col items-center gap-5 rounded-3xl bg-wm-green px-5 py-8 text-center transition-transform hover:-translate-y-1.5"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={c.icon} alt="" className="h-11 w-11" style={{ filter: "brightness(0) invert(1)" }} />
                    <div>
                      <p className="font-display text-2xl tracking-tight text-white">{c.role}</p>
                      <p className="mt-1 font-body text-xs leading-snug text-white/60">{c.blurb}</p>
                    </div>
                  </button>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
                className="grid items-center gap-10 md:grid-cols-2"
              >
                {/* Text */}
                <div>
                  <h3 className="font-display text-[clamp(1.9rem,3.5vw,3rem)] leading-[1.05] tracking-tight text-wm-green">
                    {PERSONAS[tab].headline}
                  </h3>
                  {PERSONAS[tab].intro && (
                    <p className="mt-4 font-body text-base leading-relaxed text-wm-green/75">
                      {PERSONAS[tab].intro}
                    </p>
                  )}
                  <ul className="mt-6 flex flex-col gap-3">
                    {PERSONAS[tab].points.map((p) => (
                      <li key={p} className="flex items-start gap-3 font-body text-sm text-wm-green/85">
                        <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-wm-mint-btn" />
                        {p}
                      </li>
                    ))}
                  </ul>

                  {PERSONAS[tab].steps && (
                    <ol className="mt-6 flex flex-col gap-2 border-t border-wm-green/15 pt-6">
                      {PERSONAS[tab].steps!.map((s, i) => (
                        <li key={s} className="flex items-start gap-3 font-body text-sm text-wm-green/75">
                          <span className="font-display text-base text-wm-green/40">{i + 1}.</span>
                          {s}
                        </li>
                      ))}
                    </ol>
                  )}

                  {/* CTA */}
                  <div className="mt-8 flex flex-wrap gap-3">
                    {tab === "company" ? (
                      <>
                        <a
                          href={whatsappLink(WHATSAPP_COMPANY_MESSAGE)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex h-12 items-center justify-center rounded-full bg-wm-mint-btn px-7 font-body text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
                        >
                          Get Started for Your Team
                        </a>
                        <a
                          href={`mailto:${SITE.email}`}
                          className="inline-flex h-12 items-center justify-center rounded-full bg-white px-7 font-body text-sm font-semibold text-wm-green transition-transform hover:scale-[1.03]"
                        >
                          Talk to sales
                        </a>
                      </>
                    ) : tab === "rep" ? (
                      <button
                        onClick={() => setShowRep(true)}
                        className="inline-flex h-12 items-center justify-center rounded-full bg-wm-mint-btn px-7 font-body text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
                      >
                        Become a Rep
                      </button>
                    ) : (
                      <a
                        href="#waitlist"
                        className="inline-flex h-12 items-center justify-center rounded-full bg-wm-mint-btn px-7 font-body text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
                      >
                        Join the Waitlist
                      </a>
                    )}
                  </div>
                </div>

                {/* Illustration */}
                <div className="flex justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={PERSONAS[tab].illustration} alt="" className="w-full max-w-sm" />
                </div>
              </motion.div>
            )}
        </div>
      </div>

      {showRep && <SalesRepForm onClose={() => setShowRep(false)} />}
    </section>
  );
}

export default function WhoItsFor() {
  // useSearchParams() requires a Suspense boundary in Next 16.
  return (
    <Suspense fallback={null}>
      <WhoItsForInner />
    </Suspense>
  );
}
