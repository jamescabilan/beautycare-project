import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import '../../styles/admin-branches.css';

export function BranchesPage() {
  const { branches } = useContext(AppContext);

  return (
    <div className="branches-page">
      <div className="page-header-alt">
        <div>
          <h2>Branch Locations</h2>
          <p>Manage store locations and information</p>
        </div>
      </div>

      <div className="branches-grid">
        {branches.map((branch, idx) => (
          <div key={idx} className="branch-card">
            <div className="branch-header">
              <div className="branch-emoji">{branch.emoji}</div>
              <div className="branch-title">
                <h3>{branch.name}</h3>
                <span className="branch-tag">{branch.tag}</span>
              </div>
            </div>
            
            <div className="branch-info">
              <div className="info-item">
                <span className="info-icon">📍</span>
                <span className="info-text">{branch.address}</span>
              </div>
              <div className="info-item">
                <span className="info-icon">🕐</span>
                <span className="info-text">{branch.hours}</span>
              </div>
              <div className="info-item">
                <span className="info-icon">📱</span>
                <span className="info-text">{branch.phone}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="table-section" style={{ marginTop: '40px' }}>
        <div className="section-title">All Branches</div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Branch</th>
                <th>Address</th>
                <th>Hours</th>
                <th>Phone</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {branches.map((branch, idx) => (
                <tr key={idx}>
                  <td className="branch-name">
                    <span className="emoji">{branch.emoji}</span> {branch.name}
                  </td>
                  <td className="text-muted">{branch.address}</td>
                  <td>{branch.hours}</td>
                  <td>{branch.phone}</td>
                  <td>
                    <span className={`badge ${branch.tag === 'Coming Soon' ? 'badge-coming' : 'badge-active'}`}>
                      {branch.tag === 'Coming Soon' ? 'Coming Soon' : 'Open'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
