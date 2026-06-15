"use client";

import { useState } from "react";

type Feature = {
  title: string;
  body: string;
  bg: string;
  dot: string;
};

const FEATURES: Feature[] = [
  {
    title: "Payment protected",
    body: "Funds are held securely and only released when your delivery is confirmed. No delivery, no charge. Your money is never at risk.",
    bg: "bg-wm-mint-soft",
    dot: "bg-wm-pink",
  },
  {
    title: "Real-time tracking",
    body: "A live progress bar from pickup to delivery. Picked up → Cleaning → Ready → On the way. You always know exactly where your clothes are.",
    bg: "bg-wm-peach",
    dot: "bg-wm-orange",
  },
  {
    title: "Vetted professionals",
    body: "Every Wash Rep is background-checked, trained, and rated by real customers. Your clothes are always in good hands.",
    bg: "bg-wm-pink-soft",
    dot: "bg-wm-pink",
  },
  {
    title: "Gift a laundry-free week",
    body: "Take laundry off someone else's list too. Send a Washermann gift to anyone you care about — clean clothes make a genuinely useful gift.",
    bg: "bg-wm-cream",
    dot: "bg-wm-lime",
  },
  {
    title: "Earn WashPoints",
    body: "Every order earns WashPoints — Washermann's rewards currency. Stack them up and spend them on future pickups.",
    bg: "bg-wm-mint-soft",
    dot: "bg-wm-orange",
  },
];

export default function Features() {
  const [active, setActive] = useState(0);

  return (
    <section id="features" className="bg-white">
      <div className="mx-auto max-w-6xl px-6 pb-20 pt-20 md:pb-28 md:pt-28">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="font-body text-sm font-semibold uppercase tracking-widest text-wm-green/50">
            Built Different
          </span>
          <h2 className="mt-3 font-display text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.02] tracking-tight text-wm-green">
            If you hate doing laundry, you&apos;ll love this.
          </h2>
        </div>

        <div className="flex h-[460px] gap-2.5">
          {FEATURES.map((f, i) => {
            const isActive = i === active;
            return (
              <button
                key={f.title}
                onClick={() => setActive(i)}
                aria-expanded={isActive}
                className={`relative overflow-hidden rounded-t-[2.5rem] text-left transition-[flex-grow] duration-500 ease-in-out ${f.bg} ${
                  isActive ? "flex-[7]" : "flex-[1]"
                }`}
              >
                <span className={`absolute left-1/2 top-6 h-5 w-5 -translate-x-1/2 rounded-full ${f.dot} ${isActive ? "md:left-8 md:translate-x-0" : ""}`} />

                {isActive ? (
                  <div className="flex h-full flex-col justify-start px-8 pt-16 md:px-10">
                    <h3 className="font-display text-3xl tracking-tight text-wm-green md:text-4xl">
                      {f.title}
                    </h3>
                    <p className="mt-4 max-w-sm font-body text-sm leading-relaxed text-wm-green/80">
                      {f.body}
                    </p>
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center pt-10">
                    <span className="font-display text-xl tracking-tight text-wm-green [writing-mode:vertical-rl] rotate-180">
                      {f.title}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
