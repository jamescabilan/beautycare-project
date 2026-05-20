import React from 'react';
import '../styles/hero.css';

export function Hero() {
  return (
    <div className="hero">
      <h1>LuxeCare Beauty Co.</h1>
      <p>Professional beauty essentials for your daily routine</p>
      <div className="hero-badges">
        <span className="badge">🌿 Skin-friendly</span>
        <span className="badge">✨ Curated Collection</span>
        <span className="badge">🚚 Free Delivery ₱1,500+</span>
        <span className="badge">💯 Authentic Products</span>
      </div>
    </div>
  );
}
