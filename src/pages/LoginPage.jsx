import React, { useState } from 'react';
import '../styles/login.css';

const ACCOUNTS = [
  { username: 'jireh', password: 'faith', role: 'admin', name: 'Administrator', branch: 'HQ' },
  { username: 'jai', password: '212121', role: 'staff', name: 'Maria Santos', branch: 'BGC Branch' },
];

export function LoginPage({ onLoginSuccess, staffAccounts = [] }) {
  const [selectedRole, setSelectedRole] = useState('admin');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showError, setShowError] = useState(false);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setShowError(false);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    
    // First check regular admin/demo accounts
    let match = ACCOUNTS.find(
      a => a.username === username.trim() && 
           a.password === password && 
           a.role === selectedRole
    );

    if (match) {
      onLoginSuccess({
        role: match.role,
        username: match.username,
        name: match.name,
        branch: match.branch
      });
      return;
    }

    // If logging in as staff, check staff accounts created in the app
    if (selectedRole === 'staff') {
      match = staffAccounts.find(
        s => s.username === username.trim() && 
             s.password === password
      );

      if (match) {
        onLoginSuccess({
          role: 'staff',
          username: match.username,
          name: match.name,
          branch: match.branch,
          staffRole: match.role  // Include the staff's role (beauty_consultant, cashier, etc.)
        });
        return;
      }
    }

    setShowError(true);
    setTimeout(() => setShowError(false), 3000);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleLogin(e);
    }
  };

  return (
    <div className="login-screen">
      <div className="login-left">
        <div className="login-brand">
          <div className="login-logo">💄</div>
          <h1>LuxeCare<br />Beauty Co.</h1>
          <p>Your all-in-one portal for managing beauty products, sales, inventory, and team.</p>
          
          <div className="login-features">
            <div className="login-feature">
              <span className="feature-icon">📦</span>
              <div className="feature-text">
                <strong>Inventory Management</strong>
                Track stock levels and product catalog
              </div>
            </div>
            <div className="login-feature">
              <span className="feature-icon">💰</span>
              <div className="feature-text">
                <strong>Sales & Orders</strong>
                Process transactions and view history
              </div>
            </div>
            <div className="login-feature">
              <span className="feature-icon">👥</span>
              <div className="feature-text">
                <strong>Staff Management</strong>
                Monitor attendance and assign roles
              </div>
            </div>
            <div className="login-feature">
              <span className="feature-icon">📊</span>
              <div className="feature-text">
                <strong>Analytics Dashboard</strong>
                Real-time metrics and insights
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-form-wrap">
          <h2>Welcome back</h2>
          <p className="subtitle">Sign in to access your portal</p>

          <div className="role-selector">
            <button
              className={`role-btn ${selectedRole === 'admin' ? 'selected-admin' : ''}`}
              onClick={() => handleRoleSelect('admin')}
              type="button"
            >
              <span className="role-icon">👑</span>
              <span className="role-name">Admin</span>
              <span className="role-desc">Full access</span>
            </button>
            <button
              className={`role-btn ${selectedRole === 'staff' ? 'selected-staff' : ''}`}
              onClick={() => handleRoleSelect('staff')}
              type="button"
            >
              <span className="role-icon">🧑‍💼</span>
              <span className="role-name">Staff</span>
              <span className="role-desc">Counter & sales</span>
            </button>
          </div>

          {showError && (
            <div className="login-error show">
              Incorrect username or password. Try again.
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                className="form-input"
                type="text"
                placeholder={selectedRole === 'admin' ? 'admin' : 'staff'}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className={`form-input ${selectedRole === 'staff' ? 'staff-focus' : ''}`}
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>

            <button
              type="submit"
              className={`login-btn ${selectedRole === 'admin' ? 'admin-btn' : 'staff-btn'}`}
            >
              Sign In as {selectedRole === 'admin' ? 'Admin' : 'Staff'}
            </button>
          </form>

          <div className="login-hint">
            Demo → Admin: <code>admin / admin123</code> &nbsp;|&nbsp; Staff: <code>staff / staff123</code>
          </div>
        </div>
      </div>
    </div>
  );
}
