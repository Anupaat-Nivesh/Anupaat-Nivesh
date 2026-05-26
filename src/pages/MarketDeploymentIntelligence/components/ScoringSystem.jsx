import React from "react";
import { motion } from "framer-motion";
import SectionIntro from "./SectionIntro";
import AnimatedScoreDemo from "./AnimatedScoreDemo";

const STEPS = [
  { label: "Raw Market Data", detail: "Prices, yields, fundamentals" },
  { label: "Valuation Frameworks", detail: "PE, PBV, Shiller PE, Buffett ratio, yields" },
  { label: "Probability Engine", detail: "Normalization & Bayesian-style scoring" },
  { label: "Unified Data Science Score", detail: "Single interpretable index" },
  { label: "Actionable Allocation Signals", detail: "STP, sleeves, risk bands" },
];

export default function ScoringSystem() {
  return (
    <section className="border-b border-mdif-line bg-mdif-canvas py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-mdif-brand sm:text-base">
            Optional detail
          </p>
          <h2 className="mt-3 text-2xl font-semibold leading-tight text-mdif-text sm:text-3xl md:text-4xl">
            How the score is built
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-mdif-textMuted sm:text-xl sm:leading-relaxed">
            Skip this if you only want the simple story. Open it to see{" "}
            <strong className="font-semibold text-mdif-text">valuation channels</strong>,{" "}
            <strong className="font-semibold text-mdif-text">engine steps</strong>, and a sample
            animation.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="mt-10"
        >
          <details className="mdif-scoring-details group overflow-hidden rounded-2xl border-2 border-mdif-brand/25 bg-mdif-surface shadow-[0_16px_48px_-20px_rgba(0,0,0,0.12)] open:border-mdif-brand/45 open:shadow-[0_20px_56px_-16px_rgba(254,1,1,0.18)]">
            <summary className="mdif-scoring-summary flex cursor-pointer list-none items-center gap-4 px-5 py-6 transition hover:bg-mdif-muted/50 sm:gap-6 sm:px-8 sm:py-8 [&::-webkit-details-marker]:hidden">
              <span
                className="mdif-scoring-plus flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-mdif-brand/20 to-mdif-brand/5 text-3xl font-light leading-none text-mdif-brand shadow-inner ring-2 ring-mdif-brand/25 sm:h-16 sm:w-16 sm:text-4xl"
                aria-hidden
              >
                +
              </span>
              <span className="text-left text-lg font-semibold leading-snug text-mdif-text sm:text-2xl md:text-[1.65rem] md:leading-tight">
                Show valuation detail — channels, engine steps &amp; animated score
              </span>
            </summary>

            <div className="border-t border-mdif-line px-5 pb-10 pt-8 sm:px-8 sm:pb-12">
              <SectionIntro
                eyebrow="How MarketCompass scores"
                title="From raw metrics to a single probability posture"
                description="Classic valuation ratios are informative but noisy in isolation. The MarketCompass engine fuses PE, PBV, Shiller-type reads, earnings yield, and bond–equity relationships into a disciplined score you can deploy against — the same philosophy we walk through in client sessions, packaged for daily use."
              />

              <div className="mb-10 rounded-xl border border-mdif-line bg-mdif-muted/50 px-5 py-6 sm:px-8 sm:py-7">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-mdif-textSoft sm:text-base">
                  Valuation channels (non-exhaustive)
                </p>
                <p className="mt-4 text-base leading-relaxed text-mdif-textMuted sm:text-lg sm:leading-relaxed">
                  PE · PBV · Shiller CAPE · Buffett ratio · Bond–equity yield spreads · Earnings yield — each
                  normalized, de-noised, and fused into the composite probability surface.
                </p>
              </div>

              <div className="mb-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {STEPS.map((step, i) => (
                  <motion.div
                    key={step.label}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-30px" }}
                    transition={{ delay: i * 0.06, duration: 0.45 }}
                    className="flex min-h-[140px] flex-col rounded-xl border border-mdif-line bg-mdif-canvas px-5 py-5 text-center shadow-sm sm:min-h-[150px]"
                  >
                    <span className="text-xs font-semibold uppercase tracking-[0.12em] text-mdif-textSoft sm:text-[13px]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="mt-3 text-base font-semibold leading-snug text-mdif-text sm:text-lg">
                      {step.label}
                    </span>
                    <span className="mt-3 text-xs leading-snug text-mdif-textMuted sm:text-[13px] sm:leading-relaxed">
                      {step.detail}
                    </span>
                  </motion.div>
                ))}
              </div>

              <div className="rounded-2xl border border-mdif-line bg-mdif-canvas p-6 shadow-sm sm:p-8 md:p-10">
                <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h3 className="text-2xl font-semibold text-mdif-text sm:text-3xl">Animated score examples</h3>
                    <p className="mt-4 max-w-xl text-base leading-relaxed text-mdif-textMuted sm:text-lg">
                      Lower readings imply a higher probability of a favourable deployment backdrop. Higher readings
                      indicate thinner margins of safety — a posture read, not a price target.
                    </p>
                  </div>
                  <div className="shrink-0 space-y-2 text-sm leading-relaxed text-mdif-textMuted sm:text-base">
                    <div>
                      <span className="font-semibold text-emerald-800">0.0–0.6</span> — supportive
                    </div>
                    <div>
                      <span className="font-semibold text-amber-800">~1.0</span> — caution
                    </div>
                    <div>
                      <span className="font-semibold text-red-800">1.5+</span> — risky
                    </div>
                  </div>
                </div>
                <AnimatedScoreDemo />
              </div>
            </div>
          </details>
        </motion.div>
      </div>
      <style>{`
        .mdif-scoring-details[open] .mdif-scoring-plus {
          transform: rotate(45deg);
          background: linear-gradient(135deg, rgba(254,1,1,0.35), rgba(254,1,1,0.12));
          color: #fff;
        }
        .mdif-scoring-plus {
          transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), background 0.3s ease, color 0.3s ease;
        }
      `}</style>
    </section>
  );
}
