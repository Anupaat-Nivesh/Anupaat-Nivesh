import React from 'react';

/**
 * Table body inside a fixed-height scroll region (sticky header).
 */
export default function ScrollableTable({ children, maxHeight, className = '' }) {
  return (
    <div
      className={`mi-panel__scroll${className ? ` ${className}` : ''}`}
      style={maxHeight ? { maxHeight } : undefined}
    >
      {children}
    </div>
  );
}
