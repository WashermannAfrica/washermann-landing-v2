"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const steps = [
  {
    id: 0,
    title: "Schedule\na Pickup",
    description:
      "Choose a convenient time slot directly from the mobile app. Your assigned washerman confirms within minutes.",
    bg: "bg-[#B8D8F0]",
    titleColor: "text-[#1a3a8a]",
    progressColor: "bg-[#1a3a8a]",
  },
  {
    id: 1,
    title: "We Wash,\nYou Work",
    description:
      "Your laundry is collected, cleaned, and dried by a vetted local professional. Real-time updates keep you informed.",
    bg: "bg-[#F5C0D8]",
    titleColor: "text-[#b0145a]",
    progressColor: "bg-[#b0145a]",
  },
  {
    id: 2,
    title: "Delivered\nFresh",
    description:
      "Your clothes are returned folded and fresh. Payment is automatic — company benefits applied first, every time.",
    bg: "bg-[#C0E8C0]",
    titleColor: "text-[#1B3A2D]",
    progressColor: "bg-[#1B3A2D]",
  },
];

const INTERVAL = 4000;

export default function HowItWorks() {
  const [active,   setActive]   = useState(0);
  const [progress, setProgress] = useState(0);
  const [dir,      setDir]      = useState(1); // 1 = forward, -1 = back

  /* Auto-advance with progress bar */
  useEffect(() => {
    setProgress(0);
    const start = performance.now();
    let raf: number;

    const tick = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min((elapsed / INTERVAL) * 100, 100);
      setProgress(pct);
      if (pct < 100) {
        raf = requestAnimationFrame(tick);
      } else {
        setDir(1);
        setActive((v) => (v + 1) % steps.length);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active]);

  const goTo = (i: number) => {
    setDir(i > active ? 1 : -1);
    setActive(i);
  };

  const step = steps[active];

  return (
    <section id="how-it-works">

      {/* ── Panel 1: Headline — full screen ── */}
      <div className="relative w-full h-[50vh] bg-white flex items-center justify-center overflow-hidden">
        {/* Watermark — scales down + fades in */}
        <motion.span
          aria-hidden
          initial={{ opacity: 0, scale: 1.25 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="pointer-events-none select-none absolute inset-0 flex flex-col items-center justify-center font-display uppercase leading-none text-[clamp(5rem,14vw,12rem)] text-gray-100 tracking-wide text-center"
        >
          <span>HOW IT</span>
          <span>WORKS</span>
        </motion.span>

        {/* Headline — fades up after watermark */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="relative z-10 font-display text-[clamp(2.4rem,5.5vw,5.5rem)] text-wm-green uppercase leading-tight tracking-wide text-center px-6"
        >
          From dirty clothes<br />to your door in 24hrs
        </motion.h2>
      </div>

      {/* ── Panel 2: Step carousel — full screen ── */}
      <div className="relative w-full h-[50vh] md:h-screen overflow-hidden">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={active}
            custom={dir}
            variants={{
              enter:  (d: number) => ({ x: d > 0 ? "100%" : "-100%" }),
              center: { x: 0 },
              exit:   (d: number) => ({ x: d > 0 ? "-100%" : "100%" }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className={`${step.bg} absolute inset-0 flex flex-col justify-between px-10 md:px-20 lg:px-28 pt-14 pb-0 overflow-hidden`}
          >
            {/* Step title */}
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={`font-display text-[clamp(2.8rem,7vw,6rem)] uppercase leading-none tracking-wide ${step.titleColor} whitespace-pre-line`}
            >
              {step.title}
            </motion.p>

            {/* Arch — centered horizontally, flush to bottom */}
            <div className="flex justify-center flex-1 items-end">
              <div
                className="bg-white"
                style={{
                  width: "clamp(200px, 30vw, 380px)",
                  height: "clamp(260px, 42vw, 520px)",
                  borderRadius: "50% 50% 0 0 / 30% 30% 0 0",
                }}
              />
            </div>

            {/* Description — bottom right */}
            <p className={`absolute bottom-8 right-8 md:right-14 text-xs md:text-sm leading-relaxed max-w-[180px] md:max-w-[220px] text-right ${step.titleColor} opacity-80`}>
              {step.description}
            </p>

            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-black/10">
              <div
                className={`h-full ${step.progressColor} opacity-70 transition-none`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Step indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {steps.map((s, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === active
                  ? `w-8 ${s.progressColor} opacity-80`
                  : "w-1.5 bg-black/20"
              }`}
            />
          ))}
        </div>
      </div>

    </section>
  );
}
