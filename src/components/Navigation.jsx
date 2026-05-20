import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export function Navigation({ currentPage, onPageChange, currentUser, onLogout, onAdminClick }) {
  const { bag } = useContext(AppContext);
  const bagCount = bag.reduce((sum, item) => sum + item.qty, 0);

  const navLinks = ['shop', 'bag', 'branches'];

  const handleAdminClick = () => {
    if (onAdminClick) {
      onAdminClick();
    } else {
      onPageChange('admin');
    }
  };

  return (
    <nav>
      <a className="nav-brand" onClick={() => onPageChange('shop')}>
        <div className="nav-logo">💄</div>
        <span className="nav-name">LuxeCare Beauty Co.</span>
      </a>
      <div className="nav-links">
        {navLinks.map(link => (
          <button
            key={link}
            className={`nav-link ${currentPage === link ? 'active' : ''}`}
            onClick={() => onPageChange(link)}
          >
            {link.charAt(0).toUpperCase() + link.slice(1)}
          </button>
        ))}
        <button
          className={`nav-link ${currentPage === 'admin' ? 'active' : ''}`}
          onClick={handleAdminClick}
        >
          Admin
        </button>
        <button className="nav-bag-btn" onClick={() => onPageChange('bag')}>
          🛍 Bag <span className="bag-count">{bagCount}</span>
        </button>
        {currentUser && currentPage !== 'admin' && (
          <div className="nav-user-menu">
            <span className="nav-user-name">{currentUser.username} ({currentUser.role})</span>
            <button className="nav-logout-btn" onClick={onLogout}>Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
}
