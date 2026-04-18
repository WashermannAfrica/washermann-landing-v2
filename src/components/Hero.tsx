"use client";

import { motion } from "framer-motion";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const stagger: any = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fadeUp: any = {
  hidden: { opacity: 0, y: 40 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.65, ease: "easeOut" } },
};

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-wm-green flex items-center justify-center overflow-hidden">
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 pt-28 pb-20 flex flex-col items-center text-center gap-10">

        {/* Headline */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center gap-0"
        >
          {/* Line 1 */}
          <motion.h1
            variants={fadeUp}
            className="font-display text-[clamp(3.5rem,10vw,8rem)] leading-[0.95] tracking-wide text-wm-mint uppercase"
          >
            Clean Clothes,
          </motion.h1>

          {/* Line 2 — white text on pink pill */}
          <motion.div variants={fadeUp} className="relative z-0 inline-flex items-center justify-center">
            {/* Pink pill background — slightly rotated */}
            <span
              aria-hidden
              className="absolute inset-0 bg-wm-pink rounded-[3.5rem] scale-x-[1.08] scale-y-[1.15]"
              style={{ transform: "rotate(-4.5deg) scaleX(1.08) scaleY(1.06)" }}
            />
            <h1
              className="relative font-display text-[clamp(3.5rem,10vw,8rem)] leading-[0.95] tracking-wide text-white uppercase px-2"
              style={{ transform: "rotate(-4.5deg)" }}
            >
              Zero Effort,
            </h1>
          </motion.div>

          {/* Line 3 */}
          <motion.h1
            variants={fadeUp}
            className="relative z-10 font-display text-[clamp(3.5rem,10vw,8rem)] leading-[0.95] tracking-wide text-wm-mint uppercase"
          >
            Happy Teams.
          </motion.h1>
        </motion.div>

        {/* Body copy */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.6 }}
          className="text-white/75 text-lg sm:text-xl leading-relaxed max-w-xl"
        >
          Washermann connects employees to trusted local laundry
          professionals — while giving companies full control over budgets,
          benefits, and reporting. No more laundry day. Ever.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center"
        >
          <motion.a
            href="#cta"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full sm:w-56 flex items-center justify-center bg-wm-mint text-wm-green font-semibold text-base rounded-2xl h-[68px] hover:bg-wm-mint/90 transition-colors"
          >
            Start for free
          </motion.a>
          <motion.a
            href="#how-it-works"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full sm:w-56 flex items-center justify-center bg-white text-wm-green font-semibold text-base rounded-2xl h-[68px] hover:bg-white/90 transition-colors"
          >
            See how it works
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
