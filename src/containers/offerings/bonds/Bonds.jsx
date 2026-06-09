import React from 'react';
import { getProductById } from '../../../data/investProducts';
import ProductLandingPage from '../shared/ProductLandingPage';

export default function Bonds() {
  return <ProductLandingPage product={getProductById('bonds')} />;
}
