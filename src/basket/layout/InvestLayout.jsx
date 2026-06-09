import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { FiPieChart } from 'react-icons/fi';
import { BASKET_PRODUCT_NAME } from '../data/baskets';
import '../styles/basket-platform.css';
import '../styles/basket-screener.css';
import '../styles/basket-cards.css';
import '../styles/basket-shared.css';
import '../components/registerCharts';

export default function InvestLayout() {
  return (
    <div className="an-invest-zone section__padding">
      <div className="an-invest-inner">
        <Outlet />
      </div>

      <nav className="an-invest-bottom-nav an-hide-md an-invest-bottom-nav--single" aria-label="Invest">
        <NavLink
          className={({ isActive }) => (isActive ? 'an-active' : '')}
          to="/invest/baskets"
        >
          <FiPieChart size={20} />
          {BASKET_PRODUCT_NAME}
        </NavLink>
      </nav>
    </div>
  );
}
