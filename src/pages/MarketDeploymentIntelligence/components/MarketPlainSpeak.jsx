import React from "react";
import { motion } from "framer-motion";

const POINTS = [
  {
    title: "When should I buy?",
    body: "Fresh money gets a clear nudge: sometimes it is better to go step-by-step (STP), sometimes a lump sum fits the backdrop — based on how expensive or supportive the broad market looks, not on TV noise.",
  },
  {
    title: "Where should I invest?",
    body: "You see a simple read for overall equity versus safer buckets, and how much to lean into different parts of the market — before picking specific funds or schemes.",
  },
  {
    title: "Tested on 20+ years of data",
    body: "The approach is checked across long history: bull runs, crashes, sideways years, rate cycles, and stress periods so the signals are not tuned to one lucky phase.",
  },
  {
    title: "Event risk and system risk",
    body: "History includes sharp shocks from news and politics (elections, wars, trade tensions) and slow burns from valuations or financial stress. The model learns how markets behaved across both, not from one headline day.",
  },
];

export default function MarketPlainSpeak() {
  return (
    <section className="border-b border-mdif-line bg-mdif-surface py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="font-mono text-[13px] font-semibold uppercase tracking-[0.16em] text-mdif-brand sm:text-sm">
            Plain language
          </p>
          <h2 className="mt-3 text-2xl font-semibold leading-tight text-mdif-text sm:text-3xl sm:leading-tight">
            Built for families who want clarity, not jargon
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-mdif-textMuted sm:text-xl sm:leading-relaxed">
            Clear guidance for investors everywhere — the same discipline we use in reviews, in
            simple language.
          </p>
        </motion.div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {POINTS.map((p, i) => (
            <motion.article
              key={p.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ delay: i * 0.05, duration: 0.45 }}
              className="rounded-2xl border border-mdif-line bg-mdif-canvas p-6 shadow-sm sm:p-7"
            >
              <h3 className="text-lg font-semibold text-mdif-text sm:text-xl">{p.title}</h3>
              <p className="mt-3 text-base leading-relaxed text-mdif-textMuted sm:text-[1.0625rem] sm:leading-relaxed">
                {p.body}
              </p>
            </motion.article>
          ))}
        </div>
        <p className="mx-auto mt-10 max-w-2xl text-center text-base leading-relaxed text-mdif-text sm:text-lg">
          <strong className="font-semibold text-mdif-text">Not tips. Not a return promise.</strong> A
          disciplined read of market conditions — including stress you see in the news.
        </p>
      </div>
    </section>
  );
}
