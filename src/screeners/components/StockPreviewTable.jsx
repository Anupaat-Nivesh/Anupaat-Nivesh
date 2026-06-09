import React from 'react';

export default function StockPreviewTable({ rows }) {
  return (
    <section className="scr-section scr-section--table" aria-labelledby="stock-preview-heading">
      <header className="scr-section__head">
        <span className="scr-section__icon scr-section__icon--green" aria-hidden="true">
          ▤
        </span>
        <h2 id="stock-preview-heading" className="scr-section__title">
          Market snapshot
        </h2>
        <span className="scr-section__meta">Static preview · EOD illustrative</span>
      </header>
      <div className="scr-table-panel">
        <table className="scr-table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Company</th>
              <th className="scr-num">LTP</th>
              <th className="scr-num">Change %</th>
              <th className="scr-num">Volume</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.symbol}>
                <td className="scr-table__sym">{r.symbol}</td>
                <td>{r.name}</td>
                <td className="scr-num">₹{r.price}</td>
                <td className={`scr-num ${r.change >= 0 ? 'is-up' : 'is-down'}`}>
                  {r.change >= 0 ? '+' : ''}
                  {r.change}%
                </td>
                <td className="scr-num">{r.volume}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
