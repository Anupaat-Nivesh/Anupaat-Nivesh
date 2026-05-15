import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import HeroInsightCarousel from "./HeroInsightCarousel";

export default function HeroSection() {
  return (
    <section className="relative overflow-x-hidden border-b border-mdif-line bg-hero-wash">
      <div
        className="pointer-events-none absolute inset-0 bg-terminal-grid bg-[length:80px_80px] animate-grid-drift opacity-60"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 bg-radial-glow" aria-hidden />
      <div className="pointer-events-none absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-mdif-brand/5 blur-[100px]" />
      <div className="pointer-events-none absolute -right-16 bottom-10 h-64 w-64 rounded-full bg-mdif-brand/5 blur-[90px]" />

      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-start gap-10 px-5 pb-12 pt-10 sm:gap-12 sm:px-8 sm:pb-14 sm:pt-12 md:pt-14 lg:grid-cols-2 lg:gap-x-14 lg:gap-y-10 lg:items-stretch">
        <div className="min-w-0 max-w-xl justify-self-center lg:max-w-none lg:justify-self-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 rounded-full border border-mdif-line bg-mdif-surface px-4 py-2 text-sm font-semibold uppercase tracking-[0.12em] text-mdif-textSoft shadow-sm sm:text-[0.9375rem]"
          >
            <span className="h-2 w-2 shrink-0 rounded-full bg-mdif-brand shadow-[0_0_0_3px_rgba(254,1,1,0.2)]" />
            MarketCompass · coming soon
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 text-balance text-[2.25rem] font-semibold leading-[1.1] tracking-tight text-mdif-text sm:text-5xl lg:text-[3.15rem]"
          >
            Know <span className="text-mdif-brand">when</span> to add money and{" "}
            <span className="text-mdif-brand">where</span> to invest — from real market conditions.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-xl text-lg font-normal leading-[1.65] text-mdif-textMuted sm:text-xl sm:leading-relaxed"
          >
            <strong className="font-semibold text-mdif-text">MarketCompass</strong> reads years of
            market history into plain hints: <strong className="text-mdif-text">pacing</strong> (SIP
            vs lump sum), <strong className="text-mdif-text">how much equity</strong> fits the moment,
            and when to <strong className="text-mdif-text">ease off</strong> — tested across booms,
            crashes, and shocks, not rumours.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center"
          >
            <span className="inline-flex w-fit items-center rounded-xl border border-mdif-line bg-mdif-surface px-5 py-3 text-sm font-bold uppercase tracking-widest text-mdif-textMuted shadow-sm sm:text-[0.8125rem]">
              Coming soon
            </span>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="sm:inline-flex">
              <Link
                to="/contact"
                className="inline-flex min-h-[52px] items-center justify-center rounded-xl bg-mdif-brand px-8 py-3.5 text-base font-semibold text-white shadow-[0_12px_40px_-12px_rgba(254,1,1,0.55)] transition hover:bg-mdif-brandDark sm:min-h-[56px] sm:px-10 sm:text-lg"
              >
                Join early access
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="sm:inline-flex">
              <a
                href="#early-access"
                className="inline-flex min-h-[52px] items-center justify-center rounded-xl border-2 border-mdif-brand bg-mdif-surface px-8 py-3.5 text-base font-semibold text-mdif-brand transition hover:bg-[rgba(254,1,1,0.07)] sm:min-h-[56px] sm:px-10 sm:text-lg"
              >
                Waitlist
              </a>
            </motion.div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.55 }}
            className="mt-8 max-w-xl text-base leading-relaxed text-mdif-textSoft sm:text-[1.0625rem]"
          >
            <strong className="font-semibold text-mdif-text/90">Not</strong> stock tips.{" "}
            <strong className="font-semibold text-mdif-text/90">Not</strong> a return promise. A
            steady way to line up savings with how expensive markets look — Anupaat Nivesh.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full min-w-0 justify-self-center lg:max-w-none lg:justify-self-stretch"
        >
          <div className="relative mx-auto w-full max-w-lg lg:mx-0 lg:max-w-none">
            <HeroInsightCarousel />
            <div className="pointer-events-none absolute -inset-px -z-10 rounded-3xl bg-gradient-to-br from-mdif-brand/14 via-transparent to-mdif-brand/10 blur-xl" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
