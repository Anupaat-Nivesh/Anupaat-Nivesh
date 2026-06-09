import React from 'react';
import ScripboxCard from './ScripboxCard';

export default function ParametersCard({ sharpe, expenseRatio, maxDrawdown, volatility }) {
  return (
    <ScripboxCard title="Parameters">
      <div style={{ padding: '0 1rem 1rem' }}>
        <div className="an-sb-param-row">
          <div>
            <div style={{ fontWeight: 700 }}>
              Sharpe ratio <span style={{ color: '#ef4444', fontSize: '0.7rem' }}>▼</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Higher the better</div>
          </div>
          <span className="an-sb-param-val">{sharpe ?? '—'}</span>
        </div>
        <div className="an-sb-param-row">
          <div>
            <div style={{ fontWeight: 700 }}>
              Expense ratio <span style={{ color: '#ef4444', fontSize: '0.7rem' }}>▼</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Lower the better</div>
          </div>
          <span className="an-sb-param-val">{expenseRatio != null ? `${expenseRatio}%` : '—'}</span>
        </div>
        <div className="an-sb-param-row">
          <div>
            <div style={{ fontWeight: 700 }}>Volatility (ann.)</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>From basket NAV</div>
          </div>
          <span className="an-sb-param-val">{volatility != null ? `${volatility}%` : '—'}</span>
        </div>
        <div className="an-sb-param-row">
          <div>
            <div style={{ fontWeight: 700 }}>Max drawdown</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Peak-to-trough</div>
          </div>
          <span className="an-sb-param-val">{maxDrawdown != null ? `${maxDrawdown}%` : '—'}</span>
        </div>
      </div>
    </ScripboxCard>
  );
}
