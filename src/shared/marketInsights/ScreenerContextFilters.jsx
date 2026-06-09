import React, { useEffect, useMemo, useState } from 'react';
import FilterInfoButton from './FilterInfoButton';
import { defaultFilterState, getContextFilterPreset } from './screenerFilterConfig';
import './screener-context-filters.css';

/**
 * Compact filter row (screenshot style): (i) + white dropdown pills.
 */
export default function ScreenerContextFilters({
  screenerType,
  values: controlledValues,
  onChange,
  dynamicOptions = {},
}) {
  const preset = useMemo(() => getContextFilterPreset(screenerType), [screenerType]);
  const [internal, setInternal] = useState(() => defaultFilterState(preset));

  const values = controlledValues ?? internal;

  useEffect(() => {
    if (!preset) return;
    setInternal(defaultFilterState(preset));
  }, [screenerType]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!preset?.filters?.length) return null;

  const setValue = (key, value) => {
    const next = { ...values, [key]: value };
    if (onChange) onChange(next);
    else setInternal(next);
  };

  return (
    <div className="scf-bar" role="group" aria-label="Section filters">
      {preset.filters.map((filter) => {
        const options =
          dynamicOptions[filter.key]?.length > 0
            ? dynamicOptions[filter.key]
            : filter.options || [];
        const disabled = filter.disabled || (filter.key !== 'search' && options.length === 0);

        if (filter.type === 'search') {
          return (
            <label key={filter.key} className="scf-pill scf-pill--search">
              <span className="scf-pill__sr">{filter.ariaLabel}</span>
              <input
                type="search"
                className="scf-pill__input"
                placeholder={filter.placeholder || 'Search…'}
                value={values[filter.key] ?? ''}
                disabled={disabled}
                onChange={(e) => setValue(filter.key, e.target.value)}
              />
            </label>
          );
        }

        return (
          <label key={filter.key} className={`scf-pill${disabled ? ' scf-pill--disabled' : ''}`}>
            <span className="scf-pill__sr">{filter.ariaLabel}</span>
            <select
              className="scf-pill__select"
              value={values[filter.key] ?? filter.defaultValue}
              disabled={disabled}
              onChange={(e) => setValue(filter.key, e.target.value)}
              aria-label={filter.ariaLabel}
            >
              {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
        );
      })}

      {preset.sectionInfo && (
        <FilterInfoButton
          text={preset.sectionInfo}
          label={`About ${screenerType} filters`}
          variant="i"
          align="end"
        />
      )}
    </div>
  );
}
