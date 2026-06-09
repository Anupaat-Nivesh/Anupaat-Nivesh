import React from 'react';

export default function ScripboxCard({ title, children, info = 'i' }) {
  return (
    <div className="an-sb-card">
      <div className="an-sb-card__title">
        {title}
        <span className="an-sb-info" title="Illustrative analytics — replace with live fund data when provided">
          {info}
        </span>
      </div>
      {children}
    </div>
  );
}
