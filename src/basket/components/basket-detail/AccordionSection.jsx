import React, { useState } from 'react';

export default function AccordionSection({ sections }) {
  const [open, setOpen] = useState(() => sections.map((_, i) => i === 0));

  const toggle = (idx) => {
    setOpen((prev) => prev.map((v, i) => (i === idx ? !v : v)));
  };

  return (
    <div className="an-sb-accordion">
      {sections.map((sec, idx) => (
        <div key={sec.title} className={`an-sb-accordion__item ${open[idx] ? 'is-open' : ''}`}>
          <button type="button" className="an-sb-accordion__trigger" onClick={() => toggle(idx)}>
            {sec.title}
            <span className="an-sb-accordion__chev" aria-hidden>
              ▼
            </span>
          </button>
          {open[idx] && <div className="an-sb-accordion__body">{sec.content}</div>}
        </div>
      ))}
    </div>
  );
}
