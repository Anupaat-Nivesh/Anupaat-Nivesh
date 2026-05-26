import React from "react";
import GlassCard from "./GlassCard";
import SectionIntro from "./SectionIntro";

function CardIcon({ type }) {
  const common = "h-10 w-10 shrink-0 rounded-xl border border-mdif-line bg-mdif-muted p-2 text-mdif-brand";
  switch (type) {
    case "when":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
          <path d="M12 7v6l4 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "where":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M4 19V5M4 19h16M8 15v4M12 11v8M16 7v12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "trust":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M12 3l2.4 7.4H22l-6 4.6 2.3 7L12 17.8 5.7 22 8 15 2 10.4h7.6L12 3z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
        </svg>
      );
    default:
      return null;
  }
}

const ITEMS = [
  {
    title: "Timing: lump sum or step-by-step",
    body: "You get a clear hint on whether fresh money suits a full invest now, a paced STP, or a more careful approach — tied to how stretched or supportive the market looks that month.",
    tag: "When to buy",
    icon: "when",
  },
  {
    title: "Where to put money in equities",
    body: "Broad equity versus safer sleeves, and how much to lean into large caps versus mid and small caps — before you pick schemes or fund names with your advisor.",
    tag: "Where to invest",
    icon: "where",
  },
  {
    title: "Backed by long history",
    body: "Signals are trained and checked on more than twenty years of Indian market data across good years, bad years, and sudden shocks — so the read is not built on one lucky season.",
    tag: "Why it is safer to trust",
    icon: "trust",
  },
];

export default function WhatPlatformDoes() {
  return (
    <section className="border-b border-mdif-line bg-mdif-canvas py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionIntro
          eyebrow="What MarketCompass gives you"
          title="Three practical answers from one simple score"
          description="No need to follow every headline. The product focuses on how expensive the market is, how volatile the backdrop feels, and what that means for ordinary SIP and lump sum decisions."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map((item, i) => (
            <GlassCard key={item.title} delay={i * 0.06} className="flex flex-col gap-4">
              <div className="flex items-start gap-4">
                <CardIcon type={item.icon} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[12px] font-semibold uppercase tracking-widest text-mdif-brand sm:text-[13px]">
                      {item.tag}
                    </span>
                  </div>
                  <h3 className="mt-2 text-lg font-semibold leading-snug text-mdif-text sm:text-xl">
                    {item.title}
                  </h3>
                </div>
              </div>
              <p className="text-[1.02rem] leading-relaxed text-mdif-textMuted sm:text-[1.0625rem]">
                {item.body}
              </p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
