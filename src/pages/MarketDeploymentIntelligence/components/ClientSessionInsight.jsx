import React from "react";
import { motion } from "framer-motion";

const zones = [
  {
    key: "supportive",
    label: "Supportive zone",
    short: "More margin of safety for equities",
    read: "The model sees a wider comfort band for broad equities versus recent history.",
    nudge: "Lump sum or higher equity weight may fit your plan — confirm with your advisor.",
    bar: "bg-emerald-600",
    chip: "bg-emerald-100 text-emerald-900 ring-emerald-200",
    panel: "border-emerald-200 bg-emerald-50/80",
  },
  {
    key: "caution",
    label: "Caution zone",
    short: "Volatility can bite faster",
    read: "Odds are more balanced; mistakes in sizing hurt sooner.",
    nudge: "Prefer step-by-step investing (STP) and smaller equity bites.",
    bar: "bg-amber-500",
    chip: "bg-amber-100 text-amber-950 ring-amber-200",
    panel: "border-amber-200 bg-amber-50/85",
  },
  {
    key: "risky",
    label: "Risky zone",
    short: "Thin cushion for broad equities",
    read: "The model sees fewer favourable odds for aggressive equity deployment.",
    nudge: "Ease aggression; add stability (debt / liquid) as per your policy.",
    bar: "bg-red-600",
    chip: "bg-red-100 text-red-900 ring-red-200",
    panel: "border-red-200 bg-red-50/80",
  },
];

export default function ClientSessionInsight() {
  return (
    <section className="border-b border-mdif-line bg-mdif-surface py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border-l-4 border-mdif-brand bg-[rgba(254,1,1,0.05)] px-6 py-8 sm:px-9 sm:py-10"
          >
            <p className="font-mono text-sm font-semibold uppercase tracking-[0.16em] text-mdif-brand sm:text-[0.9375rem]">
              From our client sessions
            </p>
            <blockquote className="mt-5 text-xl font-semibold leading-[1.55] text-mdif-text sm:text-2xl sm:leading-snug">
              “We do not guess the next week’s move. We look at{" "}
              <span className="text-mdif-brand">where the market stands today</span> — then decide
              how fast to invest and how much equity fits your plan.”
            </blockquote>
            <p className="mt-6 text-lg leading-relaxed text-mdif-textMuted sm:text-[1.125rem] sm:leading-relaxed">
              First answers families need: <strong className="text-mdif-text">timing</strong> (full
              invest vs step-by-step) and <strong className="text-mdif-text">where</strong> (large vs
              mid/small, equity vs debt). Fund names come after that.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: 0.06 }}
            className="space-y-5"
          >
            <div className="rounded-xl border border-mdif-line bg-slate-900 px-5 py-4 text-center sm:px-6">
              <p className="font-mono text-sm font-semibold uppercase tracking-wider text-white sm:text-[0.9375rem]">
                How scores translate (illustrative)
              </p>
              <p className="mt-2 text-sm text-white/80 sm:text-[0.9375rem]">
                Colour bands mirror how we read posture — not live data.
              </p>
            </div>

            {zones.map((z, i) => (
              <motion.article
                key={z.key}
                initial={{ opacity: 0, x: 10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
                className={[
                  "overflow-hidden rounded-2xl border-2 shadow-sm ring-1 ring-black/5 transition hover:shadow-md",
                  z.panel,
                ].join(" ")}
              >
                <div className={`h-1.5 w-full ${z.bar}`} aria-hidden />
                <div className="px-5 py-5 sm:px-6 sm:py-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={[
                        "inline-flex rounded-full px-3 py-1 text-sm font-bold uppercase tracking-wide ring-1 sm:text-[0.9375rem]",
                        z.chip,
                      ].join(" ")}
                    >
                      {z.label}
                    </span>
                    <span className="text-base font-medium text-mdif-text sm:text-lg">{z.short}</span>
                  </div>
                  <p className="mt-4 text-base font-medium leading-relaxed text-mdif-text sm:text-lg sm:leading-relaxed">
                    {z.read}
                  </p>
                  <p className="mt-3 text-base leading-relaxed text-mdif-textMuted sm:text-[1.0625rem]">
                    <span className="font-semibold text-mdif-text">What it suggests: </span>
                    {z.nudge}
                  </p>
                </div>
              </motion.article>
            ))}

            <p className="rounded-xl border border-mdif-line bg-mdif-canvas px-5 py-4 text-center text-[0.9375rem] leading-relaxed text-mdif-textMuted sm:text-base">
              Example only — <strong className="font-semibold text-mdif-text">not</strong> live data
              or personal advice. Your advisor still applies goals, taxes, and liquidity.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
