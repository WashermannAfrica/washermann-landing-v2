"use client";

import { motion } from "framer-motion";
import { useMenu } from "@/context/menu-context";

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  const { megaOpen } = useMenu();

  return (
    <motion.div
      animate={{ x: megaOpen ? "-100%" : "0%" }}
      transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}
