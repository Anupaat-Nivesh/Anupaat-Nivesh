import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import BasketAllocationDonut from '../basket-analytics/BasketAllocationDonut';
import DistributionCard from './DistributionCard';
import BasketRiskScoreViz from './BasketRiskScoreViz';
import { getElementChartPalette, getElementColor } from '../../data/elementalColors';

export default function BasketPortfolioConstruction({
  element,
  slices,
  assetSlices,
  marketCap,
  sectors,
  riskScoreRange,
  riskLevel,
  liveVolatilityPct,
}) {
  const hasEquityBreakdown = marketCap?.length > 0 || sectors?.length > 0;
  if (!slices?.length && !hasEquityBreakdown && !riskScoreRange) return null;

  const accent = getElementColor(element);
  const capPalette = getElementChartPalette(element, marketCap?.length || 3);

  const capData =
    marketCap?.length > 0
      ? {
          labels: marketCap.map((m) => m.label),
          datasets: [
            {
              data: marketCap.map((m) => m.pct),
              backgroundColor: capPalette,
              borderWidth: 0,
            },
          ],
        }
      : null;

  return (
    <section className="an-portfolio-construction" aria-labelledby="portfolio-construction-heading">
      <div className="an-portfolio-construction__head">
        <h2 id="portfolio-construction-heading" className="an-card-heading">
          Portfolio construction
        </h2>
        <p className="an-sb-muted">
          Fund mix, equity market-cap tilt, sector exposure, and approved risk score for this basket.
        </p>
      </div>

      <div className="an-portfolio-construction__grid">
        {slices?.length > 0 && (
          <div className="an-portfolio-construction__panel an-portfolio-construction__panel--donut">
            <BasketAllocationDonut slices={slices} title="Fund mix" />
          </div>
        )}

        {assetSlices?.length > 0 && (
          <div className="an-portfolio-construction__panel">
            <DistributionCard assetSlices={assetSlices} />
          </div>
        )}

        {capData && (
          <div className="an-portfolio-construction__panel">
            <h3 className="an-portfolio-construction__subhead">Market-cap allocation</h3>
            <div className="an-sb-donut-wrap">
              <div className="an-portfolio-construction__cap-chart">
                <Doughnut
                  data={capData}
                  options={{
                    cutout: '62%',
                    plugins: { legend: { display: false } },
                  }}
                />
              </div>
              <div className="an-portfolio-construction__cap-legend">
                {marketCap.map((m, i) => (
                  <div key={m.label} className="an-sb-legend-row">
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                      <span
                        className="an-sb-legend-dot"
                        style={{ background: capPalette[i % capPalette.length] }}
                      />
                      {m.label}
                    </span>
                    <strong>{m.pct}%</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {riskScoreRange && (
          <div className="an-portfolio-construction__panel">
            <BasketRiskScoreViz
              element={element}
              riskScoreRange={riskScoreRange}
              riskLevel={riskLevel}
              liveVolatilityPct={liveVolatilityPct}
            />
          </div>
        )}
      </div>

      {sectors?.length > 0 && (
        <div className="an-portfolio-construction__sectors">
          <h3 className="an-portfolio-construction__subhead">Sector allocation</h3>
          {sectors.map((s) => (
            <div key={s.label} className="an-sb-sector-row">
              <div className="an-sb-sector-row__head">
                <span>{s.label}</span>
                <strong>{s.pct}%</strong>
              </div>
              <div className="an-sb-sector-bar">
                <div
                  className="an-sb-sector-fill"
                  style={{
                    width: `${Math.min(100, s.pct)}%`,
                    background: `linear-gradient(90deg, ${accent}, ${capPalette[1] || accent})`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
