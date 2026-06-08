import React, { useState } from 'react';
import { getFundComposition } from '../../utils/fundComposition';

export default function FundCompositionSection({ schemeCode, categoryId, composition }) {
  const fallback = getFundComposition(schemeCode, categoryId);
  const { sectors, holdings, isIllustrative, month } = composition?.sectors?.length
    ? {
        sectors: composition.sectors,
        holdings: composition.holdings || [],
        isIllustrative: false,
        month: composition.month,
      }
    : fallback;
  const [showAllHoldings, setShowAllHoldings] = useState(false);
  const visibleHoldings = showAllHoldings ? holdings : holdings.slice(0, 5);

  return (
    <div className="an-fund-composition">
      {isIllustrative && (
        <p className="an-fund-composition__disclaimer">
          Sector &amp; holding mix is category-based preview until mfdata.in portfolio data is available.
        </p>
      )}
      {!isIllustrative && month && (
        <p className="an-fund-composition__disclaimer">
          Portfolio as of {month} (mfdata.in).
        </p>
      )}

      <div className="an-sb-card">
        <div className="an-fund-block-label">Sectors</div>
        <h2 className="an-sb-card__title an-sb-card__title--flat">Sector allocation</h2>
        <div style={{ padding: '0 1.15rem 1rem' }}>
          {sectors.map((s) => (
            <div key={s.label} className="an-sb-sector-row">
              <div className="an-sb-sector-row__head">
                <span>{s.label}</span>
                <strong>{s.pct}%</strong>
              </div>
              <div className="an-sb-sector-bar">
                <div
                  className="an-sb-sector-fill"
                  style={{ width: `${s.pct}%`, background: s.color || undefined }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="an-sb-card">
        <div className="an-fund-block-label">Companies</div>
        <h2 className="an-sb-card__title an-sb-card__title--flat">Top holdings</h2>
        <table className="an-holdings-table">
          <thead>
            <tr>
              <th>Security</th>
              <th className="an-num">Weight</th>
            </tr>
          </thead>
          <tbody>
            {visibleHoldings.map((h) => (
              <tr key={h.name}>
                <td>{h.name}</td>
                <td className="an-num">{h.weight}%</td>
              </tr>
            ))}
          </tbody>
        </table>
        {holdings.length > 5 && (
          <button type="button" className="an-show-all" onClick={() => setShowAllHoldings((v) => !v)}>
            {showAllHoldings ? 'Show less' : 'Show all holdings'}
          </button>
        )}
      </div>
    </div>
  );
}
