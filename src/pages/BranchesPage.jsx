import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import '../styles/branches.css';

export function BranchesPage() {
  const { branches } = useContext(AppContext);

  return (
    <div className="page">
      <div className="branches-page">
        <div className="section-header">
          <h2>Our Branches</h2>
          <p>Find us near you — walk in or schedule a consultation</p>
        </div>
        <div className="branches-grid">
          {branches.map((branch, idx) => (
            <div key={idx} className="branch-card">
              <div className="branch-icon">{branch.emoji}</div>
              <div className="branch-name">{branch.name}</div>
              <div className="branch-address">📍 {branch.address}</div>
              <div className="branch-detail">🕐 {branch.hours}</div>
              <div className="branch-detail">📞 {branch.phone}</div>
              <span className="branch-tag">{branch.tag}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
