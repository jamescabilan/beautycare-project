import React, { useState } from 'react';
import { AppProvider, AppContext } from './context/AppContext';
import { Navigation } from './components/Navigation';
import { Toast } from './components/Toast';
import { CheckoutModal } from './components/modals/CheckoutModal';
import { ShopPage } from './pages/ShopPage';
import { BagPage } from './pages/BagPage';
import { BranchesPage } from './pages/BranchesPage';
import { AdminPage } from './pages/AdminPage';
import { showToast } from './utils/helpers';
import './styles/global.css';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('shop');
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderReceipt, setOrderReceipt] = useState(null);
  const context = React.useContext(AppContext);

  const handleCheckout = () => {
    setCheckoutOpen(true);
    setOrderReceipt(null);
  };

  const handlePlaceOrder = async (orderData) => {
    const newOrder = await context.placeOrder(orderData);
    if (!newOrder || typeof newOrder !== 'object') {
      return;
    }
    setOrderReceipt(newOrder);
    showToast('✅ Order placed successfully!', 'success');
  };

  const handleLoginSuccess = (userData) => {
    context.login(userData);
  };

  const handleLogout = () => {
    context.logout();
    setCurrentPage('shop');
    showToast('Logged out successfully', 'info');
  };

  const handleAdminClick = () => {
    setCurrentPage('admin');
  };

  return (
    <div>
      <Navigation 
        currentPage={currentPage} 
        onPageChange={setCurrentPage}
        currentUser={context.currentUser}
        onLogout={handleLogout}
        onAdminClick={handleAdminClick}
      />
      <Toast />

      {currentPage === 'shop' && <ShopPage />}
      {currentPage === 'bag' && (
        <BagPage
          onCheckout={handleCheckout}
          onShopClick={() => setCurrentPage('shop')}
        />
      )}
      {currentPage === 'branches' && <BranchesPage />}
      {currentPage === 'admin' && context.currentUser ? (
        <AdminPage 
          currentUser={context.currentUser}
          onLogout={handleLogout}
        />
      ) : currentPage === 'admin' ? (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
          <div style={{ textAlign: 'center', maxWidth: '500px' }}>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', marginBottom: '20px', color: 'var(--charcoal)' }}>Admin Portal</h1>
            <p style={{ color: 'var(--text-light)', marginBottom: '30px' }}>You need to log in to access the admin portal.</p>
            <AdminLoginGate onLoginSuccess={handleLoginSuccess} staffAccounts={context.staffAccounts} />
          </div>
        </div>
      ) : null}

      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => {
          setCheckoutOpen(false);
          setOrderReceipt(null);
          setTimeout(() => setCurrentPage('shop'), 300);
        }}
        onPlaceOrder={handlePlaceOrder}
        bag={context.bag}
        receipt={orderReceipt}
      />
    </div>
  );
}

// Simple login form for admin access
function AdminLoginGate({ onLoginSuccess, staffAccounts = [] }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin');
  const [error, setError] = useState('');

  const ACCOUNTS = [
    { username: 'admin', password: 'admin123', role: 'admin', name: 'Administrator' },
    { username: 'staff', password: 'staff123', role: 'staff', name: 'Maria Santos' },
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Check regular accounts first
    let account = ACCOUNTS.find(
      acc => acc.username === username && acc.password === password && acc.role === role
    );

    if (account) {
      onLoginSuccess(account);
      setError('');
      return;
    }

    // If staff role, also check staff accounts created in the app
    if (role === 'staff') {
      account = staffAccounts.find(
        acc => acc.username === username && acc.password === password
      );

      if (account) {
        onLoginSuccess({
          role: 'staff',
          username: account.username,
          name: account.name,
          branch: account.branch,
          staffRole: account.role  // Include the staff's role (beauty_consultant, cashier, etc.)
        });
        setError('');
        return;
      }
    }

    setError('Invalid credentials for ' + role);
  };

  return (
    <div style={{ background: 'white', padding: '30px', borderRadius: '16px', boxShadow: 'var(--shadow)', maxWidth: '400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button
          onClick={() => setRole('admin')}
          style={{
            flex: 1,
            padding: '10px',
            background: role === 'admin' ? 'var(--rose)' : 'var(--cream)',
            color: role === 'admin' ? 'white' : 'var(--charcoal)',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          👑 Admin
        </button>
        <button
          onClick={() => setRole('staff')}
          style={{
            flex: 1,
            padding: '10px',
            background: role === 'staff' ? 'var(--staff-accent)' : 'var(--cream)',
            color: role === 'staff' ? 'white' : 'var(--charcoal)',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          🧑‍💼 Staff
        </button>
      </div>

      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '5px', color: 'var(--text-mid)' }}>
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              fontSize: '14px'
            }}
            placeholder="Enter username"
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '5px', color: 'var(--text-mid)' }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              fontSize: '14px'
            }}
            placeholder="Enter password"
          />
        </div>

        {error && (
          <div style={{ background: '#fce4ec', color: '#c62828', padding: '10px', borderRadius: '6px', marginBottom: '15px', fontSize: '12px' }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '12px',
            background: role === 'admin' ? 'var(--deep-rose)' : 'var(--staff-accent)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Sign In
        </button>
      </form>

      <div style={{ marginTop: '15px', fontSize: '12px', color: 'var(--text-light)', textAlign: 'center' }}>
        Demo: <code style={{ background: 'var(--cream)', padding: '2px 6px', borderRadius: '4px' }}>admin/admin123</code> or <code style={{ background: 'var(--cream)', padding: '2px 6px', borderRadius: '4px' }}>staff/staff123</code>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
