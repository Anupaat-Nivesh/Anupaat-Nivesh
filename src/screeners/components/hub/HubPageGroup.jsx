import React from 'react';

/**
 * Visual + semantic grouping for hub sections (pulse → insights → deals → filings).
 */
export default function HubPageGroup({
  id,
  title,
  description,
  children,
  divider = false,
  className = '',
}) {
  const headingId = id ? `${id}-heading` : undefined;

  return (
    <section
      id={id}
      className={`scr-hub-group${divider ? ' scr-hub-group--divider' : ''}${className ? ` ${className}` : ''}`.trim()}
      aria-labelledby={title ? headingId : undefined}
    >
      {(title || description) && (
        <header className="scr-hub-group__intro">
          {title && (
            <h2 id={headingId} className="scr-hub-group__title">
              {title}
            </h2>
          )}
          {description && <p className="scr-hub-group__desc">{description}</p>}
        </header>
      )}
      <div className="scr-hub-group__content">{children}</div>
    </section>
  );
}
