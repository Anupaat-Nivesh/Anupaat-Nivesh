import React from "react";
import { motion } from "framer-motion";
import GlassCard from "./GlassCard";
import SectionIntro from "./SectionIntro";

function MiniBars({ variant }) {
  const heights = variant === "risk" ? [40, 62, 55, 78, 88, 72] : [72, 58, 64, 48, 42, 38];
  const color =
    variant === "risk"
      ? "bg-red-600/85"
      : variant === "neutral"
        ? "bg-amber-500/85"
        : "bg-emerald-600/85";
  return (
    <div className="mt-4 flex h-14 items-end justify-between gap-1">
      {heights.map((h, i) => (
        <motion.div
          key={i}
          className={`w-full max-w-[14px] origin-bottom rounded-sm ${color}`}
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.06, duration: 0.5, ease: "easeOut" }}
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  );
}

const LEVELS = [
  {
    level: "Level 1",
    title: "Core Market Score",
    accent: "from-emerald-600/15 to-transparent",
    variant: "core",
    bullets: ["STP vs lump sum posture", "Broad equity allocation bands"],
    foot: "Macro cycle probability — foundation layer",
  },
  {
    level: "Level 2",
    title: "Mid & Small Cap Intelligence",
    accent: "from-amber-500/15 to-transparent",
    variant: "neutral",
    bullets: ["Satellite sleeve sizing", "Aggression calibration vs core"],
    foot: "Style factor overlay on the core read",
  },
  {
    level: "Level 3",
    title: "High Conviction Buying Zone",
    accent: "from-mdif-brand/20 to-transparent",
    variant: "risk",
    bullets: ["Rare alignment windows", "Maximum margin-of-safety emphasis"],
    foot: "Opportunity layer — strict rarity filters",
  },
];

export default function ThreeLevelFramework() {
  return (
    <section className="border-b border-mdif-line bg-mdif-muted/80 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionIntro
          eyebrow="Three-level architecture"
          title="Core, satellite, and conviction — same score language"
          description="Mirrors how we teach the framework live: Level 1 for broad market posture, Level 2 for mid & small-cap sleeves, Level 3 for rare, high-conviction windows. Names and thresholds evolve; the structure does not."
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {LEVELS.map((L, i) => (
            <GlassCard key={L.level} delay={i * 0.1} className="relative overflow-hidden">
              <div
                className={`pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br ${L.accent} blur-2xl`}
              />
              <div className="relative">
                <span className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-mdif-textSoft">
                  {L.level}
                </span>
                <h3 className="mt-2 text-xl font-semibold leading-snug text-mdif-text">{L.title}</h3>
                <ul className="mt-4 space-y-2.5 text-[0.9375rem] leading-relaxed text-mdif-textMuted">
                  {L.bullets.map((b) => (
                    <li key={b} className="flex gap-2.5">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-mdif-brand" />
                      {b}
                    </li>
                  ))}
                </ul>
                <MiniBars variant={L.variant === "core" ? "core" : L.variant === "neutral" ? "neutral" : "risk"} />
                <p className="mt-4 border-t border-mdif-line pt-4 font-mono text-[10px] font-medium uppercase tracking-wider text-mdif-textSoft">
                  {L.foot}
                </p>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
