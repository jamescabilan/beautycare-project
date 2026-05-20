import React, { useState } from 'react';
import { formatPrice, showToast } from '../../utils/helpers';
import '../../styles/modals.css';

export function CheckoutModal({ isOpen, onClose, onPlaceOrder, bag, receipt }) {
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    email: '',
    phone: '',
    address: '',
    payment: 'Cash on Delivery',
    branch: 'Home Delivery'
  });

  const receiptItems = receipt?.orderItems || [];
  const receiptSubtotal = receiptItems.reduce((sum, item) => sum + item.total, 0);
  const receiptShipping = receipt && receipt.total ? receipt.total - receiptSubtotal : 0;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { fname, lname, email, phone, address, branch } = formData;
    
    if (!fname.trim() || !lname.trim() || !email.trim()) {
      showToast('Please fill in required fields', 'error');
      return;
    }

    if (!phone.trim()) {
      showToast('Phone number is required', 'error');
      return;
    }

    if (branch === 'Home Delivery' && !address.trim()) {
      showToast('Delivery address is required', 'error');
      return;
    }

    onPlaceOrder({
      customer: `${fname} ${lname}`,
      email,
      phone,
      address,
      items: bag.length,
      payment: formData.payment,
      branch: formData.branch
    });

    setFormData({
      fname: '',
      lname: '',
      email: '',
      phone: '',
      address: '',
      payment: 'Cash on Delivery',
      branch: 'Home Delivery'
    });
  };

  return (
    <div className={`modal-overlay ${isOpen ? 'open' : ''}`}>
      <div className="modal">
        {receipt ? (
          <div className="receipt-panel">
            <div className="receipt-header">
              <div>
                <h3>Order Receipt</h3>
                <p>Your order has been placed successfully.</p>
              </div>
              <div className="receipt-id">
                Tracking ID: <span>#{receipt.id}</span>
              </div>
            </div>

            <div className="receipt-section">
              <div className="receipt-row">
                <span>Status</span>
                <span className={`receipt-status ${receipt.status.toLowerCase().replace(/\s+/g, '-')}`}>
                  {receipt.status}
                </span>
              </div>
              <div className="receipt-row">
                <span>Date</span>
                <span>{receipt.date}</span>
              </div>
              <div className="receipt-row">
                <span>Customer</span>
                <span>{receipt.customer}</span>
              </div>
              <div className="receipt-row">
                <span>Email</span>
                <span>{receipt.email}</span>
              </div>
              <div className="receipt-row">
                <span>Phone</span>
                <span>{receipt.phone}</span>
              </div>
              <div className="receipt-row">
                <span>Fulfillment</span>
                <span>{receipt.branch}</span>
              </div>
              {receipt.address && (
                <div className="receipt-row">
                  <span>Address</span>
                  <span>{receipt.address}</span>
                </div>
              )}
              <div className="receipt-row">
                <span>Payment</span>
                <span>{receipt.payment}</span>
              </div>
            </div>

            <div className="receipt-items">
              {receiptItems.map(item => (
                <div key={item.id} className="receipt-item">
                  <div>
                    <div className="receipt-item-name">{item.name}</div>
                    <div className="receipt-item-qty">Qty: {item.qty}</div>
                  </div>
                  <div className="receipt-item-total">{formatPrice(item.total)}</div>
                </div>
              ))}
            </div>

            <div className="receipt-totals">
              <div className="receipt-row">
                <span>Subtotal</span>
                <span>{formatPrice(receiptSubtotal)}</span>
              </div>
              <div className="receipt-row">
                <span>Shipping</span>
                <span>{formatPrice(receiptShipping)}</span>
              </div>
              <div className="receipt-row receipt-total">
                <span>Total</span>
                <span>{formatPrice(receipt.total)}</span>
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn-primary" onClick={onClose}>
                Done
              </button>
            </div>
          </div>
        ) : (
          <>
            <h3>Complete Your Order</h3>
            <p>Enter your details to place your order.</p>
            <form onSubmit={handleSubmit} className="checkout-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input
                    className="form-input"
                    name="fname"
                    placeholder="Maria"
                    value={formData.fname}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input
                    className="form-input"
                    name="lname"
                    placeholder="Santos"
                    value={formData.lname}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  className="form-input"
                  name="email"
                  type="email"
                  placeholder="maria@email.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input
                  className="form-input"
                  name="phone"
                  placeholder="+63 9XX XXX XXXX"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Delivery Address</label>
                <input
                  className="form-input"
                  name="address"
                  placeholder="Street, Barangay, City"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Payment Method</label>
                  <select
                    className="form-select"
                    name="payment"
                    value={formData.payment}
                    onChange={handleChange}
                  >
                    <option>Cash on Delivery</option>
                    <option>GCash</option>
                    <option>Maya</option>
                    <option>Credit/Debit Card</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Branch Pickup</label>
                  <select
                    className="form-select"
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                  >
                    <option>Home Delivery</option>
                    <option>BGC Branch</option>
                    <option>Makati Branch</option>
                    <option>QC Branch</option>
                    <option>Cebu Branch</option>
                  </select>
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-outline" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Place Order ✓
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
