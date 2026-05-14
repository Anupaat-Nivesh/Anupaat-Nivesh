import React from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { FiHome, FiPieChart, FiTarget, FiSliders } from 'react-icons/fi';
import { useBasketUser } from '../context/BasketUserContext';
import '../styles/basket-platform.css';
import '../components/registerCharts';

export default function BasketLayout() {
  const { darkMode, setDarkMode } = useBasketUser();
  const themeClass = darkMode ? '' : 'an-basket-app--light';

  return (
    <div className={`an-basket-app ${themeClass}`}>
      <header className="an-nav">
        <Link to="/invest" className="an-nav-brand">
          Anupaat Nivesh <span className="an-gold-text">Elemental</span>
        </Link>
        <div className="an-nav-actions">
          <button
            type="button"
            className="an-icon-btn"
            aria-label="Toggle theme"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
          <Link to="/" className="an-btn-ghost" style={{ fontSize: '0.8rem', padding: '0.5rem 0.85rem' }}>
            Main site
          </Link>
        </div>
      </header>

      <div className="an-basket-inner">
        <Outlet />
      </div>

      <nav className="an-bottom-nav an-hide-md" aria-label="Primary">
        <NavLink end className={({ isActive }) => (isActive ? 'an-active' : '')} to="/invest">
          <FiHome size={20} />
          Discover
        </NavLink>
        <NavLink className={({ isActive }) => (isActive ? 'an-active' : '')} to="/invest/dashboard">
          <FiPieChart size={20} />
          Wealth
        </NavLink>
        <NavLink className={({ isActive }) => (isActive ? 'an-active' : '')} to="/invest/goals">
          <FiTarget size={20} />
          Goals
        </NavLink>
        <NavLink className={({ isActive }) => (isActive ? 'an-active' : '')} to="/invest/risk-profile">
          <FiSliders size={20} />
          Profile
        </NavLink>
      </nav>

      <style>{`
        .an-bottom-nav .an-active { color: var(--an-emerald) !important; }
        .an-bottom-nav svg { opacity: 0.85; }
        .an-bottom-nav .an-active svg { opacity: 1; }
      `}</style>
    </div>
  );
}
