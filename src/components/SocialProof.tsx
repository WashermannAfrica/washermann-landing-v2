"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

/* ── Testimonials (9 total → 3 groups of 3) ── */
const TESTIMONIALS = [
  // Group 0
  { photo: "/testimonials/1.jpg", title: "Fresh Every Monday",    quote: "Our team starts the week right — laundry sorted, no drama."          },
  { photo: "/testimonials/2.jpg", title: "HR's Favourite Perk",   quote: "Easiest benefit we've ever rolled out. Staff love it."                 },
  { photo: "/testimonials/3.jpg", title: "Zero Laundry Day",      quote: "We removed laundry day from the team's vocabulary entirely."           },
  // Group 1
  { photo: "/testimonials/4.jpg", title: "Spotless Record",       quote: "Every order on time, every item returned perfect. Impressive."         },
  { photo: "/testimonials/5.jpg", title: "Best Benefit Ever",     quote: "Beats the free coffee. Everyone asks about the laundry perk first."    },
  { photo: "/testimonials/6.jpg", title: "No More Stress",        quote: "I stopped worrying about clothes on Sunday nights. Game changer."      },
  // Group 2
  { photo: "/testimonials/7.jpg", title: "Clean Start Weekly",    quote: "Our team is happier and honestly better dressed. Highly recommend."    },
  { photo: "/testimonials/8.jpg", title: "Saves Hours Monthly",   quote: "Between 6 staff, we're saving 12+ hours of laundry time every month." },
  { photo: "/testimonials/9.jpg", title: "Staff Love It",         quote: "Retention went up. I'm only half joking that laundry is the reason."  },
];

const GROUP_SIZE   = 3;
const NUM_GROUPS   = TESTIMONIALS.length / GROUP_SIZE; // 3
const FIRST_DELAY  = 900;   // ms before first card slides in
const BUILD_DELAY  = 2600;  // ms between each card (reading time)
const HOLD_MS      = 5000;  // ms all 3 cards stay visible before exiting
const EXIT_WAIT_MS = 700;   // ms for exit animations to finish before next group

/* Fan positions — relative to container centre (desktop) */
const FAN_LG: { x: number; rotate: number; zIndex: number }[] = [
  { x: -185, rotate: -8, zIndex: 1 },
  { x:    0, rotate:  2, zIndex: 3 },
  { x:  185, rotate:  8, zIndex: 2 },
];

/* Fan positions — mobile (narrower container) */
const FAN_SM: { x: number; rotate: number; zIndex: number }[] = [
  { x: -98, rotate: -8, zIndex: 1 },
  { x:   0, rotate:  2, zIndex: 3 },
  { x:  98, rotate:  8, zIndex: 2 },
];

type Phase = "building" | "holding" | "waiting";

