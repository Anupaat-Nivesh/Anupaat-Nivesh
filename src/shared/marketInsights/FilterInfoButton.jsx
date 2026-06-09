import React, { useId, useState } from 'react';
import './screener-context-filters.css';

/**
 * Section-level help control — use sparingly at headers, not on every filter field.
 */
export default function FilterInfoButton({
  text,
  label = 'More information',
  variant = 'i',
  align,
}) {
  const [open, setOpen] = useState(false);
  const popoverId = useId();
  const variantClass = variant === '?' ? 'question' : 'info';
  const alignClass = align === 'end' ? ' scf-info--end' : '';

  if (!text) return null;

  return (
    <span className={`scf-info${alignClass}`}>
      <button
        type="button"
        className={`scf-info__btn scf-info__btn--${variantClass}`}
        aria-label={label}
        aria-expanded={open}
        aria-controls={popoverId}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      >
        <span className="scf-info__glyph" aria-hidden="true">
          i
        </span>
      </button>
      <span
        id={popoverId}
        role="tooltip"
        className={`scf-info__popover${open ? ' is-open' : ''}`}
        aria-hidden={!open}
      >
        {text}
      </span>
    </span>
  );
}
