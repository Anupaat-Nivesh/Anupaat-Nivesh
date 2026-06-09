import React from 'react';
import { getProductById } from '../../../data/investProducts';
import ProductLandingPage from '../shared/ProductLandingPage';

export default function P2PLending() {
  return <ProductLandingPage product={getProductById('p2p-lending')} />;
}
