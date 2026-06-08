import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { getApiBaseUrl } from '../../api/config';
import { marketIndices as fallbackIndices } from '../data/screenerStaticData';

const MARQUEE_PX_PER_SEC = 52;

function indicesUrl() {
  const base = getApiBaseUrl();
  return base ? `${base}/api/screeners/indices` : '/api/screeners/indices';
}

function TrendIcon({ up }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      {up ? (
        <path d="M3 11l5-6 5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      ) : (
        <path d="M3 5l5 6 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      )}
    </svg>
  );
}

function IndexCard({ idx }) {
  return (
    <article className="scr-index-card" role="listitem">
      <div className="scr-index-card__head">
        <span className="scr-index-card__name">{idx.name}</span>
        <span className={`scr-index-card__trend ${idx.up ? 'is-up' : 'is-down'}`}>
          <TrendIcon up={idx.up} />
        </span>
      </div>
      <div className="scr-index-card__row">
        <span className="scr-index-card__value">{idx.value}</span>
        <span className={`scr-index-card__chg ${idx.up ? 'is-up' : 'is-down'}`}>
          {idx.up ? '+' : ''}
          {idx.change}%
        </span>
      </div>
    </article>
  );
}

export default function IndexTickerRow({ indices: indicesProp }) {
  const [indices, setIndices] = useState(indicesProp || fallbackIndices);
  const [paused, setPaused] = useState(false);
  const segmentRef = useRef(null);
  const railRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(indicesUrl(), { headers: { Accept: 'application/json' } });
        const data = await res.json();
        if (!cancelled && data.ok && data.indices?.length) {
          setIndices(data.indices);
        }
      } catch {
        /* keep fallback */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const baseItems = useMemo(
    () => (indices.length ? indices : fallbackIndices),
    [indices]
  );

  const loopItems = useMemo(() => [...baseItems, ...baseItems], [baseItems]);

  useLayoutEffect(() => {
    const seg = segmentRef.current;
    const rail = railRef.current;
    if (!seg || !rail) return;
    const width = seg.getBoundingClientRect().width;
    if (!width) return;
    const sec = width / MARQUEE_PX_PER_SEC;
    rail.style.setProperty('--scr-marquee-duration', `${Math.max(sec, 28)}s`);
  }, [loopItems.length, baseItems]);

  const segmentA = loopItems;
  const segmentB = loopItems;

  return (
    <div className="scr-indices-wrap">
      <div
        className="scr-indices-marquee"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="scr-indices-marquee__viewport">
          <div
            ref={railRef}
            className={`scr-indices-marquee__rail${paused ? ' scr-indices-marquee__rail--paused' : ''}`}
          >
            <div ref={segmentRef} className="scr-indices-marquee__segment" role="list">
              {segmentA.map((idx, i) => (
                <IndexCard key={`${idx.id}-a-${i}`} idx={idx} />
              ))}
            </div>
            <div className="scr-indices-marquee__segment" aria-hidden="true">
              {segmentB.map((idx, i) => (
                <IndexCard key={`${idx.id}-b-${i}`} idx={idx} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
