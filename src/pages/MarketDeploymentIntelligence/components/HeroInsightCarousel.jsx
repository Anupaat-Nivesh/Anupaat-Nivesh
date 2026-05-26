import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

function Heatmap() {
  const cells = Array.from({ length: 64 }, (_, i) => i);
  return (
    <div className="grid grid-cols-8 gap-0.5 rounded-lg border border-mdif-line bg-mdif-muted p-2">
      {cells.map((i) => (
        <motion.div
          key={i}
          className="aspect-square rounded-[2px]"
          style={{
            background:
              i % 5 === 0
                ? "rgba(21,128,61,0.55)"
                : i % 7 === 0
                  ? "rgba(185,28,28,0.45)"
                  : "rgba(180,83,9,0.35)",
          }}
          animate={{ opacity: [0.45, 1, 0.55] }}
          transition={{
            duration: 3 + (i % 5) * 0.4,
            repeat: Infinity,
            delay: i * 0.05,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function ProbabilityCurves() {
  return (
    <svg className="h-full w-full" viewBox="0 0 400 120" preserveAspectRatio="none" aria-hidden>
      <defs>
        <linearGradient id="mdif-slide-g1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(254,1,1,0.22)" />
          <stop offset="100%" stopColor="rgba(254,1,1,0)" />
        </linearGradient>
        <linearGradient id="mdif-slide-g2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(27,27,27,0.12)" />
          <stop offset="100%" stopColor="rgba(27,27,27,0)" />
        </linearGradient>
      </defs>
      <motion.path
        fill="url(#mdif-slide-g1)"
        d="M0,90 Q100,20 200,55 T400,40 L400,120 L0,120 Z"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      />
      <motion.path
        fill="none"
        stroke="rgba(254,1,1,0.55)"
        strokeWidth="1.5"
        d="M0,90 Q100,20 200,55 T400,40"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />
      <motion.path
        fill="url(#mdif-slide-g2)"
        d="M0,100 Q140,70 260,85 T400,75 L400,120 L0,120 Z"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, delay: 0.2 }}
      />
      <motion.path
        fill="none"
        stroke="rgba(27,27,27,0.2)"
        strokeWidth="1.1"
        d="M0,100 Q140,70 260,85 T400,75"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2.2, delay: 0.15, ease: "easeInOut" }}
      />
    </svg>
  );
}

const ZONES = [
  { label: "0.0 zone", sub: "Supportive", tone: "bg-emerald-600 text-white" },
  { label: "~1.0", sub: "Caution", tone: "bg-amber-500 text-slate-900" },
  { label: "1.5+", sub: "Risky", tone: "bg-red-600 text-white" },
];

/** Shared shell so all hero carousel panels reserve the same vertical space (Swiper height stays stable). */
const HERO_INSIGHT_CARD =
  "flex h-full min-h-[26rem] flex-col rounded-2xl border border-mdif-line bg-mdif-surface shadow-glass sm:min-h-[28rem] lg:min-h-[25.5rem]";

export default function HeroInsightCarousel() {
  return (
    <div className="relative mx-auto w-full min-w-0 max-w-xl lg:max-w-none">
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={16}
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={{ delay: 6500, disableOnInteraction: true, pauseOnMouseEnter: true }}
        className="mdif-hero-swiper !pb-10"
      >
        <SwiperSlide className="!h-auto">
          <div className={`${HERO_INSIGHT_CARD} w-full flex-1 p-5 sm:p-6`}>
            <div className="flex shrink-0 items-center justify-between border-b border-mdif-line pb-4">
              <div className="font-mono text-[12px] font-semibold uppercase tracking-widest text-mdif-textSoft sm:text-[13px]">
                Probability surface
              </div>
              <div className="flex gap-1.5" aria-hidden>
                <span className="h-2 w-2 rounded-full bg-red-600/90" />
                <span className="h-2 w-2 rounded-full bg-amber-500/90" />
                <span className="h-2 w-2 rounded-full bg-emerald-600/90" />
              </div>
            </div>
            <div className="mt-4 flex min-h-0 flex-1 flex-col gap-4 lg:grid lg:grid-cols-[1.35fr_0.65fr] lg:items-stretch">
              <div className="relative h-36 shrink-0 overflow-hidden rounded-xl border border-mdif-line bg-mdif-muted sm:h-40">
                <ProbabilityCurves />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-mdif-surface to-transparent" />
              </div>
              <div className="flex min-h-0 flex-1 flex-col justify-center lg:max-h-none">
                <div className="mx-auto max-h-40 w-full max-w-[min(100%,14rem)] overflow-hidden sm:max-h-44 lg:max-h-none lg:max-w-none">
                  <Heatmap />
                </div>
                <p className="mt-3 shrink-0 font-mono text-[12px] font-medium uppercase tracking-wider text-mdif-textSoft sm:text-[13px]">
                  Density / regime heat — illustrative
                </p>
              </div>
            </div>
            <div className="mt-auto grid shrink-0 grid-cols-3 gap-2 pt-4 font-mono text-[12px] text-mdif-textSoft sm:text-[13px]">
              <div className="rounded-lg border border-mdif-line bg-mdif-muted px-2 py-2.5">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-mdif-textSoft sm:text-[12px]">
                  Engine
                </div>
                <div className="mt-1 font-sans text-[0.9375rem] font-semibold text-mdif-text sm:text-sm">
                  Bayesian blend
                </div>
              </div>
              <div className="rounded-lg border border-mdif-line bg-mdif-muted px-2 py-2.5">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-mdif-textSoft sm:text-[12px]">
                  Inputs
                </div>
                <div className="mt-1 font-sans text-[0.9375rem] font-semibold text-mdif-text sm:text-sm">
                  Multi-metric
                </div>
              </div>
              <div className="rounded-lg border border-mdif-line bg-mdif-muted px-2 py-2.5">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-mdif-textSoft sm:text-[12px]">
                  Output
                </div>
                <div className="mt-1 font-sans text-[0.9375rem] font-semibold text-mdif-brand sm:text-sm">
                  Deploy bands
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide className="!h-auto">
          <div className={`${HERO_INSIGHT_CARD} justify-between p-6 sm:p-8`}>
            <div className="shrink-0">
              <p className="font-mono text-[12px] font-semibold uppercase tracking-widest text-mdif-brand sm:text-[13px]">
                Inside the engine
              </p>
              <h3 className="mt-3 text-xl font-semibold leading-snug text-mdif-text sm:text-2xl">
                Same metrics — a data-science read
              </h3>
              <p className="mt-4 text-base leading-relaxed text-mdif-textMuted sm:text-[1.0625rem] sm:leading-relaxed">
                Raw prices and yields are translated into a single interpretable score, then into
                deployment posture. No narrative layer; no static “cheap at 16× PE” banding that
                breaks when the regime shifts.
              </p>
            </div>
            <ol className="mt-auto space-y-3 border-t border-mdif-line pt-5 text-[0.9375rem] font-medium leading-snug text-mdif-text sm:text-base">
              <li className="flex gap-3">
                <span className="font-mono text-mdif-brand">01</span>
                <span>Market data &amp; valuation channels</span>
              </li>
              <li className="flex gap-3">
                <span className="font-mono text-mdif-brand">02</span>
                <span>Normalization &amp; probability blend</span>
              </li>
              <li className="flex gap-3">
                <span className="font-mono text-mdif-brand">03</span>
                <span>Allocation &amp; pacing signals</span>
              </li>
            </ol>
          </div>
        </SwiperSlide>

        <SwiperSlide className="!h-auto">
          <div className={`${HERO_INSIGHT_CARD} p-6 sm:p-8`}>
            <div className="shrink-0">
              <p className="font-mono text-[12px] font-semibold uppercase tracking-widest text-mdif-text sm:text-[13px]">
                Zone reference
              </p>
              <p className="mt-2 text-base leading-relaxed text-mdif-textMuted sm:text-[1.0625rem]">
                Lower composite readings imply a wider margin of safety; higher readings mean thinner
                cushions — a posture read, not a price target.
              </p>
            </div>
            <div className="mt-6 flex min-h-0 flex-1 flex-col justify-center gap-3 sm:gap-4">
              {ZONES.map((z) => (
                <div
                  key={z.label}
                  className={`flex items-center justify-between rounded-xl px-4 py-3.5 sm:px-5 sm:py-4 ${z.tone}`}
                >
                  <span className="font-mono text-sm font-semibold uppercase tracking-wide sm:text-[0.9375rem]">
                    {z.label}
                  </span>
                  <span className="text-lg font-semibold sm:text-xl">{z.sub}</span>
                </div>
              ))}
            </div>
            <Link
              to="/contact"
              className="mt-auto inline-flex w-full shrink-0 items-center justify-center rounded-lg bg-mdif-brand py-3 text-center text-sm font-semibold text-white transition hover:bg-mdif-brandDark sm:text-base"
            >
              Join early access
            </Link>
          </div>
        </SwiperSlide>
      </Swiper>
      <style>{`
        .mdif-hero-swiper .swiper-pagination-bullet { background: #94a3b8; opacity: 1; }
        .mdif-hero-swiper .swiper-pagination-bullet-active { background: #FE0101; }
        .mdif-hero-swiper .swiper-slide { height: auto; display: flex; }
        .mdif-hero-swiper .swiper-slide > * { width: 100%; }
      `}</style>
    </div>
  );
}
