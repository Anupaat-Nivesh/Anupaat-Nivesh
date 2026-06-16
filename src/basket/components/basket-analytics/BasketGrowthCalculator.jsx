import React, { useMemo, useState } from 'react';

const HORIZONS = [5, 10, 15, 20, 30];

function futureValue(principal, cagrPct, years) {
  return Math.round(principal * (1 + cagrPct / 100) ** years);
}

/**
 * Forward-looking illustration only. Historical growth of ₹1L is on the chart above
 * (synthetic basket NAV). This calculator uses assumed CAGR — not live basket history.
 */
export default function BasketGrowthCalculator({
  expectedReturn,
  basketName,
  liveCagrSinceInception,
}) {
  const [amount, setAmount] = useState(100000);
  const cagr = expectedReturn ?? 12;
  const liveLabel =
    liveCagrSinceInception != null
      ? ` Basket NAV CAGR since inception: ${liveCagrSinceInception}%.`
      : '';

  const projections = useMemo(
    () =>
      HORIZONS.map((y) => ({
        years: y,
        value: futureValue(amount, cagr, y),
      })),
    [amount, cagr]
  );

  return (
    <section className="an-basket-calc">
      <h2 className="an-card-heading">Forward growth illustration</h2>
      <p className="an-sb-muted">
        Hypothetical lumpsum projection for {basketName} at {cagr}% assumed CAGR — not a guarantee.
        For actual basket history, see Growth of ₹1,00,000 above.{liveLabel}
      </p>
      <div className="an-basket-calc__slider">
        <label htmlFor="calc-amt">
          Lumpsum: <strong>₹{amount.toLocaleString('en-IN')}</strong>
        </label>
        <input
          id="calc-amt"
          type="range"
          min={10000}
          max={5000000}
          step={10000}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
      </div>
      <div className="an-basket-calc__grid">
        {projections.map((p) => (
          <div key={p.years} className="an-basket-calc__cell">
            <span>{p.years} years</span>
            <strong>₹{p.value.toLocaleString('en-IN')}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}
