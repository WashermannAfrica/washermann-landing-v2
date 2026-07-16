"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Window-blinds scroll reveal for standout sections. The incoming section is
 * covered by horizontal slats (coloured like the section you're leaving); as it
 * scrolls into view the slats open top-to-bottom in a staggered sweep, then the
 * overlay is removed from the DOM.
 *
 * Robust by construction: the server renders the section fully VISIBLE with no
 * overlay. Only on the client, and only for sections that start below the fold,
 * do we inject the (off-screen) cover. It's pointer-events-none, auto-opens via
 * IntersectionObserver with a 4s safety net, and unmounts after opening — so a
 * section can never end up stuck behind the blinds, and JS-off users just see
 * the section normally.
 */
const SLATS = 9;

export default function BlindsReveal({
  children,
  cover = "#ffffff",
}: {
  children: React.ReactNode;
  cover?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false); // cover injected (closed)
  const [open, setOpen] = useState(false); // slats opening
  const [gone, setGone] = useState(false); // overlay unmounted

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rect = el.getBoundingClientRect();
    // Only cover sections comfortably below the fold — avoids a flash on anything
    // already visible on load.
    if (reduce || rect.top < window.innerHeight * 0.9) return;

    setArmed(true);

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setOpen(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(el);

    // Safety net: never leave a section covered.
    const safety = setTimeout(() => {
      setOpen(true);
      io.disconnect();
    }, 4000);

    return () => {
      io.disconnect();
      clearTimeout(safety);
    };
  }, []);

  // Remove the overlay once the slats have finished opening.
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => setGone(true), 1300);
    return () => clearTimeout(t);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      {children}

      {armed && !gone && (
        <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden" aria-hidden="true">
          {Array.from({ length: SLATS }).map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: `${(i * 100) / SLATS}%`,
                height: `${100 / SLATS + 0.6}%`, // slight overlap hides seams
                background: cover,
                transformOrigin: "top",
                transform: open ? "scaleY(0)" : "scaleY(1)",
                transition: `transform 0.55s cubic-bezier(0.76, 0, 0.24, 1) ${i * 0.05}s`,
                willChange: "transform",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
