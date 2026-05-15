import React from "react";
import { motion } from "framer-motion";
import SectionIntro from "./SectionIntro";

const PAINS = [
  "Investors often deploy at the wrong phase of the cycle.",
  "Headlines and social narratives hijack allocation decisions.",
  "Emotional rebalancing overrides process.",
  "Static valuation screens miss regime change.",
];

export default function WhyItMatters() {
  return (
    <section className="border-b border-mdif-line bg-mdif-canvas py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionIntro
          eyebrow="Why it matters"
          title="Process breaks when the tape gets loud"
          description="Sophisticated investors still need a consistent translation layer between evidence and action. That is the role of this framework."
        />
        <div className="grid gap-8 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-red-200 bg-red-50/90 p-8 sm:p-9"
          >
            <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-red-800">
              Common failure modes
            </h3>
            <ul className="mt-6 space-y-4">
              {PAINS.map((p) => (
                <li key={p} className="flex gap-3 text-[0.9375rem] leading-relaxed text-mdif-text">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-mdif-brand" />
                  {p}
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex flex-col justify-center rounded-2xl border border-mdif-line bg-mdif-surface p-8 shadow-glass sm:p-9"
          >
            <h3 className="text-2xl font-semibold leading-snug text-mdif-text sm:text-[1.65rem] sm:leading-tight">
              MarketCompass adapts as the cycle moves — scores refresh with incoming data.
            </h3>
            <p className="mt-4 text-[1.0625rem] leading-relaxed text-mdif-textMuted sm:leading-relaxed">
              Scores are recomputed as new data arrives. Allocation guidance shifts with the
              probability surface — preserving institutional discipline without locking you into
              a single static model.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3 font-mono text-[11px]">
              <div className="rounded-lg border border-mdif-line bg-mdif-muted px-3 py-3">
                <div className="text-mdif-textSoft">Research depth</div>
                <div className="mt-1 font-semibold text-mdif-text">Institutional</div>
              </div>
              <div className="rounded-lg border border-mdif-line bg-mdif-muted px-3 py-3">
                <div className="text-mdif-textSoft">Objective</div>
                <div className="mt-1 font-semibold text-mdif-brand">Deployment</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
