"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BG  = "#F9D5E2";
const INK = "#7A1040";

const STATS = [
  {
    id:      0,
    target:  2400,
    isFloat: false,
    format:  (v: number) => `${Math.floor(v).toLocaleString()}+`,
    label:   "Active employees served",
    star:    false,
  },
  {
    id:      1,
    target:  94,
    isFloat: false,
    format:  (v: number) => `${Math.floor(v)}%`,
    label:   "Benefit utilisation rate",
    star:    false,
  },
  {
    id:      2,
    target:  3,
    isFloat: false,
    format:  (v: number) => `${Math.floor(v)}HRS`,
    label:   "Weekly time saved per user",
    star:    false,
  },
  {
    id:      3,
    target:  4.9,
    isFloat: true,
    format:  (v: number) => `${v.toFixed(1)}`,
    label:   "Average vendor rating",
    star:    true,
  },
];

/* Two pairs cycling: [2,400+ & 94%] → [3HRS & 4.9★] → repeat */
const PAIRS: [number, number][] = [[0, 1], [2, 3]];
const HOLD_MS        = 5500;   // how long each pair stays visible
const COUNT_MS       = 1900;   // count-up duration
const COUNT_DELAY_MS = 350;    // wait for slide-in before counting starts

/* ── Count-up hook — fresh start on every mount ── */
function useCountUp(target: number, isFloat: boolean) {
  const [val, setVal] = useState(0);
  const rafRef        = useRef<number>(0);

  useEffect(() => {
    setVal(0);
    const delay = setTimeout(() => {
      const start = performance.now();
      const tick  = (now: number) => {
        const t     = Math.min((now - start) / COUNT_MS, 1);
        const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
        const cur   = eased * target;
        setVal(isFloat ? Math.round(cur * 10) / 10 : Math.floor(cur));
        if (t < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          setVal(target);
        }
      };
      rafRef.current = requestAnimationFrame(tick);
    }, COUNT_DELAY_MS);

    return () => {
      clearTimeout(delay);
      cancelAnimationFrame(rafRef.current);
    };
  }, [target, isFloat]);

  return val;
}

/* ── Single stat block ── */
function StatItem({ stat }: { stat: (typeof STATS)[number] }) {
  const val = useCountUp(stat.target, stat.isFloat);

  return (
    <div className="flex flex-col items-center gap-5 py-16 md:py-20 px-8 flex-1">
      {/* Number row */}
      <div className="flex items-center gap-3 md:gap-5" style={{ color: INK }}>
        <span
          className="font-display leading-none tracking-tight"
          style={{ fontSize: "clamp(5rem,14vw,10rem)" }}
        >
          {stat.format(val)}
        </span>

        {/* Star icon for 4.9 rating */}
        {stat.star && (
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            style={{
              width:      "clamp(3rem,8vw,6.5rem)",
              height:     "clamp(3rem,8vw,6.5rem)",
              flexShrink: 0,
            }}
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        )}
      </div>

      {/* Label */}
      <p
        className="font-body text-base md:text-lg text-center leading-snug"
        style={{ color: INK, opacity: 0.65 }}
      >
        {stat.label}
      </p>
    </div>
  );
}

/* ── Section ── */
export default function Stats() {
  const [pairIdx, setPairIdx] = useState(0);

  /* Auto-advance between pairs */
  useEffect(() => {
    const t = setTimeout(
      () => setPairIdx((p) => (p + 1) % PAIRS.length),
      HOLD_MS,
    );
    return () => clearTimeout(t);
  }, [pairIdx]);

  const pair = PAIRS[pairIdx];

  return (
    <section
      className="relative w-full overflow-hidden flex items-center justify-center"
      style={{ background: BG, minHeight: "70vh" }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={pairIdx}
          initial={{ y: 70,  opacity: 0 }}
          animate={{ y: 0,   opacity: 1 }}
          exit={{    y: -70, opacity: 0 }}
          transition={{ duration: 0.55, ease: "easeInOut" }}
          className="w-full flex flex-col md:flex-row items-stretch"
        >
          {pair.map((statIdx, i) => (
            <Fragment key={statIdx}>
              <StatItem stat={STATS[statIdx]} />

              {/* Dashed divider between the two stats */}
              {i === 0 && (
                <>
                  {/* Mobile: horizontal */}
                  <div
                    className="md:hidden mx-16 border-t-2 border-dashed"
                    style={{ borderColor: `${INK}28` }}
                  />
                  {/* Desktop: vertical */}
                  <div
                    className="hidden md:block my-16 self-stretch border-l-2 border-dashed"
                    style={{ borderColor: `${INK}28` }}
                  />
                </>
              )}
            </Fragment>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Pair indicator dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
        {PAIRS.map((_, i) => (
          <span
            key={i}
            className="block h-1.5 rounded-full transition-all duration-300"
            style={{
              background: INK,
              opacity:    i === pairIdx ? 0.45 : 0.15,
              width:      i === pairIdx ? 20 : 6,
            }}
          />
        ))}
      </div>
    </section>
  );
}
