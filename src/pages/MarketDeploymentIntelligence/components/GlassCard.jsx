import React from "react";
import { motion } from "framer-motion";

export default function GlassCard({
  children,
  className = "",
  delay = 0,
  hover = true,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={
        hover
          ? {
              y: -3,
              boxShadow:
                "0 0 0 1px rgba(254,1,1,0.12), 0 22px 48px -16px rgba(0,0,0,0.12)",
            }
          : undefined
      }
      className={[
        "rounded-2xl border border-mdif-line bg-mdif-panel p-6 shadow-glass backdrop-blur-sm",
        className,
      ].join(" ")}
    >
      {children}
    </motion.div>
  );
}
