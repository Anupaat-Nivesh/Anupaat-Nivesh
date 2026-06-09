import React from 'react';
import ScreenerCatalogCard from './ScreenerCatalogCard';

/**
 * Catalog navigation card + separate data list card (reference layout).
 */
export default function ScreenerCatalogPanel({ id, item, children, loading }) {
  return (
    <article id={id} className="scr-catalog-block">
      <ScreenerCatalogCard item={item} />
      <div className="scr-catalog-block__data mi-card-scroll">
        {loading ? <p className="scr-catalog-panel__empty">Loading…</p> : children}
      </div>
    </article>
  );
}
