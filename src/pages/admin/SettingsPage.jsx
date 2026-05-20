import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { showToast } from '../../utils/helpers';
import '../../styles/admin-settings.css';

export function SettingsPage() {
  const { settings, updateSettings } = useContext(AppContext);
  const [formData, setFormData] = useState(settings);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: isNaN(value) ? value : parseFloat(value)
    }));
  };

  const handleSaveSettings = () => {
    updateSettings(formData);
    showToast('Settings saved successfully!', 'success');
  };

  return (
    <div className="settings-page">
      <div className="page-header-alt">
        <div>
          <h2>Settings</h2>
          <p>System configuration and preferences</p>
        </div>
      </div>

      <div className="settings-container">
        <div className="settings-section">
          <h3>Store Information</h3>
          
          <div className="form-group">
            <label>Store Name</label>
            <input
              type="text"
              name="storeName"
              value={formData.storeName}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Currency</label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="form-select"
            >
              <option>PHP (₱)</option>
              <option>USD ($)</option>
              <option>EUR (€)</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Free Shipping Threshold (₱)</label>
              <input
                type="number"
                name="freeShippingThreshold"
                value={formData.freeShippingThreshold}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Standard Shipping Fee (₱)</label>
              <input
                type="number"
                name="shippingFee"
                value={formData.shippingFee}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          <button className="btn-primary" onClick={handleSaveSettings}>
            Save Settings
          </button>
        </div>

        <div className="settings-section">
          <h3>Change Admin Password</h3>
          
          <div className="form-group">
            <label>Current Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="form-input"
            />
          </div>

          <button className="btn-primary" onClick={() => showToast('Password updated!', 'success')}>
            Update Password
          </button>
        </div>

        <div className="settings-section info-box">
          <h3>System Information</h3>
          <div className="info-item">
            <span>App Version</span>
            <span>1.0.0</span>
          </div>
          <div className="info-item">
            <span>Last Backup</span>
            <span>{new Date().toLocaleDateString('en-PH')}</span>
          </div>
          <div className="info-item">
            <span>Database Size</span>
            <span>~2.4 MB</span>
          </div>
        </div>
      </div>
    </div>
  );
}
