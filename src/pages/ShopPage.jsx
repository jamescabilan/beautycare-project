import React from 'react';
import { Hero } from '../components/Hero';
import { ProductGrid } from '../components/ProductGrid';

export function ShopPage() {
  return (
    <div className="page active">
      <Hero />
      <ProductGrid />
    </div>
  );
}
