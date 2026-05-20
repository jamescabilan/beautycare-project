import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { SaleModal } from '../../components/modals/SaleModal';
import { formatPrice, getCategories, filterProducts, showToast } from '../../utils/helpers';
import '../../styles/admin-pos.css';

export function POSPage() {
  const { products, salesTransactions, recordSale } = useContext(AppContext);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [saleModalOpen, setSaleModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const categories = getCategories(products);
  const todaysSales = salesTransactions.filter(s => 
    s.date === new Date().toLocaleDateString('en-PH')
  );
  const todaysRevenue = todaysSales.reduce((sum, s) => sum + s.total, 0);

  const filtered = filterProducts(products, search, selectedCategory);
  const categoryBgMap = {
    Skincare: '#fdf0ec',
    Makeup: '#fce4f0',
    Haircare: '#f0e8ff',
    'Body Care': '#e8f5e9',
    Fragrance: '#fff9e8',
    'Tools & Brushes': '#e8f0fe'
  };

  const handleQuickSale = (product) => {
    if (product.stock <= 0) {
      showToast('Out of stock', 'error');
      return;
    }
    setSelectedProduct(product);
    setSaleModalOpen(true);
  };

  const handleRecordSale = (saleData) => {
    recordSale(saleData);
    setSaleModalOpen(false);
    setSelectedProduct(null);
    showToast(`Sale recorded — ${saleData.qty} unit(s)`, 'success');
  };

  return (
    <div className="pos-page">
      <div className="page-header-alt">
        <div>
          <h2>Point of Sale</h2>
          <p>Process walk-in transactions and counter sales</p>
        </div>
      </div>

      <div className="pos-stats">
        <div className="stat-card">
          <div className="stat-label">Today Sales</div>
          <div className="stat-value">{todaysSales.length}</div>
          <div className="stat-sub">Transactions</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Today Revenue</div>
          <div className="stat-value">{formatPrice(todaysRevenue)}</div>
          <div className="stat-sub">Counter sales</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Available Stock</div>
          <div className="stat-value">{products.filter(p => p.stock > 0).length}</div>
          <div className="stat-sub">In stock</div>
        </div>
      </div>

      <div className="filters-section">
        <div className="filter-group">
          <label>Search Products</label>
          <input
            type="text"
            placeholder="Search by name or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
          />
        </div>
        <div className="filter-group">
          <label>Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="form-select"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="products-grid">
        {filtered.map(product => (
          <div
            key={product.id}
            className="product-card-pos"
            style={{ borderTop: `3px solid ${categoryBgMap[product.category] || '#f5f0ff'}` }}
          >
            <div
              className="product-emoji-bg"
              style={{ backgroundColor: categoryBgMap[product.category] || '#f5f0ff' }}
            >
              <span className="emoji">{product.emoji}</span>
            </div>

            <div className="product-info">
              <div className="category-badge">{product.category}</div>
              <h4>{product.name}</h4>
              <p className="description">{product.description.slice(0, 50)}...</p>

              <div className="product-footer">
                <div>
                  <div className="price">{formatPrice(product.price)}</div>
                  <div className="stock-info">
                    Stock: {product.stock > 0 ? (
                      <span className="in-stock">{product.stock}</span>
                    ) : (
                      <span className="out-of-stock">Out</span>
                    )}
                  </div>
                </div>
                <button
                  className={`btn-quick-sale ${product.stock > 0 ? '' : 'disabled'}`}
                  onClick={() => handleQuickSale(product)}
                  disabled={product.stock <= 0}
                >
                  Sell
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {saleModalOpen && selectedProduct && (
        <SaleModal
          product={selectedProduct}
          onClose={() => setSaleModalOpen(false)}
          onRecordSale={handleRecordSale}
        />
      )}
    </div>
  );
}
