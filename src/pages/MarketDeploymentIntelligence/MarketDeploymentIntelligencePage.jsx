import React, { useEffect } from "react";
import HeroSection from "./components/HeroSection";
import MarketPlainSpeak from "./components/MarketPlainSpeak";
import WhatPlatformDoes from "./components/WhatPlatformDoes";
import ScoringSystem from "./components/ScoringSystem";
import FooterCTA from "./components/FooterCTA";
import ClientSessionInsight from "./components/ClientSessionInsight";

export default function MarketDeploymentIntelligencePage() {
  useEffect(() => {
    const prev = document.title;
    document.title = "MarketCompass · When to invest & where · Anupaat Nivesh";
    return () => {
      document.title = prev;
    };
  }, []);

  return (
    <div id="mdif-root">
      {/*
        Tailwind important: "#mdif-root" scopes utilities to *descendants* only.
        Padding must live on this inner wrapper or it never applies to the page.
      */}
      <div
        className="min-h-screen scroll-pt-28 bg-mdif-canvas pb-12 pt-28 font-sans text-[1.0625rem] text-mdif-text antialiased leading-[1.65] sm:scroll-pt-32 sm:pb-10 sm:pt-[7.5rem] sm:text-[1.075rem] sm:leading-relaxed md:pt-32 lg:pt-36"
      >
        <a
          href="#mdif-main"
          className="fixed left-4 top-28 z-[110] -translate-y-24 rounded-md bg-mdif-brand px-3 py-2.5 text-sm font-semibold text-white opacity-0 shadow-md transition hover:bg-mdif-brandDark focus:translate-y-0 focus:opacity-100 sm:top-32"
        >
          Skip to content
        </a>
        <main id="mdif-main" className="scroll-mt-28 sm:scroll-mt-32">
          <HeroSection />
          <MarketPlainSpeak />
          <ClientSessionInsight />
          <WhatPlatformDoes />
          <ScoringSystem />
          <FooterCTA />
        </main>
      </div>
    </div>
  );
}
