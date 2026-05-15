import React from "react";
import { motion } from "framer-motion";

export default function SectionIntro({ eyebrow, title, description, align = "center" }) {
  const alignClass =
    align === "left"
      ? "text-left items-start"
      : "text-center items-center mx-auto";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={`mb-12 flex max-w-3xl flex-col gap-3 sm:mb-14 ${alignClass}`}
    >
      <span className="font-mono text-[12px] font-semibold uppercase tracking-[0.2em] text-mdif-brand">
        {eyebrow}
      </span>
      <h2 className="text-[1.75rem] font-semibold leading-tight tracking-tight text-mdif-text sm:text-4xl sm:leading-tight md:text-[2.25rem]">
        {title}
      </h2>
      {description ? (
        <p className="max-w-2xl text-[1.08rem] leading-[1.68] text-mdif-textMuted sm:text-lg sm:leading-relaxed md:text-[1.125rem]">
          {description}
        </p>
      ) : null}
    </motion.div>
  );
}
