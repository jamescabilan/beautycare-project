import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { showToast, getCategories, filterProducts, sortProducts, formatPrice, getStarRating, getStockStatus } from '../utils/helpers';
import '../styles/products.css';

export function ProductGrid() {
  const { products, addToBag } = useContext(AppContext);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortType, setSortType] = useState('default');

  const categories = getCategories(products);
  let filtered = filterProducts(products, search, selectedCategory);
  filtered = sortProducts(filtered, sortType);

  const bgColors = {
    'Skincare': '#fdf0ec',
    'Makeup': '#fce4f0',
    'Haircare': '#f0e8ff',
    'Body Care': '#e8f5e9',
    'Fragrance': '#fff9e8',
    'Tools & Brushes': '#e8f0fe'
  };

  const handleAddToBag = (product) => {
    addToBag(product.id);
    showToast(`${product.emoji} ${product.name} added to bag!`, 'success');
  };

  return (
    <div className="shop-section">
      <div className="section-header">
        <h2>Beauty Collection</h2>
        <p>Authentic, skin-friendly beauty products curated for modern lifestyles</p>
      </div>

      <div className="filters">
        <div className="filter-group">
          <label>Search Products</label>
          <input
            className="filter-input"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label>Category</label>
          <select
            className="filter-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Sort By</label>
          <select
            className="filter-select"
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
          >
            <option value="default">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name A–Z</option>
          </select>
        </div>
      </div>

      <div className="product-grid">
        {filtered.length === 0 ? (
          <div className="no-products">
            <div className="icon">🔍</div>
            <h3>No products found</h3>
            <p>Try a different search or category.</p>
          </div>
        ) : (
          filtered.map(product => {
            const { class: stockClass, label: stockLabel } = getStockStatus(product.stock);
            const bg = bgColors[product.category] || '#f5f0ff';
            const stars = getStarRating(product.rating);

            return (
              <div key={product.id} className="product-card">
                <div className="product-img" style={{ background: bg }}>
                  {product.badge && (
                    <div className={`product-badge-tag ${product.badge}`}>
                      {product.badge.charAt(0).toUpperCase() + product.badge.slice(1)}
                    </div>
                  )}
                  <span style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))' }}>
                    {product.emoji}
                  </span>
                </div>
                <div className="product-info">
                  <div className="product-category">{product.category}</div>
                  <div className="product-name">{product.name}</div>
                  <div className="stars">
                    {stars} <span style={{ color: 'var(--text-light)', fontSize: '11px' }}>
                      {product.rating} · {stockLabel}
                    </span>
                  </div>
                  <div className="product-desc">{product.description}</div>
                  <div className="product-footer">
                    <div className="product-price">
                      {formatPrice(product.price)}
                      {product.oprice && (
                        <span className="original">{formatPrice(product.oprice)}</span>
                      )}
                    </div>
                    {product.stock > 0 ? (
                      <button
                        className="add-btn"
                        onClick={() => handleAddToBag(product)}
                      >
                        + Add
                      </button>
                    ) : (
                      <span style={{ fontSize: '12px', color: 'var(--text-light)' }}>
                        Unavailable
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
