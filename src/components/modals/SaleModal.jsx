import React, { useState } from 'react';
import { formatPrice } from '../../utils/helpers';
import '../../styles/modals.css';

export function SaleModal({ product, onClose, onRecordSale }) {
  const [qty, setQty] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('Cash');

  const total = product.price * qty;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (qty <= 0 || qty > product.stock) {
      alert(`Invalid quantity. Available: ${product.stock}`);
      return;
    }

    onRecordSale({
      productId: product.id,
      productName: product.name,
      emoji: product.emoji,
      qty,
      total,
      payment: paymentMethod,
      staff: 'Staff'
    });
  };

  return (
    <div className="modal-overlay open">
      <div className="modal" style={{ maxWidth: '500px' }}>
        <h3>Record Sale</h3>
        <p>Process a counter transaction</p>

        <div className="modal-product" style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#f5f0ff', borderRadius: '12px' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>{product.emoji}</div>
          <div style={{ fontWeight: '600', marginBottom: '4px' }}>{product.name}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-light)' }}>{product.category}</div>
          <div style={{ fontSize: '18px', fontWeight: '700', marginTop: '8px' }}>
            {formatPrice(product.price)} per unit
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-light)', marginTop: '4px' }}>
            Available: {product.stock} units
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Quantity</label>
            <input
              className="form-input"
              type="number"
              min="1"
              max={product.stock}
              value={qty}
              onChange={(e) => setQty(parseInt(e.target.value) || 1)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Payment Method</label>
            <select
              className="form-select"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option>Cash</option>
              <option>GCash</option>
              <option>Maya</option>
              <option>Card</option>
            </select>
          </div>

          <div
            style={{
              padding: '16px',
              backgroundColor: '#f5f0ff',
              borderRadius: '12px',
              marginBottom: '20px'
            }}
          >
            <div style={{ fontSize: '12px', color: 'var(--text-light)', marginBottom: '8px' }}>
              {qty} × {formatPrice(product.price)}
            </div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--charcoal)' }}>
              Total: {formatPrice(total)}
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Record Sale ✓
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
