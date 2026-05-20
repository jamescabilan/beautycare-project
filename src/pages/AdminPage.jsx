import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { DeleteModal } from '../components/modals/DeleteModal';
import { showToast, formatPrice, getStockBadgeClass, getStockBadgeLabel } from '../utils/helpers';
import { STAFF_ROLES, ADMIN_ACCESSIBLE_TABS } from '../constants/staffRoles';
import { StaffManagementPage } from './admin/StaffManagementPage';
import { ReportsPage } from './admin/ReportsPage';
import { BranchesPage } from './admin/BranchesPage';
import { SettingsPage } from './admin/SettingsPage';
import { AttendancePage } from './admin/AttendancePage';
import { POSPage } from './admin/POSPage';
import '../styles/admin.css';

export function AdminPage({ currentUser, onLogout }) {
  const { products, bag, orders, saveProduct, deleteProduct, updateOrderStatus } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('overview');
  const ORDER_STATUSES = ['Preparing', 'On the Way', 'Delivered', 'Cancelled'];
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    category: 'Skincare',
    price: '',
    oprice: '',
    stock: '',
    emoji: '🧴',
    badge: '',
    rating: '4.5',
    description: ''
  });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  // Determine accessible tabs based on user role
  const getAccessibleTabs = () => {
    const allTabs = [
      { id: 'overview', label: 'Overview', icon: '📊' },
      { id: 'products', label: 'Products', icon: '📦' },
      { id: 'orders', label: 'Orders', icon: '🧾' },
      { id: 'staff', label: 'Staff', icon: '👥' },
      { id: 'reports', label: 'Reports', icon: '📈' },
      { id: 'branches', label: 'Branches', icon: '📍' },
      { id: 'attendance', label: 'Attendance', icon: '🕐' },
      { id: 'pos', label: 'POS', icon: '🛒' },
      { id: 'settings', label: 'Settings', icon: '⚙️' }
    ];

    // Admin has full access
    if (currentUser?.role === 'admin') {
      return allTabs.filter(tab => ADMIN_ACCESSIBLE_TABS.includes(tab.id));
    }

    // Staff roles have limited access
    if (currentUser?.role === 'staff') {
      const staffRole = STAFF_ROLES[currentUser?.staffRole] || STAFF_ROLES.beauty_consultant;
      const accessibleTabIds = staffRole.accessibleTabs;
      return allTabs.filter(tab => accessibleTabIds.includes(tab.id));
    }

    // Default to overview only if role not recognized
    return allTabs.filter(tab => tab.id === 'overview');
  };

  const tabs = getAccessibleTabs();

  // Ensure activeTab is valid for current user's role
  useEffect(() => {
    const accessibleTabIds = tabs.map(t => t.id);
    if (!accessibleTabIds.includes(activeTab)) {
      setActiveTab('overview');
    }
  }, [currentUser?.role, currentUser?.staffRole, tabs]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price) {
      showToast('Product name and price are required', 'error');
      return;
    }

    const productObj = {
      id: formData.id || Date.now(),
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price),
      oprice: formData.oprice ? parseFloat(formData.oprice) : null,
      stock: parseInt(formData.stock) || 0,
      emoji: formData.emoji || '🧴',
      badge: formData.badge,
      rating: parseFloat(formData.rating) || 4.5,
      description: formData.description
    };

    const saved = saveProduct(productObj);
    if (!saved) return;
    showToast(formData.id ? 'Product updated!' : 'Product added!', 'success');
    resetForm();
  };

  const handleEditProduct = (product) => {
    setFormData({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      oprice: product.oprice?.toString() || '',
      stock: product.stock.toString(),
      emoji: product.emoji,
      badge: product.badge,
      rating: product.rating.toString(),
      description: product.description
    });
    setActiveTab('products');
    
    // Smooth scroll to top of form
    setTimeout(() => {
      const productForm = document.querySelector('.product-form');
      if (productForm) {
        productForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 0);
  };

  const handleDeleteClick = (id) => {
    setDeleteTargetId(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteTargetId) {
      const deleted = deleteProduct(deleteTargetId);
      if (!deleted) return;
      showToast('✓ Product deleted', 'success');
      setDeleteTargetId(null);
      setDeleteModalOpen(false);
    }
  };

  const resetForm = () => {
    setFormData({
      id: null,
      name: '',
      category: 'Skincare',
      price: '',
      oprice: '',
      stock: '',
      emoji: '🧴',
      badge: '',
      rating: '4.5',
      description: ''
    });
  };

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);

  return (
    <>
      <div className="admin-layout">
      {/* Sidebar Navigation */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">💄</div>
          <span className="sidebar-title">LuxeCare</span>
        </div>

        <nav className="sidebar-nav">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`sidebar-nav-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              title={tab.label}
            >
              <span className="nav-icon">{tab.icon}</span>
              <span className="nav-label">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {currentUser?.username?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="user-details">
              <div className="user-name">{currentUser?.username || 'User'}</div>
              <div className="user-role">{currentUser?.role || 'admin'}</div>
            </div>
          </div>
          <button className="sidebar-logout-btn" onClick={onLogout} title="Logout">
            🚪
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-content">
        <div className="admin-header">
          <h2>{tabs.find(t => t.id === activeTab)?.label || 'Dashboard'}</h2>
          <span style={{ fontSize: '13px', color: 'var(--text-light)' }}>
            LuxeCare Beauty Co. • POS & Inventory
          </span>
        </div>

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="admin-stats">
            <div className="stat-card">
              <div className="stat-label">Total Products</div>
              <div className="stat-value">{products.length}</div>
              <div className="stat-sub">In catalog</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Total Stock</div>
              <div className="stat-value">{totalStock}</div>
              <div className="stat-sub">Units available</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Total Orders</div>
              <div className="stat-value">{orders.length}</div>
              <div className="stat-sub">All time</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Revenue</div>
              <div className="stat-value">{formatPrice(totalRevenue)}</div>
              <div className="stat-sub">Lifetime</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">In Bag</div>
              <div className="stat-value">{bag.reduce((s, b) => s + b.qty, 0)}</div>
              <div className="stat-sub">Items pending</div>
            </div>
          </div>
        )}

        {/* PRODUCTS */}
        {activeTab === 'products' && (
          <>
            <div className="product-form">
              <h3>{formData.id ? 'Edit Product' : 'Add New Product'}</h3>
              <form onSubmit={handleSaveProduct}>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Product Name</label>
                    <input
                      className="form-input"
                      name="name"
                      placeholder="e.g. Rose Glow Serum"
                      value={formData.name}
                      onChange={handleFormChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select
                      className="form-select"
                      name="category"
                      value={formData.category}
                      onChange={handleFormChange}
                    >
                      <option>Skincare</option>
                      <option>Makeup</option>
                      <option>Haircare</option>
                      <option>Body Care</option>
                      <option>Fragrance</option>
                      <option>Tools & Brushes</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Price (₱)</label>
                    <input
                      className="form-input"
                      type="number"
                      name="price"
                      placeholder="599"
                      value={formData.price}
                      onChange={handleFormChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Original Price (₱) — for sale items</label>
                    <input
                      className="form-input"
                      type="number"
                      name="oprice"
                      placeholder="Leave blank if no sale"
                      value={formData.oprice}
                      onChange={handleFormChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Stock</label>
                    <input
                      className="form-input"
                      type="number"
                      name="stock"
                      placeholder="50"
                      value={formData.stock}
                      onChange={handleFormChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Emoji Icon</label>
                    <input
                      className="form-input"
                      name="emoji"
                      placeholder="🧴"
                      value={formData.emoji}
                      onChange={handleFormChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Badge</label>
                    <select
                      className="form-select"
                      name="badge"
                      value={formData.badge}
                      onChange={handleFormChange}
                    >
                      <option value="">None</option>
                      <option value="new">New</option>
                      <option value="sale">Sale</option>
                      <option value="bestseller">Bestseller</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Rating (1–5)</label>
                    <input
                      className="form-input"
                      type="number"
                      name="rating"
                      min="1"
                      max="5"
                      step="0.1"
                      placeholder="4.5"
                      value={formData.rating}
                      onChange={handleFormChange}
                    />
                  </div>
                  <div className="form-group full">
                    <label className="form-label">Short Description</label>
                    <textarea
                      className="form-textarea"
                      name="desc"
                      placeholder="Brief product description..."
                      value={formData.description}
                      onChange={handleFormChange}
                    />
                  </div>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-primary">
                    Save Product
                  </button>
                  <button type="button" className="btn-outline" onClick={resetForm}>
                    Reset
                  </button>
                </div>
              </form>
            </div>

            <div className="products-table-wrap">
              <div className="table-header">
                <h3>All Products</h3>
                <span style={{ fontSize: '13px', color: 'var(--text-light)' }}>
                  {products.length} products
                </span>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table>
                  <thead>
                    <tr>
                      <th></th>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product.id}>
                        <td className="td-emoji">{product.emoji}</td>
                        <td>
                          <div className="td-name">{product.name}</div>
                        </td>
                        <td className="td-cat">{product.category}</td>
                        <td className="td-price">{formatPrice(product.price)}</td>
                        <td>
                          <span className={`stock-badge ${getStockBadgeClass(product.stock)}`}>
                            {getStockBadgeLabel(product.stock)}
                          </span>
                        </td>
                        <td>
                          <div className="action-btns">
                            <button
                              className="edit-btn"
                              onClick={() => handleEditProduct(product)}
                            >
                              Edit
                            </button>
                            <button
                              className="del-btn"
                              onClick={() => handleDeleteClick(product.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ORDERS */}
        {activeTab === 'orders' && (
          <div className="products-table-wrap">
            <div className="table-header">
              <h3>Order History</h3>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Update</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-light)' }}>
                        No orders yet
                      </td>
                    </tr>
                  ) : (
                    orders.map(order => {
                      const orderItemsCount = Number.isFinite(order.items)
                        ? order.items
                        : order.orderItems?.reduce((sum, item) => sum + item.qty, 0) || 0;
                      const displayStatus = ORDER_STATUSES.includes(order.status)
                        ? order.status
                        : 'Preparing';

                      return (
                      <tr key={order.id}>
                        <td>#{order.id}</td>
                        <td>{order.customer}</td>
                        <td>{orderItemsCount} item(s)</td>
                        <td>{formatPrice(order.total)}</td>
                        <td>{order.payment}</td>
                        <td>{order.date}</td>
                        <td>
                          <span className={`status-badge ${displayStatus.toLowerCase().replace(/\s+/g, '-')}`}>
                            {displayStatus}
                          </span>
                        </td>
                        <td>
                          <select
                            className="status-select"
                            value={displayStatus}
                            onChange={(e) => {
                              const success = updateOrderStatus(order.id, e.target.value);
                              if (success) showToast(`✓ Status: ${e.target.value}`, 'success');
                            }}
                            disabled={displayStatus === 'Delivered' || displayStatus === 'Cancelled'}
                          >
                            <option value="Preparing">Preparing</option>
                            <option value="On the Way">On the Way</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </td>
                      </tr>
                    )})
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* STAFF MANAGEMENT */}
        {activeTab === 'staff' && <StaffManagementPage />}

        {/* REPORTS */}
        {activeTab === 'reports' && <ReportsPage />}

        {/* BRANCHES */}
        {activeTab === 'branches' && <BranchesPage />}

        {/* ATTENDANCE */}
        {activeTab === 'attendance' && <AttendancePage />}

        {/* POS */}
        {activeTab === 'pos' && <POSPage />}

        {/* SETTINGS */}
        {activeTab === 'settings' && <SettingsPage />}
      </main>
    </div>

    <DeleteModal
      isOpen={deleteModalOpen}
      onClose={() => setDeleteModalOpen(false)}
      onConfirm={handleConfirmDelete}
    />
    </>
  );
}
