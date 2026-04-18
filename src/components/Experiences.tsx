"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const experiences = [
  {
    role: "Employee",
    description: "Order, track, and pay in seconds",
    icon: "/icons/employee.svg",
    offset: 0,
    rotate: -3,
  },
  {
    role: "Washerman",
    description: "Manage orders, grow earnings",
    icon: "/icons/washerman.svg",
    offset: -32,
    rotate: 2,
  },
  {
    role: "Company",
    description: "Control Budgets and Reporting",
    icon: "/icons/company.svg",
    offset: 0,
    rotate: -1.5,
  },
  {
    role: "Admin",
    description: "Full Platform Oversight",
    icon: "/icons/admin.svg",
    offset: 16,
    rotate: 3,
  },
];

export default function Experiences() {
  return (
    <section id="experiences" className="relative w-full bg-white py-20 lg:py-28 overflow-hidden">

      {/* Ghost watermark */}
      <span
        aria-hidden
        className="pointer-events-none select-none absolute inset-0 flex flex-col items-center justify-start pt-8 font-display uppercase leading-none text-[clamp(4rem,13vw,11rem)] text-gray-100 tracking-wide text-center"
      >
        <span>BUILT FOR</span>
        <span>EVERYONE</span>
      </span>

      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8 flex flex-col items-center gap-12">

        {/* Headline */}
        <div className="text-center">
          <h2 className="font-display text-[clamp(2.4rem,6vw,5.5rem)] text-wm-green uppercase leading-tight tracking-wide">
            One Platform,<br />Four Experiences
          </h2>
          <p className="mt-6 text-gray-500 text-base leading-relaxed max-w-md mx-auto">
            Whether you&apos;re placing an order, fulfilling one, managing a team,
            or running the platform — Washermann has a tailored experience for you.
          </p>
        </div>

        {/* Cards */}
        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
          {experiences.map((exp, i) => (
            <motion.div
              key={exp.role}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: exp.offset }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
              whileHover={{ y: (exp.offset ?? 0) - 8, transition: { type: "spring", stiffness: 300, damping: 20 } }}
              className="bg-wm-green rounded-3xl flex flex-col items-center justify-between px-5 py-8 gap-6 cursor-default"
              style={{ minHeight: "clamp(180px, 25vw, 260px)", rotate: `${exp.rotate}deg` }}
            >
              {/* Icon */}
              <div className="w-12 h-12 flex items-center justify-center">
                <Image
                  src={exp.icon}
                  alt={exp.role}
                  width={44}
                  height={44}
                  className="w-full h-full object-contain"
                  style={{ filter: "brightness(0) invert(1)" }}
                />
              </div>

              {/* Role + description */}
              <div className="flex flex-col items-center gap-2 text-center mt-auto">
                <p className="font-body text-white text-[clamp(1.6rem,3vw,2.2rem)] font-medium leading-tight">
                  {exp.role}
                </p>
                <p className="text-white/60 text-xs leading-snug">
                  {exp.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
