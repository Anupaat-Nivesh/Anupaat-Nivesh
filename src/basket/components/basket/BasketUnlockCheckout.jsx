import React from 'react';

const STEPS = ['Your details', 'Pay via Razorpay', 'Email & onboarding'];

export default function BasketUnlockCheckout({
  basket,
  form,
  onChange,
  onPay,
  paying,
  error,
  paid,
}) {
  if (paid) {
    return (
      <div className="an-unlock-panel an-unlock-panel--success">
        <div className="an-unlock-panel__badge">Unlocked</div>
        <h3>
          {basket.symbol} {basket.name}
        </h3>
        <p className="an-sb-muted">
          Full holdings are in the portfolio section below. Check your email for the fund list; our team will call for
          onboarding.
        </p>
        <a href="#basket-holdings" className="an-unlock-panel__holdings-link">
          Jump to holdings ↓
        </a>
      </div>
    );
  }

  return (
    <div id="basket-unlock" className="an-unlock-panel" tabIndex={-1}>
      <p className="an-unlock-panel__eyebrow">One-time access</p>
      <h3 className="an-unlock-panel__title">Unlock this basket</h3>
      <p className="an-unlock-panel__price">
        ₹{basket.price.toLocaleString('en-IN')}
        <span>{basket.priceLabel || 'one-time access'}</span>
      </p>

      <ol className="an-unlock-steps">
        {STEPS.map((label, i) => (
          <li key={label} className={paying && i === 1 ? 'is-active' : i === 0 ? 'is-active' : ''}>
            <span className="an-unlock-steps__num">{i + 1}</span>
            {label}
          </li>
        ))}
      </ol>

      <div className="an-unlock-form">
        <div className="an-unlock-form__grid">
          {['firstName', 'lastName', 'email', 'phone'].map((field) => (
            <div key={field} className="an-form-group">
              <label htmlFor={`unlock-${field}`}>
                {field === 'phone' ? 'Mobile' : field.replace(/^\w/, (c) => c.toUpperCase())}
              </label>
              <input
                id={`unlock-${field}`}
                type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                value={form[field]}
                onChange={(e) => onChange(field, e.target.value)}
                required={field === 'email' || field === 'phone'}
                autoComplete={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'name'}
                placeholder={
                  field === 'email' ? 'you@email.com' : field === 'phone' ? '10-digit mobile' : undefined
                }
              />
            </div>
          ))}
        </div>
      </div>

      {error && <p className="an-unlock-error">{error}</p>}

      <button type="button" className="an-unlock-pay-btn" disabled={paying} onClick={onPay}>
        {paying ? 'Opening Razorpay…' : `Pay ₹${basket.price.toLocaleString('en-IN')} & unlock`}
      </button>

      <p className="an-unlock-secure" aria-hidden="true">
        🔒 Secured by Razorpay
      </p>

      <p className="an-unlock-footnote">
        You will receive fund details by email; our advisory team connects within 1–2 business days.
      </p>
    </div>
  );
}
