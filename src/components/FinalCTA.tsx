"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Intent   = "start" | "how";
type UserType = "company" | "employee";

const BG = "#E3F5EC";

/* ── Step data for each combination ── */
const CONTENT = {
  "start-company": {
    heading: "Launch in 3 steps",
    steps: [
      { num: "01", title: "Create account & set budget", body: null },
      { num: "02", title: "Invite your team",            body: null },
      { num: "03", title: "They order, you track",       body: null },
    ],
    cta: {
      primary:   { label: "Create company account →", href: "#" },
      secondary: null,
    },
    downloads: false,
  },
  "start-employee": {
    heading: "Use your benefit today",
    steps: [
      { num: "01", title: "Download the app",          body: null },
      { num: "02", title: "Log in with your work email", body: null },
      { num: "03", title: "Schedule your first pickup", body: null },
    ],
    cta: null,
    downloads: true,
  },
  "how-company": {
    heading: "How Washermann works for companies",
    steps: [
      { num: "01", title: "Create your company account",  body: "Register, set a monthly allowance per employee, and define which staff are eligible." },
      { num: "02", title: "Credits are auto-allocated",   body: "At the start of each month every employee receives their benefit credits. Unused credits expire — no rollover, no surprises." },
      { num: "03", title: "Team orders through the app",  body: "Employees schedule pickups at their convenience. Company credits apply automatically at checkout." },
      { num: "04", title: "Full visibility on your dashboard", body: "Track spend per employee, utilisation rates, and monthly summaries. Export to CSV anytime." },
    ],
    cta: {
      primary:   { label: "Start free trial", href: "#" },
      secondary: { label: "Talk to us", href: "#" },
    },
    downloads: false,
  },
  "how-employee": {
    heading: "How it works for you",
    steps: [
      { num: "01", title: "Download the app",       body: "Available on iOS and Android. Free to install." },
      { num: "02", title: "Your benefit is ready",  body: "Company credits are loaded automatically every month. Check your balance in the app anytime." },
      { num: "03", title: "Schedule a pickup",      body: "Pick a convenient time slot. A vetted local washerman comes to you." },
      { num: "04", title: "Fresh clothes returned", body: "Folded and delivered within 24 hours. Payment drawn from your benefit credit automatically." },
    ],
    cta: null,
    downloads: true,
  },
};

/* ── Download buttons ── */
function DownloadButtons({ prominent }: { prominent: boolean }) {
  const base = prominent
    ? "flex-1 flex items-center gap-3 rounded-2xl px-6 py-4 font-semibold text-sm transition-colors"
    : "flex items-center gap-3 rounded-xl px-5 py-3 font-semibold text-sm border transition-colors";

  return (
    <div className={`flex gap-3 ${prominent ? "flex-col sm:flex-row" : "flex-wrap"}`}>
      <a
        href="#"
        className={`${base} ${prominent
          ? "bg-wm-green text-white hover:bg-wm-green/90 justify-center"
          : "border-wm-green/25 text-wm-green hover:bg-wm-green/5"
        }`}
      >
        <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
        </svg>
        App Store
      </a>
      <a
        href="#"
        className={`${base} ${prominent
          ? "bg-wm-green text-white hover:bg-wm-green/90 justify-center"
          : "border-wm-green/25 text-wm-green hover:bg-wm-green/5"
        }`}
      >
        <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3.18 23.76c.28.15.61.16.9.03l11.65-6.67-2.52-2.52-10.03 9.16zm-1.01-20.4c-.1.25-.17.52-.17.83v19.62c0 .31.07.58.17.83l.08.08L13.4 12v-.26L2.25 3.27l-.08.09zm14.69 13.42l-3.07-3.07 3.07-3.07 3.47 1.99c.99.56.99 1.53 0 2.1l-3.47 1.05z"/>
        </svg>
        Google Play
      </a>
    </div>
  );
}

/* ── Arch content: type selector ── */
function TypeSelector({ onSelect }: { onSelect: (t: UserType) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto w-full"
    >
      <button
        onClick={() => onSelect("company")}
        className="flex-1 border-2 border-wm-green/15 rounded-2xl p-6 text-left hover:border-wm-green/40 transition-all"
      >
        <span className="text-2xl block mb-3">🏢</span>
        <p className="font-semibold text-wm-green text-base">I represent a company</p>
        <p className="text-wm-green/50 text-sm mt-1 leading-snug">Set up laundry as a team benefit</p>
      </button>
      <button
        onClick={() => onSelect("employee")}
        className="flex-1 border-2 border-wm-green/15 rounded-2xl p-6 text-left hover:border-wm-green/40 transition-all"
      >
        <span className="text-2xl block mb-3">👤</span>
        <p className="font-semibold text-wm-green text-base">I&apos;m an employee</p>
        <p className="text-wm-green/50 text-sm mt-1 leading-snug">Use my company&apos;s laundry benefit</p>
      </button>
    </motion.div>
  );
}

