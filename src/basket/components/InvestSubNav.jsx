import React from 'react';
import { NavLink } from 'react-router-dom';
import { BASKET_PRODUCT_NAME } from '../data/baskets';

/** Single-product invest nav — mutual fund baskets only. */
export default function InvestSubNav() {
  return (
    <nav className="an-invest-subnav an-invest-subnav--single" aria-label="Invest">
      <NavLink
        to="/invest/baskets"
        className={({ isActive }) => (isActive ? 'an-subnav-active' : '')}
      >
        {BASKET_PRODUCT_NAME}
      </NavLink>
    </nav>
  );
}
