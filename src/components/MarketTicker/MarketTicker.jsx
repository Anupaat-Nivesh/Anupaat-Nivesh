import React, { Fragment, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import "./MarketTicker.css";

/**
 * Market ticker must hit the Node app that implements `/api/market-ticker` (Yahoo proxy).
 * - Dev: same-origin `/api/...` + package.json `proxy` → localhost:8000 (run `npm run server`).
 * - Vercel: same-origin `/api/...` → server.mjs (vercel.json); no separate API host needed.
 * - Split deploy: set REACT_APP_API_BASE_URL to the API origin that exposes this route.
 */
function getMarketTickerApiUrl() {
  const override = (process.env.REACT_APP_API_BASE_URL || "").trim().replace(/\/$/, "");
  if (override) return `${override}/api/market-ticker`;
  return "/api/market-ticker";
}

function formatInr(value) {
  if (value == null || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatUsd(value) {
  if (value == null || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatChangePct(pct) {
  if (pct == null || Number.isNaN(pct)) return "";
  const sign = pct > 0 ? "+" : "";
  return `${sign}${pct.toFixed(2)}%`;
}

function QuoteChip({ q }) {
  if (!q.ok) {
    return (
      <span className="market-ticker__chip market-ticker__chip--muted">
        <span className="market-ticker__chip-label">{q.label}</span>
        <span className="market-ticker__chip-price">—</span>
      </span>
    );
  }

  const isUsd = q.displayCurrency === "USD";
  const priceStr = isUsd ? formatUsd(q.price) : `₹${formatInr(q.price)}`;
  const ch = q.changePct;
  const chStr = formatChangePct(ch);
  const up = ch != null && ch > 0;
  const down = ch != null && ch < 0;
  const titleParts = [
    q.shortName || q.label,
    q.sublabel,
    q.marketTime ? `As of ${new Date(q.marketTime * 1000).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}` : null,
  ].filter(Boolean);

  return (
    <span className="market-ticker__chip" title={titleParts.join(" · ")}>
      <span className="market-ticker__chip-label">
        {q.label}
        {q.sublabel ? <span className="market-ticker__chip-sublabel"> {q.sublabel}</span> : null}
      </span>
      <span className="market-ticker__chip-mid">
        <span className="market-ticker__chip-price">{priceStr}</span>
        {chStr ? (
          <span
            className={`market-ticker__chip-change${up ? " market-ticker__chip-change--up" : ""}${down ? " market-ticker__chip-change--down" : ""}`}
          >
            {chStr}
          </span>
        ) : null}
      </span>
    </span>
  );
}

/**
 * Homepage market strip: ordered quotes from /api/market-ticker, infinite marquee (two identical
 * copies, translate -50%), duration from measured width for a steady loop. Hover pauses (CSS).
 */
const MARQUEE_PX_PER_SEC = 45;

export default function MarketTicker() {
  const [quotes, setQuotes] = useState([]);
  const [fetchedAt, setFetchedAt] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [marqueeHover, setMarqueeHover] = useState(false);
  const segmentRef = useRef(null);
  const railRef = useRef(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch(getMarketTickerApiUrl(), { credentials: "omit" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || res.statusText || "Request failed");
      const list = Array.isArray(json.quotes) ? json.quotes : [];
      setQuotes(list);
      setFetchedAt(typeof json.fetchedAt === "number" ? json.fetchedAt : Date.now());
      setLoadError(null);
    } catch (e) {
      setLoadError(e.message || "Unavailable");
    }
  }, []);

  useEffect(() => {
    load();
    const id = window.setInterval(load, 60_000);
    return () => window.clearInterval(id);
  }, [load]);

  useLayoutEffect(() => {
    const syncTop = () => {
      const nav = document.querySelector(".anupaat__navbar");
      const h = nav?.getBoundingClientRect?.().height ?? 72;
      document.documentElement.style.setProperty("--market-ticker-top", `${Math.ceil(h)}px`);
    };
    syncTop();
    window.addEventListener("resize", syncTop);
    document.body.classList.add("has-market-ticker");
    return () => {
      window.removeEventListener("resize", syncTop);
      document.body.classList.remove("has-market-ticker");
      document.documentElement.style.removeProperty("--market-ticker-top");
    };
  }, []);

  useLayoutEffect(() => {
    const el = segmentRef.current;
    const rail = railRef.current;
    if (!quotes.length || !el || !rail) return;

    const apply = () => {
      const w = el.offsetWidth;
      if (!w) return;
      const sec = Math.max(24, Math.min(100, w / MARQUEE_PX_PER_SEC));
      rail.style.setProperty("--market-ticker-duration", `${sec}s`);
    };

    apply();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(apply) : null;
    ro?.observe(el);
    window.addEventListener("resize", apply);
    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", apply);
    };
  }, [quotes]);

  const segments = useMemo(() => {
    if (!quotes.length) return null;
    const renderOne = (suffix) =>
      quotes.map((q, i) => (
        <Fragment key={`${suffix}-${q.id}`}>
          {i > 0 ? (
            <span className="market-ticker__sep" aria-hidden="true">
              ·
            </span>
          ) : null}
          <QuoteChip q={q} />
        </Fragment>
      ));

    return (
      <>
        <div ref={segmentRef} className="market-ticker__segment">
          {renderOne("a")}
        </div>
        <div className="market-ticker__segment" aria-hidden="true">
          {renderOne("b")}
        </div>
      </>
    );
  }, [quotes]);

  return (
    <aside
      className="market-ticker"
      role="region"
      aria-label="Market snapshot: Nifty, Bank Nifty, Sensex, USD/INR, gold, silver, WTI crude — scrolling on a loop"
    >
      <div className="market-ticker__inner">
        {loadError && !quotes.length ? (
          <span className="market-ticker__status market-ticker__status--error">{loadError}</span>
        ) : null}
        <div
          className="market-ticker__viewport"
          onMouseEnter={() => setMarqueeHover(true)}
          onMouseLeave={() => setMarqueeHover(false)}
        >
          <div
            ref={railRef}
            className={`market-ticker__rail${marqueeHover ? " market-ticker__rail--paused" : ""}`}
          >
            {segments}
          </div>
        </div>
        {fetchedAt ? (
          <span className="market-ticker__updated">
            Updated {new Date(fetchedAt).toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit" })}
          </span>
        ) : null}
      </div>
    </aside>
  );
}