/* ── Arch content: full content ── */
function ArchContent({ intent, userType }: { intent: Intent; userType: UserType }) {
  const key    = `${intent}-${userType}` as keyof typeof CONTENT;
  const data   = CONTENT[key];
  const brief  = intent === "start";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4 }}
      className="max-w-xl mx-auto w-full"
    >
      <p className="font-display text-wm-green text-[clamp(1.4rem,3vw,2rem)] uppercase tracking-wide leading-tight mb-8 text-center md:text-left">
        {data.heading}
      </p>

      {/* Steps */}
      <div className={`flex flex-col gap-${brief ? "4" : "6"} mb-10`}>
        {data.steps.map((s) => (
          <div key={s.num} className="flex items-start gap-4">
            {/* Number badge */}
            <span
              className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full bg-wm-green text-white font-semibold text-xs"
            >
              {s.num}
            </span>
            <div>
              <p className={`text-wm-green font-semibold leading-snug ${brief ? "text-base" : "text-base"}`}>
                {s.title}
              </p>
              {s.body && (
                <p className="text-wm-green/55 text-sm leading-relaxed mt-0.5">
                  {s.body}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* CTAs */}
      {data.downloads && <DownloadButtons prominent={brief} />}

      {data.cta && (
        <div className={`flex gap-3 ${brief ? "flex-col sm:flex-row" : "flex-wrap"}`}>
          <a
            href={data.cta.primary.href}
            className={`inline-flex items-center justify-center rounded-2xl font-semibold transition-colors ${
              brief
                ? "bg-wm-green text-white text-base px-8 py-4 hover:bg-wm-green/90"
                : "bg-wm-mint text-wm-green text-sm px-6 py-3 hover:bg-wm-mint/80"
            }`}
          >
            {data.cta.primary.label}
          </a>
          {data.cta.secondary && (
            <a
              href={data.cta.secondary.href}
              className="inline-flex items-center justify-center border border-wm-green/20 text-wm-green text-sm px-6 py-3 rounded-2xl hover:bg-wm-green/5 transition-colors"
            >
              {data.cta.secondary.label}
            </a>
          )}
        </div>
      )}
    </motion.div>
  );
}

/* ── Section ── */
export default function FinalCTA() {
  const [intent,   setIntent]   = useState<Intent | null>(null);
  const [userType, setUserType] = useState<UserType | null>(null);

  const step = !intent ? "initial" : !userType ? "select" : "content";

  const handleIntent = (i: Intent) => {
    setUserType(null);
    setIntent(i);
  };

  const reset = () => {
    setIntent(null);
    setUserType(null);
  };

  return (
    <section id="cta" className="relative w-full overflow-hidden" style={{ background: BG }}>

      {/* ── Top: headline + subtext ── */}
      <div className="relative z-10 pt-16 md:pt-20 text-center px-6 max-w-2xl mx-auto">
        <h2 className="font-display text-[clamp(2.8rem,7vw,6rem)] text-wm-green uppercase leading-tight tracking-wide">
          Give your teams<br />their Saturday back
        </h2>
        <p className="mt-4 font-body text-sm md:text-base text-wm-green/55 leading-relaxed max-w-xs mx-auto">
          Join the companies already using Washermann as a benefit employees actually look forward to
        </p>

        {/* ── Intent buttons ── */}
        <div className="mt-8 mb-10 flex items-center justify-center gap-3">
          <button
            onClick={() => handleIntent("start")}
            className={`text-sm font-semibold px-7 py-3.5 rounded-xl transition-colors ${
              intent === "start"
                ? "bg-wm-green text-white"
                : "bg-wm-mint text-wm-green hover:bg-wm-mint/80"
            }`}
          >
            Start for free
          </button>
          <button
            onClick={() => handleIntent("how")}
            className={`text-sm font-semibold px-7 py-3.5 rounded-xl transition-colors shadow-sm ${
              intent === "how"
                ? "bg-wm-green text-white"
                : "bg-white text-wm-green hover:bg-white/80"
            }`}
          >
            See how it works
          </button>
        </div>
      </div>

      {/* ── Arch content area ── */}
      <div
        className="relative w-full bg-white"
        style={{ borderRadius: "50% 50% 0 0 / 12% 12% 0 0" }}
      >
        {/* Spacer that accounts for the top curve */}
        <div style={{ paddingTop: "clamp(2.5rem, 7vw, 5rem)" }} />

        <div className="px-6 pb-16 min-h-[40vh] flex flex-col">
          <AnimatePresence mode="wait">

            {step === "initial" && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center gap-3 py-8"
              >
                <p className="text-wm-green/25 font-display text-sm uppercase tracking-widest">
                  Select an option above to get started
                </p>
              </motion.div>
            )}

            {step === "select" && (
              <motion.div key="select" className="flex-1 flex flex-col items-center justify-center py-4">
                <p className="text-wm-green/40 text-sm mb-6 text-center">
                  {intent === "start" ? "Who's getting started?" : "Who would you like to know more about?"}
                </p>
                <TypeSelector onSelect={setUserType} />
              </motion.div>
            )}

            {step === "content" && (
              <motion.div
                key={`${intent}-${userType}`}
                className="flex-1 py-2"
              >
                <ArchContent intent={intent!} userType={userType!} />
              </motion.div>
            )}

          </AnimatePresence>

          {/* Back / reset link */}
          {step !== "initial" && (
            <div className="mt-8 text-center">
              <button
                onClick={step === "content" ? () => setUserType(null) : reset}
                className="text-wm-green/35 text-xs hover:text-wm-green/60 transition-colors underline"
              >
                {step === "content" ? "← Change selection" : "← Back"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Marquee ── */}
      <div className="relative overflow-hidden py-4" style={{ background: BG }}>
        <div className="flex whitespace-nowrap select-none">
          {[0, 1].map((n) => (
            <span
              key={n}
              aria-hidden={n === 1}
              className="flex items-center font-display uppercase text-wm-green leading-none tracking-wide animate-[marquee_22s_linear_infinite] flex-shrink-0"
              style={{ fontSize: "clamp(2.4rem,5.5vw,4.5rem)" }}
            >
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className="flex items-center gap-4 pr-4">
                  GET STARTED TODAY
                  <span
                    className="inline-block bg-wm-green flex-shrink-0"
                    style={{ width: "clamp(1rem,2vw,1.6rem)", height: "clamp(1rem,2vw,1.6rem)" }}
                  />
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

    </section>
  );
}
