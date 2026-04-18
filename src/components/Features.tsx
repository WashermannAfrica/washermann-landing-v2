"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const features = [
  {
    number: "01",
    title: "Hybrid payment\nin one tap",
    description:
      "Users can combine company benefits, wallet credits, and coupons in a single checkout. The breakdown is crystal clear — no confusion, no abandoned orders.",
    bg: "#C8399A",
  },
  {
    number: "02",
    title: "Expiring benefits,\nbeautifully handled",
    description:
      'Company credits expire monthly to prevent rollover costs. Users see a clear countdown ("Expires in 5 days") and are nudged to use them first — automatically.',
    bg: "#3ECFAB",
    dark: true,
  },
  {
    number: "03",
    title: "Real-time order\ntracking",
    description:
      'A live progress bar shows exactly where the order is: picked up → washing → drying → out for delivery. No guesswork, no "where are my clothes?" moments.',
    bg: "#C8399A",
  },
  {
    number: "04",
    title: "Escrow-backed\npayments",
    description:
      "Funds are held in escrow and released to vendors only on delivery confirmation. Every transaction is audit-logged. Finance teams sleep well.",
    bg: "#3ECFAB",
    dark: true,
  },
];

/* ─────────────────────────────────────────────
   VERTICAL STACK — used on mobile
───────────────────────────────────────────── */
const V_PEEK       = 64;
const V_CARD_DELAY = 1600;
const V_HOLD_MS    = 1400;
const V_RESET_MS   = 900;

function useVerticalStack() {
  const [count,   setCount]   = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    if (exiting) {
      t = setTimeout(() => { setExiting(false); setCount(0); }, V_RESET_MS);
      return () => clearTimeout(t);
    }
    if (count < features.length) {
      t = setTimeout(() => setCount((c) => c + 1), count === 0 ? 700 : V_CARD_DELAY);
      return () => clearTimeout(t);
    }
    t = setTimeout(() => setExiting(true), V_HOLD_MS);
    return () => clearTimeout(t);
  }, [count, exiting]);

  const getY = (i: number): string | number => {
    if (exiting) return "110%";
    if (i >= count) return "110%";
    const fromNewest = (count - 1) - i;
    return -(fromNewest * V_PEEK);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getVTransition = (i: number): any => {
    if (exiting) {
      return { type: "tween", duration: 0.55, ease: "easeIn", delay: (features.length - 1 - i) * 0.06 };
    }
    return { type: "spring", stiffness: 260, damping: 26 };
  };

  return { vCount: count, vExiting: exiting, getY, getVTransition };
}

/* ─────────────────────────────────────────────
   HORIZONTAL ARRANGEMENT — used on desktop
───────────────────────────────────────────── */
const H_CARD_DELAY = 1200;
const H_HOLD_MS    = 2600;
const H_RESET_MS   = 800;
const FINAL_X_PCT  = [-36, -12, 12, 36];


function useHorizontalArrange() {
  const [count,   setCount]   = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    if (exiting) {
      t = setTimeout(() => { setExiting(false); setCount(0); }, H_RESET_MS);
      return () => clearTimeout(t);
    }
    if (count < features.length) {
      t = setTimeout(() => setCount((c) => c + 1), count === 0 ? 500 : H_CARD_DELAY);
      return () => clearTimeout(t);
    }
    t = setTimeout(() => setExiting(true), H_HOLD_MS);
    return () => clearTimeout(t);
  }, [count, exiting]);

  const getAnimate = (i: number) => {
    if (exiting) return { y: "110%", x: `${FINAL_X_PCT[i]}vw` };
    if (i >= count) return { y: "110%", x: "0vw" };
    return { y: 0, x: `${FINAL_X_PCT[i]}vw` };
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getHTransition = (i: number): any => {
    if (exiting) {
      return { type: "tween", duration: 0.55, ease: "easeIn", delay: i * 0.06 };
    }
    return { type: "spring", stiffness: 200, damping: 22 };
  };

  return { getAnimate, getHTransition };
}

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */
export default function Features() {
  const { getY, getVTransition }     = useVerticalStack();
  const { getAnimate, getHTransition } = useHorizontalArrange();

  return (
    <section id="features" className="relative w-full h-screen bg-wm-green flex flex-col overflow-hidden">

      {/* ── Panel 1: Headline — 35% ── */}
      <div className="relative flex-35 flex items-center justify-center overflow-hidden">
        {/* Ghost watermark */}
        <span
          aria-hidden
          className="pointer-events-none select-none absolute inset-0 flex flex-col items-center justify-center font-display uppercase leading-none text-[clamp(4rem,12vw,10rem)] text-white/[0.07] tracking-wide text-center"
        >
          <span>BUILT</span>
          <span>DIFFERENT</span>
        </span>

        {/* Headline */}
        <h2 className="relative z-10 font-display text-[clamp(1.8rem,4vw,4rem)] text-wm-mint uppercase leading-tight tracking-wide text-center px-6">
          Everything they said<br />a laundry app<br />couldn&apos;t do
        </h2>
      </div>

      {/* ── Panel 2: Desktop — horizontal — 65% ── */}
      <div className="hidden md:flex flex-65 relative w-full overflow-hidden items-end justify-center">
        {features.map((f, i) => {
          const textColor = f.dark ? "text-wm-green" : "text-white";
          return (
            <motion.div
              key={f.number}
              initial={{ y: "110%", x: "0vw" }}
              animate={getAnimate(i)}
              transition={getHTransition(i)}
              className="absolute bottom-0 flex flex-col items-center justify-between px-5 pt-6 pb-6 text-center"
              style={{
                width:  "clamp(200px, 24vw, 290px)",
                height: "clamp(260px, 46vh, 400px)",
                borderRadius: "50% 50% 0 0 / 22% 22% 0 0",
                background: f.bg,
                zIndex: i + 1,
              }}
            >
              <p className={`${textColor} text-sm font-semibold leading-snug whitespace-pre-line`}>
                {f.title}
              </p>
              <p className={`font-display text-[clamp(3rem,5vw,4.5rem)] leading-none ${textColor}`}>
                {f.number}
              </p>
              <p className={`${textColor} text-xs leading-relaxed opacity-80`}>
                {f.description}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* ── Panel 2: Mobile — vertical stack ── */}
      <div className="md:hidden flex-65 relative w-full overflow-hidden flex items-end justify-center">
        {features.map((f, i) => {
          const textColor = f.dark ? "text-wm-green" : "text-white";
          return (
            <motion.div
              key={f.number}
              animate={{ y: getY(i) }}
              transition={getVTransition(i)}
              className="absolute bottom-0 flex flex-col items-center justify-between px-6 pt-7 pb-6 text-center"
              style={{
                width:  "clamp(200px, 70vw, 280px)",
                height: "clamp(280px, 44vh, 380px)",
                borderRadius: "50% 50% 0 0 / 22% 22% 0 0",
                background: f.bg,
                zIndex: i + 1,
              }}
            >
              <p className={`${textColor} text-sm font-semibold leading-snug whitespace-pre-line`}>
                {f.title}
              </p>
              <p className={`font-display text-6xl leading-none ${textColor}`}>
                {f.number}
              </p>
              <p className={`${textColor} text-xs leading-relaxed opacity-80`}>
                {f.description}
              </p>
            </motion.div>
          );
        })}
      </div>

    </section>
  );
}
