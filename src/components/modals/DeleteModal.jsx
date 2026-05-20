import React from 'react';
import '../../styles/modals.css';

export function DeleteModal({ isOpen, onClose, onConfirm }) {
  return (
    <div className={`modal-overlay ${isOpen ? 'open' : ''}`}>
      <div className="modal">
        <h3>Delete Product?</h3>
        <p>This will permanently remove the product from your catalog. This cannot be undone.</p>
        <div className="modal-actions">
          <button className="btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn-primary"
            style={{ background: 'var(--deep-rose)' }}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
