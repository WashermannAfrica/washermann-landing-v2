"use client";

import { motion } from "framer-motion";

type Step = {
  label: string;
  title: string[];
  body: string;
  img: string;
  bg: string;
  fg: string;
};

const STEPS: Step[] = [
  {
    label: "Step 1",
    title: ["Book a", "pickup"],
    body: "Open the app and choose a time that works for you. Your assigned Wash Rep confirms within minutes.",
    img: "/illustrations/step-schedule.png",
    bg: "bg-wm-mint-soft",
    fg: "text-wm-green",
  },
  {
    label: "Step 2",
    title: ["We handle", "everything"],
    body: "Pickup, cleaning by vetted laundry professionals, quality check, and packaging — all handled for you.",
    img: "/illustrations/step-wash.png",
    bg: "bg-wm-cream",
    fg: "text-[#55611c]",
  },
  {
    label: "Step 3",
    title: ["Delivered", "fresh"],
    body: "Your clothes come back clean, folded, and ready — tracked in real time from the moment we collect to the moment we deliver.",
    img: "/illustrations/step-delivered.png",
    bg: "bg-wm-pink-soft",
    fg: "text-wm-pink",
  },
];

function StepBand({ step }: { step: Step }) {
  return (
    <section className={step.bg}>
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-6 px-6 py-16 md:grid-cols-2 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="md:pt-10"
        >
          <span className={`font-body text-sm font-semibold uppercase tracking-widest ${step.fg} opacity-60`}>
            {step.label}
          </span>
          <h3 className={`mt-2 font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.95] tracking-tight ${step.fg}`}>
            {step.title.map((t) => (
              <span key={t} className="block">
                {t}
              </span>
            ))}
          </h3>
        </motion.div>

        <div className="flex flex-col items-end">
          <motion.img
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            src={step.img}
            alt=""
            className="w-full max-w-md"
          />
          <p className={`mt-2 max-w-xs text-right font-body text-sm leading-relaxed ${step.fg}`}>
            {step.body}
          </p>
        </div>
      </div>
    </section>
  );
}

export default function HowItWorks() {
  return (
    <div id="how-it-works">
      {/* Section header (mint, flows from Why Washermann) */}
      <div className="bg-wm-mint-soft">
        <div className="mx-auto max-w-4xl px-6 pt-16 text-center md:pt-24">
          <span className="font-body text-sm font-semibold uppercase tracking-widest text-wm-green/50">
            How It Works
          </span>
          <h2 className="mt-3 font-display text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.02] tracking-tight text-wm-green">
            Switch on zero laundry days.
          </h2>
        </div>
      </div>

      <StepBand step={STEPS[0]} />
      <StepBand step={STEPS[1]} />
      <StepBand step={STEPS[2]} />
    </div>
  );
}
