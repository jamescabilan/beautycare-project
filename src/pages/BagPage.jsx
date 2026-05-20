import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { formatPrice, showToast } from '../utils/helpers';
import '../styles/bag.css';

export function BagPage({ onCheckout, onShopClick }) {
  const {
    bag,
    orders,
    removeFromBag,
    changeQty,
    cancelOrder,
    clearBag
  } = useContext(AppContext);
  const [trackId, setTrackId] = useState('');
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [trackError, setTrackError] = useState('');

  const hasBagItems = bag.length > 0;
  const subtotal = bag.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal >= 1500 ? 0 : 120;
  const total = subtotal + shipping;

  const handleTrackSubmit = (event) => {
    event.preventDefault();
    const normalized = trackId.trim();
    if (!normalized) {
      setTrackError('Please enter an order ID');
      setTrackedOrder(null);
      return;
    }

    const numericId = Number(normalized.replace(/^#/, ''));
    if (!Number.isFinite(numericId) || numericId <= 0) {
      setTrackError('Order ID must be a positive number');
      setTrackedOrder(null);
      return;
    }

    const match = orders.find(order => order.id === numericId);
    if (!match) {
      setTrackError(`No order found with ID #${numericId}`);
      setTrackedOrder(null);
      return;
    }

    setTrackError('');
    setTrackedOrder(match);
    showToast('Order found ✓', 'success');
  };

  return (
    <div className="page">
      <div className="bag-page">
        <h2>My Bag 🛍</h2>
        {hasBagItems ? (
          <div className="bag-content-grid">
            <div>
              <div className="bag-items">
                {bag.map(item => (
                  <div key={item.id} className="bag-item">
                    <div className="bag-item-img">{item.emoji}</div>
                    <div className="bag-item-info">
                      <div className="bag-item-cat">{item.category}</div>
                      <div className="bag-item-name">{item.name}</div>
                      <div className="bag-item-price">
                        {formatPrice(item.price * item.qty)}
                      </div>
                    </div>
                    <div className="qty-control">
                      <button
                        className="qty-btn"
                        onClick={() => changeQty(item.id, -1)}
                      >
                        −
                      </button>
                      <span className="qty-num">{item.qty}</span>
                      <button
                        className="qty-btn"
                        onClick={() => changeQty(item.id, 1)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="remove-btn"
                      onClick={() => removeFromBag(item.id)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <button className="btn-outline" onClick={onShopClick}>
                ← Continue Shopping
              </button>
            </div>
            <div className="bag-summary">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Subtotal ({bag.reduce((s, b) => s + b.qty, 0)} items)</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>
                  {shipping === 0 ? (
                    <span style={{ color: 'var(--rose)' }}>FREE</span>
                  ) : (
                    formatPrice(shipping)
                  )}
                </span>
              </div>
              {shipping > 0 && (
                <div style={{ fontSize: '12px', color: 'var(--text-light)', marginBottom: '8px' }}>
                  Spend {formatPrice(1500 - subtotal)} more for free shipping
                </div>
              )}
              <div className="summary-row total">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
              <button className="checkout-btn" onClick={onCheckout}>
                Proceed to Checkout →
              </button>
              <button
                className="cancel-order-btn"
                onClick={() => {
                  clearBag();
                  showToast('Bag cleared', 'info');
                }}
              >
                Cancel Bag
              </button>
            </div>
          </div>
        ) : (
          <div className="bag-empty">
            <div className="icon">🛍</div>
            <h3>Your bag is empty</h3>
            <p>Discover our beautiful collection and add your favorites.</p>
            <button className="btn-primary" onClick={onShopClick}>
              Shop Now
            </button>
          </div>
        )}

        {orders.length > 0 && (
          <div className="order-history">
            <h3>My Orders</h3>
            <div className="order-list">
              {orders.map(order => {
                const orderItemsCount = Number.isFinite(order.items)
                  ? order.items
                  : order.orderItems?.reduce((sum, item) => sum + item.qty, 0) || 0;
                const displayStatus = ['Preparing', 'On the Way', 'Delivered', 'Cancelled'].includes(order.status)
                  ? order.status
                  : 'Preparing';

                return (
                <div key={order.id} className="order-card">
                  <div className="order-meta">
                    <div className="order-id">Order #{order.id}</div>
                    <div className={`order-status ${displayStatus.toLowerCase().replace(/\s+/g, '-')}`}>
                      {displayStatus}
                    </div>
                  </div>
                  <div className="order-info">
                    <span>{orderItemsCount} item(s)</span>
                    <span>{formatPrice(order.total)}</span>
                    <span>{order.date}</span>
                  </div>
                  <button
                    className="order-cancel-btn"
                    disabled={displayStatus !== 'Preparing'}
                    onClick={() => cancelOrder(order.id)}
                  >
                    Cancel Order
                  </button>
                </div>
              )})}
            </div>
          </div>
        )}

        <div className="order-tracker">
          <h3>Track Order</h3>
          <form className="track-form" onSubmit={handleTrackSubmit}>
            <input
              className="track-input"
              value={trackId}
              onChange={(event) => setTrackId(event.target.value)}
              placeholder="Enter Order ID (e.g. 102)"
            />
            <button className="track-btn" type="submit">
              Track
            </button>
          </form>
          {trackError && <div className="track-error">{trackError}</div>}
          {trackedOrder && (
            <div className="track-card">
              <div className="track-header">
                <span className="track-id">Order #{trackedOrder.id}</span>
                <span className={`order-status ${trackedOrder.status.toLowerCase().replace(/\s+/g, '-')}`}>
                  {trackedOrder.status}
                </span>
              </div>
              <div className="track-grid">
                <div>
                  <div className="track-label">Customer</div>
                  <div className="track-value">{trackedOrder.customer}</div>
                </div>
                <div>
                  <div className="track-label">Date</div>
                  <div className="track-value">{trackedOrder.date}</div>
                </div>
                <div>
                  <div className="track-label">Items</div>
                  <div className="track-value">
                    {Number.isFinite(trackedOrder.items)
                      ? trackedOrder.items
                      : trackedOrder.orderItems?.reduce((sum, item) => sum + item.qty, 0) || 0}
                  </div>
                </div>
                <div>
                  <div className="track-label">Total</div>
                  <div className="track-value">{formatPrice(trackedOrder.total)}</div>
                </div>
                <div>
                  <div className="track-label">Payment</div>
                  <div className="track-value">{trackedOrder.payment}</div>
                </div>
                <div>
                  <div className="track-label">Fulfillment</div>
                  <div className="track-value">{trackedOrder.branch}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
