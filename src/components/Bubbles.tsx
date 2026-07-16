"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Ambient soap-bubble layer — gently rising bubbles behind the whole page,
 * on-brand for a laundry service. Bubbles intensify slightly while the user
 * scrolls ("every scroll floats a few more up"), then settle. Driven by
 * framer-motion (WAAPI, GPU-composited) so it doesn't depend on the Tailwind
 * CSS pipeline. Fully removed for prefers-reduced-motion users.
 */

// Deterministic configs so SSR and client match (no hydration mismatch).
// [leftVw, size(px), riseDurationSec, delaySec, driftPx, maxOpacity]
const BUBBLES: [number, number, number, number, number, number][] = [
  [4, 14, 20, 0, 26, 0.5],
  [11, 26, 26, 6, -34, 0.42],
  [18, 9, 16, 2, 18, 0.55],
  [25, 40, 30, 10, 40, 0.34],
  [32, 12, 18, 4, -20, 0.55],
  [39, 20, 23, 14, 30, 0.44],
  [46, 8, 15, 1, -14, 0.6],
  [53, 32, 28, 8, -40, 0.36],
  [60, 16, 21, 12, 22, 0.48],
  [67, 11, 17, 3, -18, 0.55],
  [74, 24, 25, 7, 34, 0.4],
  [81, 10, 16, 9, 16, 0.55],
  [88, 34, 29, 5, -38, 0.34],
  [94, 13, 19, 13, 24, 0.5],
  [8, 18, 22, 16, -28, 0.44],
  [43, 30, 27, 18, 36, 0.38],
  [71, 15, 20, 15, -22, 0.5],
  [57, 9, 15, 11, 14, 0.58],
];

const BUBBLE_BG =
  "radial-gradient(circle at 32% 28%, rgba(255,255,255,0.92) 0%, rgba(209,247,228,0.4) 42%, rgba(59,244,190,0.10) 70%, rgba(59,244,190,0) 100%)";

export default function Bubbles() {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [rise, setRise] = useState(1000);
  const [boost, setBoost] = useState(false);

  useEffect(() => {
    setMounted(true);
    setRise(window.innerHeight + 140);

    let timer: ReturnType<typeof setTimeout> | null = null;
    const onScroll = () => {
      setBoost(true);
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => setBoost(false), 900);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    const onResize = () => setRise(window.innerHeight + 140);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (timer) clearTimeout(timer);
    };
  }, []);

  if (reduce || !mounted) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[5] overflow-hidden transition-opacity duration-500"
      style={{ opacity: boost ? 1 : 0.62 }}
    >
      {BUBBLES.map(([left, size, dur, delay, drift, op], i) => (
        <motion.span
          key={i}
          initial={{ y: 0, x: 0, opacity: 0, scale: 0.9 }}
          animate={{
            y: [0, -rise],
            x: [0, drift * 0.5, drift],
            opacity: [0, op, op, 0],
            scale: [0.9, 1, 1.05],
          }}
          transition={{
            duration: dur,
            delay,
            repeat: Infinity,
            ease: "easeIn",
            times: [0, 0.12, 0.85, 1],
          }}
          style={{
            position: "absolute",
            bottom: -60,
            left: `${left}vw`,
            width: size,
            height: size,
            borderRadius: 9999,
            background: BUBBLE_BG,
            border: "1px solid rgba(255,255,255,0.35)",
            boxShadow: "inset 0 0 6px rgba(255,255,255,0.35)",
            willChange: "transform, opacity",
          }}
        />
      ))}
    </div>
  );
}
