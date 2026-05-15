import React from "react";
import { motion } from "framer-motion";
import SectionIntro from "./SectionIntro";

const PILLARS = [
  "No forecasting — we do not claim to know the next move.",
  "No emotional investing — scores replace gut feel at the margin.",
  "No news-driven allocation — narratives and events sit outside the frame.",
  "No static valuation bands — regimes shift; the engine re-benchmarks with data.",
  "Framework-driven deployment — validate advice against the same lens every time.",
  "Probability-based allocation — asset class & category profiling, not stock tips.",
];

export default function PhilosophySection() {
  return (
    <section className="border-b border-mdif-line bg-mdif-surface py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <SectionIntro
            align="left"
            eyebrow="Operating doctrine"
            title="Positioning over prediction"
            description="MarketCompass answers where the market stands today in cycle terms — not where TV says it will go tomorrow. That distinction is what keeps deployment decisions boring, repeatable, and audit-friendly."
          />
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="rounded-2xl border border-mdif-line bg-mdif-muted/50 p-8 shadow-glass sm:p-10"
          >
            <blockquote className="border-l-4 border-blue-900 bg-blue-50/80 px-5 py-4 text-base font-medium leading-relaxed text-slate-900 sm:text-lg sm:leading-relaxed">
              “The framework focuses on where the market stands in the cycle — not where headlines
              think it will go.”
            </blockquote>
            <ul className="mt-8 space-y-5">
              {PILLARS.map((text, i) => (
                <motion.li
                  key={text}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.06 * i, duration: 0.4 }}
                  className="flex items-start gap-4 border-b border-mdif-line pb-5 text-[1.05rem] leading-relaxed text-mdif-text last:border-0 last:pb-0 sm:text-[1.0625rem]"
                >
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 border-mdif-brand bg-[rgba(254,1,1,0.06)] font-mono text-xs font-semibold text-mdif-brand">
                    {i + 1}
                  </span>
                  <span className="pt-0.5">{text}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
