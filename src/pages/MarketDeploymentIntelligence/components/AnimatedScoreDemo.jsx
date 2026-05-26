import React, { useEffect, useState } from "react";
import { animate } from "framer-motion";
import { motion } from "framer-motion";

function zoneForScore(score) {
  if (score < 0.65)
    return { label: "Favorable zone", color: "text-emerald-800", bar: "bg-emerald-600" };
  if (score < 1.2) return { label: "Caution", color: "text-amber-800", bar: "bg-amber-500" };
  return { label: "High risk zone", color: "text-red-800", bar: "bg-red-600" };
}

function ScoreCard({ target, caption, sub }) {
  const [value, setValue] = useState(0);
  const z = zoneForScore(value);

  useEffect(() => {
    const controls = animate(0, target, {
      duration: 2.2,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setValue(v),
    });
    return () => controls.stop();
  }, [target]);

  const pct = Math.min(100, (value / 2) * 100);

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-mdif-line bg-mdif-muted p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] font-medium uppercase tracking-widest text-mdif-textSoft">
            Unified score
          </p>
          <p className={`mt-1.5 text-3xl font-semibold tabular-nums tracking-tight ${z.color}`}>
            {value.toFixed(2)}
          </p>
        </div>
        <span
          className={`rounded-full border border-mdif-line bg-mdif-surface px-3 py-1 font-mono text-[11px] font-medium ${z.color}`}
        >
          {z.label}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
        <motion.div className={`h-full rounded-full ${z.bar}`} style={{ width: `${pct}%` }} />
      </div>
      <p className="text-sm leading-relaxed text-mdif-textMuted">{caption}</p>
      {sub ? <p className="font-mono text-[11px] text-mdif-textSoft">{sub}</p> : null}
    </div>
  );
}

export default function AnimatedScoreDemo() {
  return (
    <div className="grid gap-5 sm:grid-cols-3">
      <ScoreCard
        target={0.38}
        caption="Lower readings map to wider margins of safety in the probability engine."
        sub="Illustrative composite — not live data"
      />
      <ScoreCard
        target={1.0}
        caption="Elevated readings signal thinner cushions; deployment pacing tightens."
        sub="Illustrative composite — not live data"
      />
      <ScoreCard
        target={1.58}
        caption="Extended risk bands — aggression scales down until profiles normalize."
        sub="Illustrative composite — not live data"
      />
    </div>
  );
}
