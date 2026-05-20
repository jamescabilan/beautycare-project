import React, { useState } from 'react';
import { STAFF_ROLES } from '../../constants/staffRoles';

const BRANCHES = ['BGC Branch', 'Makati Branch', 'QC Branch', 'Cebu Branch', 'Davao Branch'];

export function AddStaffModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    name: '',
    username: '',
    password: '',
    role: 'beauty_consultant',
    branch: 'BGC Branch',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim())     e.name     = 'Full name is required';
    if (!form.username.trim()) e.username  = 'Username is required';
    if (!form.password)        e.password  = 'Password is required';
    if (form.password.length < 6) e.password = 'Minimum 6 characters';
    return e;
  };

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onAdd({
      id: Date.now(),
      name: form.name.trim(),
      username: form.username.trim(),
      password: form.password,
      role: form.role,
      branch: form.branch,
      status: 'Active',
      lastLogin: 'Never',
    });
  };

  const selectedRole = STAFF_ROLES[form.role];

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-header">
          <h3>Add Staff Account</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {/* Role selector */}
          <div className="modal-field">
            <label className="modal-label">Role</label>
            <div className="role-option-grid">
              {Object.entries(STAFF_ROLES).map(([key, def]) => (
                <button
                  key={key}
                  type="button"
                  className={`role-option ${form.role === key ? 'selected' : ''}`}
                  onClick={() => setForm(prev => ({ ...prev, role: key }))}
                >
                  <span className="ro-icon">{def.icon}</span>
                  <span className="ro-label">{def.label}</span>
                </button>
              ))}
            </div>
            {selectedRole && (
              <div className="role-desc-hint">
                {selectedRole.icon} {selectedRole.description}
              </div>
            )}
          </div>

          {/* Name */}
          <div className="modal-field">
            <label className="modal-label">Full Name</label>
            <input
              className={`modal-input ${errors.name ? 'input-error' : ''}`}
              placeholder="e.g. Maria Santos"
              value={form.name}
              onChange={handleChange('name')}
            />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>

          {/* Username + Password row */}
          <div className="modal-row">
            <div className="modal-field">
              <label className="modal-label">Username</label>
              <input
                className={`modal-input ${errors.username ? 'input-error' : ''}`}
                placeholder="e.g. maria.santos"
                value={form.username}
                onChange={handleChange('username')}
              />
              {errors.username && <span className="field-error">{errors.username}</span>}
            </div>
            <div className="modal-field">
              <label className="modal-label">Password</label>
              <input
                className={`modal-input ${errors.password ? 'input-error' : ''}`}
                type="password"
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={handleChange('password')}
              />
              {errors.password && <span className="field-error">{errors.password}</span>}
            </div>
          </div>

          {/* Branch */}
          <div className="modal-field">
            <label className="modal-label">Branch Assignment</label>
            <select className="modal-select" value={form.branch} onChange={handleChange('branch')}>
              {BRANCHES.map(b => <option key={b}>{b}</option>)}
            </select>
          </div>

          {/* Permission preview */}
          {selectedRole && (
            <div className="perm-preview">
              <div className="perm-preview-title">This role will have access to:</div>
              <div className="perm-preview-grid">
                {Object.entries({
                  '🛒 POS & Sales':        selectedRole.permissions.pos,
                  '📦 View Inventory':     selectedRole.permissions.viewInventory,
                  '🔄 Restock Requests':   selectedRole.permissions.submitRestock,
                  '📊 Sales Reports':      selectedRole.permissions.viewSalesReport,
                  '✅ Approve Sales':      selectedRole.permissions.approveSales,
                  '📈 Branch Reports':     selectedRole.permissions.viewBranchReport,
                }).map(([label, allowed]) => (
                  <div key={label} className={`perm-item ${allowed ? 'allowed' : 'denied'}`}>
                    {label}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSubmit}>Create Account</button>
        </div>
      </div>
    </div>
  );
}
