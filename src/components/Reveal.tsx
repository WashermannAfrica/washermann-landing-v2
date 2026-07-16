"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Scroll-reveal wrapper — a gentle fade + rise as a section scrolls into view.
 *
 * Robust by construction: the server renders children fully VISIBLE (no inline
 * style), so if JS never runs, is disabled, or an animation frame is throttled,
 * the content is always there — a landing section can never get stuck blank.
 * Only on the client, and only for sections that start BELOW the fold, do we
 * arm the hidden→reveal transition (IntersectionObserver + CSS transition, with
 * a safety timeout). Above-fold sections and reduced-motion users show instantly
 * with no flash.
 */
export default function Reveal({
  children,
  y = 28,
}: {
  children: React.ReactNode;
  y?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false); // did we take over animation on the client?
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Only animate sections comfortably below the fold — avoids a hide→show flash
    // for anything already visible on load.
    const rect = el.getBoundingClientRect();
    if (reduce || rect.top < window.innerHeight * 0.9) return; // stays visible, no animation

    setArmed(true);

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);

    // Safety net: never leave a section hidden, whatever happens to the observer.
    const t = setTimeout(() => {
      setShown(true);
      io.disconnect();
    }, 4000);

    return () => {
      io.disconnect();
      clearTimeout(t);
    };
  }, []);

  // Not armed → no inline style at all → fully visible (SSR default / reduced-motion / above-fold).
  const style: React.CSSProperties | undefined = armed
    ? {
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : `translateY(${y}px)`,
        transition: "opacity 0.7s cubic-bezier(0.22,1,0.36,1), transform 0.7s cubic-bezier(0.22,1,0.36,1)",
        willChange: "opacity, transform",
      }
    : undefined;

  return (
    <div ref={ref} style={style}>
      {children}
    </div>
  );
}
