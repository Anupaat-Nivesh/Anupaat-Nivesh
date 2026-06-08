import React from 'react';
import { getProductById } from '../../../data/investProducts';
import ProductLandingPage from '../shared/ProductLandingPage';

export default function UnlistedStocks() {
  return <ProductLandingPage product={getProductById('unlisted-stocks')} />;
}
