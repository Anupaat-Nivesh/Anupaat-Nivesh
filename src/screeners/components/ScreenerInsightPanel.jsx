import React from 'react';
import HubInsightCard from './HubInsightCard';
import '../styles/screener-hub-cards.css';

/**
 * Catalog-linked insight panel — hub card chrome + list body.
 */
export default function ScreenerInsightPanel({
  id,
  title,
  iconTone,
  sectionInfo,
  viewAllHref,
  viewAllLabel = 'View All',
  viewAllVariant = 'link',
  countLabel,
  children,
}) {
  return (
    <HubInsightCard
      id={id}
      title={title}
      iconTone={iconTone}
      sectionInfo={sectionInfo}
      viewAllHref={viewAllHref}
      viewAllLabel={countLabel || viewAllLabel}
      viewAllVariant={viewAllVariant}
    >
      {children}
    </HubInsightCard>
  );
}