export default function SocialProof() {
  const [phase,      setPhase]      = useState<Phase>("building");
  const [groupIdx,   setGroupIdx]   = useState(0);
  const [builtCount, setBuiltCount] = useState(0);

  const currentCards = TESTIMONIALS.slice(
    groupIdx * GROUP_SIZE,
    groupIdx * GROUP_SIZE + GROUP_SIZE,
  );

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;

    if (phase === "building") {
      if (builtCount < GROUP_SIZE) {
        t = setTimeout(
          () => setBuiltCount((c) => c + 1),
          builtCount === 0 ? FIRST_DELAY : BUILD_DELAY,
        );
      } else {
        setPhase("holding");
      }
    } else if (phase === "holding") {
      t = setTimeout(() => setPhase("waiting"), HOLD_MS);
    } else if (phase === "waiting") {
      t = setTimeout(() => {
        setGroupIdx((g) => (g + 1) % NUM_GROUPS);
        setBuiltCount(0);
        setPhase("building");
      }, EXIT_WAIT_MS);
    }

    return () => clearTimeout(t);
  }, [phase, builtCount]);

  const showCards = phase !== "waiting";

  return (
    <section className="relative w-full bg-wm-green overflow-hidden flex flex-col md:flex-row">

      {/* ── Top (mobile) / Left (desktop): ghost + headline — ALWAYS VISIBLE ── */}
      <div className="relative w-full md:w-1/2 flex items-center px-8 md:px-16 py-12 md:py-16 overflow-hidden">

        {/* Ghost watermark */}
        <span
          aria-hidden
          className="pointer-events-none select-none absolute inset-0 flex flex-col justify-center pl-8 md:pl-16 font-display uppercase leading-none text-[clamp(4rem,10vw,9rem)] text-white/[0.06] tracking-wide"
        >
          <span>LOVELY</span>
          <span>REVIEWS</span>
        </span>

        {/* Headline — no animation, always visible */}
        <h2 className="relative z-10 font-display text-[clamp(2.4rem,4.8vw,5rem)] text-wm-mint uppercase leading-tight tracking-wide">
          Teams love it.<br />HR teams love<br />it more.
        </h2>
      </div>

      {/* ── Bottom (mobile) / Right (desktop): fan of cards ── */}
      <div
        className="relative w-full md:w-1/2 flex items-center justify-center overflow-hidden"
        style={{ minHeight: "42vw", maxHeight: "none" }}
      >
        {/* Mobile cards (sm) */}
        <div className="md:hidden relative w-full flex items-center justify-center" style={{ height: 260 }}>
          <AnimatePresence>
            {currentCards.map((card, i) =>
              i < builtCount && showCards ? (
                <motion.div
                  key={`sm-${groupIdx}-${i}`}
                  initial={{ x: 320, y: 30, rotate: 0, opacity: 0 }}
                  animate={{ x: FAN_SM[i].x, y: 0, rotate: FAN_SM[i].rotate, opacity: 1 }}
                  exit={{ x: 320, y: 30, rotate: 0, opacity: 0, transition: { duration: 0.4, delay: i * 0.05 } }}
                  transition={{ type: "spring", stiffness: 220, damping: 26 }}
                  className="absolute"
                  style={{ zIndex: FAN_SM[i].zIndex }}
                >
                  <PolaroidCard card={card} size="sm" />
                </motion.div>
              ) : null
            )}
          </AnimatePresence>
        </div>

        {/* Desktop cards (lg) */}
        <div className="hidden md:flex relative w-full items-center justify-center" style={{ height: 420 }}>
          <AnimatePresence>
            {currentCards.map((card, i) =>
              i < builtCount && showCards ? (
                <motion.div
                  key={`lg-${groupIdx}-${i}`}
                  initial={{ x: 420, y: 60, rotate: 0, opacity: 0 }}
                  animate={{ x: FAN_LG[i].x, y: 0, rotate: FAN_LG[i].rotate, opacity: 1 }}
                  exit={{ x: 420, y: 60, rotate: 0, opacity: 0, transition: { duration: 0.5, delay: i * 0.06 } }}
                  transition={{ type: "spring", stiffness: 200, damping: 24 }}
                  className="absolute"
                  style={{ zIndex: FAN_LG[i].zIndex }}
                >
                  <PolaroidCard card={card} size="lg" />
                </motion.div>
              ) : null
            )}
          </AnimatePresence>
        </div>

        {/* Group indicator dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {Array.from({ length: NUM_GROUPS }).map((_, i) => (
            <span
              key={i}
              className={`block h-1.5 rounded-full transition-all duration-300 ${
                i === groupIdx ? "w-5 bg-wm-mint" : "w-1.5 bg-white/20"
              }`}
            />
          ))}
        </div>
      </div>

    </section>
  );
}

/* ── Card: large photo with title overlay, quote below ── */
function PolaroidCard({
  card,
  size,
}: {
  card: (typeof TESTIMONIALS)[0];
  size: "sm" | "lg";
}) {
  const lg = size === "lg";

  const cardW   = lg ? 270 : 155;
  const cardH   = lg ? 370 : 215;
  const photoH  = lg ? 235 : 135;
  const radius  = lg ? 18  : 12;
  const titleSz = lg ? 16  : 10;
  const quoteSz = lg ? 12  : 8;
  const padX    = lg ? 16  : 10;
  const padY    = lg ? 14  : 9;

  return (
    <div
      className="bg-white shadow-2xl flex flex-col overflow-hidden"
      style={{ width: cardW, height: cardH, borderRadius: radius }}
    >
      {/* Photo + gradient + title overlay */}
      <div className="relative flex-shrink-0" style={{ height: photoH }}>
        <Image src={card.photo} alt={card.title} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <p
          className="absolute bottom-0 left-0 right-0 text-white font-semibold leading-snug"
          style={{ fontSize: titleSz, padding: `${padY}px ${padX}px` }}
        >
          {card.title}
        </p>
      </div>

      {/* Quote */}
      <div
        className="flex-1 flex items-center justify-center"
        style={{ padding: `${padY}px ${padX}px` }}
      >
        <p
          className="text-gray-400 leading-snug text-center"
          style={{ fontSize: quoteSz }}
        >
          {card.quote}
        </p>
      </div>
    </div>
  );
}
