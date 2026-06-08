import React from 'react';
import FilterInfoButton from './FilterInfoButton';
import './market-insights-filters.css';
import './screener-context-filters.css';

/**
 * Reusable filter bar for screeners tables & MF explorer.
 * Each field may include `info` (tooltip) and `disabled`.
 */
export default function MarketInsightsFilterBar({
  primaryFields = [],
  secondaryFields = [],
  tertiaryFields = [],
  onReset,
  resetLabel = 'Reset All Filters',
  className = '',
  sectionInfo,
}) {
  const renderField = (field) => {
    const {
      id,
      label,
      type = 'select',
      value,
      onChange,
      options = [],
      placeholder,
      disabled,
    } = field;

    return (
      <label
        key={id}
        className={`mi-filters__field${disabled ? ' mi-filters__field--disabled' : ''}`}
        htmlFor={id}
      >
        <span className="mi-filters__label-row">
          <span className="mi-filters__label">{label}</span>
        </span>
        {type === 'search' ? (
          <input
            id={id}
            type="search"
            className="mi-filters__control"
            value={value}
            placeholder={placeholder}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
          />
        ) : type === 'date' ? (
          <input
            id={id}
            type="date"
            className="mi-filters__control"
            value={value}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
          />
        ) : (
          <select
            id={id}
            className="mi-filters__control"
            value={value}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}
      </label>
    );
  };

  const showSecondary = secondaryFields.length > 0;
  const showActions = tertiaryFields.length > 0 || onReset;

  return (
    <div className={`scf-filter-card mi-filters-wrap${className ? ` ${className}` : ''}`}>
      {sectionInfo && (
        <div className="scf-filter-card__head">
          <span className="scf-filter-card__title">Filters</span>
          <FilterInfoButton text={sectionInfo} label="About these filters" variant="i" align="end" />
        </div>
      )}
      <div className={`mi-filters${className ? ` ${className}` : ''}`}>
        {primaryFields.length > 0 && (
          <div className="mi-filters__row">{primaryFields.map(renderField)}</div>
        )}
        {showSecondary && (
          <div className="mi-filters__row mi-filters__row--secondary">
            {secondaryFields.map(renderField)}
          </div>
        )}
        {showActions && (
          <div className="mi-filters__row mi-filters__row--actions">
            {tertiaryFields.map(renderField)}
            {onReset && (
              <button type="button" className="mi-filters__reset" onClick={onReset}>
                {resetLabel}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
