"use client";

import { motion } from "framer-motion";

const HEAD =
  "font-display text-[clamp(2.5rem,7.5vw,5.75rem)] leading-[0.98] tracking-tight text-wm-mint";

export default function Hero() {
  return (
    <section id="top" className="relative bg-wm-green overflow-hidden">
      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 pb-4 pt-32 text-center sm:pt-36">
        {/* Headline */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } } }}
          className="flex flex-col items-center gap-1"
        >
          <motion.h1 variants={fadeUp} className={HEAD}>
            You&apos;ve got 99 things to do.
          </motion.h1>
          <motion.div variants={fadeUp} className="relative my-1 inline-flex items-center justify-center">
            <span aria-hidden className="absolute inset-0 -mx-6 rounded-full bg-wm-pink" style={{ transform: "rotate(-2deg)" }} />
            <span className={`relative px-6 ${HEAD} text-white!`}>Laundry shouldn&apos;t be one</span>
          </motion.div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.5 }}
          className="mt-7 max-w-xl font-body text-base leading-relaxed text-white/80 sm:text-lg"
        >
          Washermann is the productivity and lifestyle brand built for Nigeria&apos;s working
          professionals. We show up to handle that laundry bag — while you focus on getting the bag.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mt-8 flex flex-col items-center gap-3 sm:flex-row"
        >
          <a
            href="#waitlist"
            className="inline-flex h-12 items-center justify-center rounded-full bg-wm-mint-btn px-7 font-body text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
          >
            Join the Waitlist
          </a>
          <a
            href="#how-it-works"
            className="inline-flex h-12 items-center justify-center rounded-full bg-white px-7 font-body text-sm font-semibold text-wm-green transition-transform hover:scale-[1.03]"
          >
            See How It Works
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="mt-5 font-body text-sm text-white/55"
        >
          Be the first to know when we launch — and enjoy exclusive launch rewards.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        className="relative z-10 mx-auto w-full max-w-2xl px-6 pb-2"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/illustrations/hero.png" alt="Relax while we handle the laundry" className="mx-auto w-full" />
      </motion.div>
    </section>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
// eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;
