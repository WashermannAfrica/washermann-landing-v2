"use client";

import { motion } from "framer-motion";

const POINTS = [
  {
    n: "01",
    title: "Your clothes back. Fast.",
    body: "Schedule a pickup at a time that works for you. We take it from there — clean, folded, and back at your door. Tracked every step of the way.",
  },
  {
    n: "02",
    title: "Track every step, live.",
    body: "A real-time progress bar shows exactly where your order is. No calling. No guessing. Just complete visibility from pickup to delivery.",
  },
  {
    n: "03",
    title: "Every washerman vetted and rated.",
    body: "Only background-checked, rated professionals handle your clothes. No strangers. No guesswork. Every time.",
  },
];

export default function WhyWashermann() {
  return (
    <section id="why" className="bg-wm-mint-soft">
      <div className="mx-auto max-w-5xl px-6 py-20 md:py-28">
        <div className="max-w-2xl">
          <h2 className="font-display text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.05] tracking-tight text-wm-green">
            Somewhere between life and work — laundry keeps showing up.
          </h2>
          <p className="mt-6 font-body text-base leading-relaxed text-wm-green/75">
            You&apos;re already making big moves — building a career, showing up every day, keeping
            life running on the margins of a full week. The last thing that should drain your energy
            is laundry. Washermann was built for people exactly like you. It&apos;s also a workplace
            benefit companies can offer their teams: door-to-door pickup, professional cleaning, and
            delivery back to you.
          </p>
        </div>

        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {POINTS.map((p, i) => (
            <motion.div
              key={p.n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="font-display text-5xl leading-none tracking-tight text-wm-green/30">
                {p.n}
              </div>
              <h3 className="mt-4 font-display text-2xl tracking-tight text-wm-green">{p.title}</h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-wm-green/70">{p.body}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-14">
          <a
            href="#waitlist"
            className="inline-flex h-12 items-center justify-center rounded-full bg-wm-mint-btn px-7 font-body text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
          >
            → Join the Waitlist
          </a>
        </div>
      </div>
    </section>
  );
}
