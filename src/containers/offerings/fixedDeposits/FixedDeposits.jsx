import React from 'react';
import { getProductById } from '../../../data/investProducts';
import ProductLandingPage from '../shared/ProductLandingPage';

export default function FixedDeposits() {
  return <ProductLandingPage product={getProductById('fixed-deposits')} />;
}
