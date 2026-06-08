import React from 'react';
import { MF_EXPLORER_PRESETS } from './mfExplorerConfig';
import './market-insights-filters.css';

export default function MfExplorerShortcuts({ activePreset, onSelect }) {
  return (
    <div className="mi-shortcuts" role="toolbar" aria-label="Quick fund screens">
      {MF_EXPLORER_PRESETS.map((preset) => (
        <button
          key={preset.id}
          type="button"
          className={`mi-shortcuts__btn mi-shortcuts__btn--brand${activePreset === preset.id ? ' is-active' : ''}`}
          title={preset.description}
          onClick={() => onSelect(preset.id)}
        >
          {preset.label}
        </button>
      ))}
    </div>
  );
}
