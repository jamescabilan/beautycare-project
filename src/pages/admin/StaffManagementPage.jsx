import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { AddStaffModal } from '../../components/modals/AddStaffModal';
import { showToast } from '../../utils/helpers';
import { STAFF_ROLES } from '../../constants/staffRoles';
import '../../styles/admin-staff.css';

const ROLE_COLOR_MAP = {
  beauty_consultant: { bg: '#FBEAF0', text: '#72243E', border: '#F4C0D1' },
  cashier:           { bg: '#E1F5EE', text: '#085041', border: '#9FE1CB' },
  inventory_clerk:   { bg: '#FAEEDA', text: '#633806', border: '#FAC775' },
  store_supervisor:  { bg: '#EEEDFE', text: '#3C3489', border: '#CECBF6' },
};

/* ─── Permission badge ─────────────────────────────────────────────────── */
function PermBadge({ allowed }) {
  return allowed
    ? <span className="perm-yes">✓ Yes</span>
    : <span className="perm-no">— No</span>;
}

/* ─── Role chip ────────────────────────────────────────────────────────── */
function RoleChip({ role }) {
  const def = STAFF_ROLES[role];
  if (!def) return <span className="role-chip-unknown">Unknown</span>;
  const colors = ROLE_COLOR_MAP[role];
  return (
    <span
      className="role-chip"
      style={{ background: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}
    >
      {def.icon} {def.label}
    </span>
  );
}

/* ─── Role card (for the overview grid) ───────────────────────────────── */
function RoleCard({ roleKey }) {
  const def = STAFF_ROLES[roleKey];
  const colors = ROLE_COLOR_MAP[roleKey];
  const perms = def.permissions;
  return (
    <div className="role-card" style={{ borderTop: `3px solid ${colors.border}` }}>
      <div className="role-card-header">
        <span className="role-card-icon">{def.icon}</span>
        <div>
          <div className="role-card-name">{def.label}</div>
          <div className="role-card-desc">{def.description}</div>
        </div>
      </div>
      <ul className="role-perm-list">
        <li><PermBadge allowed={perms.pos} /> POS & counter sales</li>
        <li><PermBadge allowed={perms.viewInventory} /> View inventory</li>
        <li><PermBadge allowed={perms.submitRestock} /> Submit restock requests</li>
        <li><PermBadge allowed={perms.viewSalesReport} /> View sales reports</li>
        <li><PermBadge allowed={perms.approveSales} /> Approve transactions</li>
        <li><PermBadge allowed={perms.viewBranchReport} /> View branch reports</li>
      </ul>
    </div>
  );
}

/* ─── Main page ────────────────────────────────────────────────────────── */
export function StaffManagementPage() {
  const { staffAccounts, addStaffAccount, removeStaffAccount, attendanceLog } = useContext(AppContext);
  const [addStaffOpen, setAddStaffOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('accounts'); // 'accounts' | 'roles' | 'attendance'
  const [filterRole, setFilterRole] = useState('');

  const handleAddStaff = (staffData) => {
    addStaffAccount(staffData);
    showToast(`${STAFF_ROLES[staffData.role]?.icon || ''} Account created for ${staffData.name}!`, 'success');
    setAddStaffOpen(false);
  };

  const handleRemoveStaff = (id, name) => {
    removeStaffAccount(id);
    showToast(`${name} removed from staff`, 'error');
  };

  const today = new Date().toLocaleDateString('en-PH');
  const todayAttendance = attendanceLog.filter(a => a.date === today);
  const activeCount = staffAccounts.filter(s => s.status === 'Active').length;

  const filteredAccounts = filterRole
    ? staffAccounts.filter(s => s.role === filterRole)
    : staffAccounts;

  /* role breakdown counts */
  const roleCounts = Object.keys(STAFF_ROLES).reduce((acc, key) => {
    acc[key] = staffAccounts.filter(s => s.role === key).length;
    return acc;
  }, {});

  return (
    <div className="staff-mgmt-page">

      {/* ── Page header ── */}
      <div className="page-header-alt">
        <div>
          <h2>Staff Management</h2>
          <p>Manage accounts, roles, and monitor attendance</p>
        </div>
        <button className="btn-primary" onClick={() => setAddStaffOpen(true)}>
          + Add Staff
        </button>
      </div>

      {/* ── Summary stats ── */}
      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-label">Total Staff</div>
          <div className="stat-value">{staffAccounts.length}</div>
          <div className="stat-sub">All accounts</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-label">Active Today</div>
          <div className="stat-value">{activeCount}</div>
          <div className="stat-sub">Clocked in</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🕐</div>
          <div className="stat-label">Attendance Logged</div>
          <div className="stat-value">{todayAttendance.length}</div>
          <div className="stat-sub">Today</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-label">Roles</div>
          <div className="stat-value">{Object.keys(STAFF_ROLES).length}</div>
          <div className="stat-sub">Configured</div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="staff-tabs">
        {['accounts', 'roles', 'attendance'].map(tab => (
          <button
            key={tab}
            className={`staff-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {{ accounts: '👤 Accounts', roles: '🏷 Role Overview', attendance: '🕐 Attendance' }[tab]}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════
          TAB: ACCOUNTS
      ══════════════════════════════════════════════ */}
      {activeTab === 'accounts' && (
        <>
          {/* Role breakdown pills */}
          <div className="role-breakdown">
            {Object.entries(STAFF_ROLES).map(([key, def]) => {
              const colors = ROLE_COLOR_MAP[key];
              return (
                <button
                  key={key}
                  className={`role-filter-pill ${filterRole === key ? 'active' : ''}`}
                  style={filterRole === key ? { background: colors.bg, color: colors.text, borderColor: colors.border } : {}}
                  onClick={() => setFilterRole(filterRole === key ? '' : key)}
                >
                  {def.icon} {def.label}
                  <span className="pill-count">{roleCounts[key]}</span>
                </button>
              );
            })}
            {filterRole && (
              <button className="role-filter-pill clear-pill" onClick={() => setFilterRole('')}>
                ✕ Clear filter
              </button>
            )}
          </div>

          <div className="table-section">
            <div className="section-title">
              Staff Accounts
              {filterRole && (
                <span style={{ fontSize: '13px', fontWeight: 400, color: 'var(--text-light)', marginLeft: 8 }}>
                  — filtered by {STAFF_ROLES[filterRole]?.label}
                </span>
              )}
            </div>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Username</th>
                    <th>Role</th>
                    <th>Branch</th>
                    <th>Permissions</th>
                    <th>Status</th>
                    <th>Last Login</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAccounts.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="empty-message">
                        No staff accounts found{filterRole ? ` for this role` : ''}.
                      </td>
                    </tr>
                  ) : (
                    filteredAccounts.map(staff => {
                      const roleDef = STAFF_ROLES[staff.role];
                      const perms = roleDef?.permissions || {};
                      return (
                        <tr key={staff.id}>
                          <td>
                            <div className="staff-name">{staff.name}</div>
                          </td>
                          <td className="staff-username">@{staff.username}</td>
                          <td>
                            <RoleChip role={staff.role} />
                          </td>
                          <td>{staff.branch}</td>
                          <td>
                            <div className="perm-icons">
                              {perms.pos         && <span className="perm-icon" title="POS Access">🛒</span>}
                              {perms.viewInventory && <span className="perm-icon" title="View Inventory">📦</span>}
                              {perms.submitRestock && <span className="perm-icon" title="Submit Restock">🔄</span>}
                              {perms.viewSalesReport && <span className="perm-icon" title="View Sales">📊</span>}
                              {perms.approveSales  && <span className="perm-icon" title="Approve Sales">✅</span>}
                              {perms.viewBranchReport && <span className="perm-icon" title="Branch Reports">📈</span>}
                            </div>
                          </td>
                          <td>
                            <span className={`badge ${staff.status === 'Active' ? 'badge-active' : 'badge-inactive'}`}>
                              {staff.status}
                            </span>
                          </td>
                          <td className="text-muted">{staff.lastLogin}</td>
                          <td>
                            <div className="action-btns">
                              <button className="btn-sm btn-edit">Edit</button>
                              <button
                                className="btn-sm btn-delete"
                                onClick={() => handleRemoveStaff(staff.id, staff.name)}
                              >
                                Remove
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ══════════════════════════════════════════════
          TAB: ROLES
      ══════════════════════════════════════════════ */}
      {activeTab === 'roles' && (
        <div className="roles-grid">
          {Object.keys(STAFF_ROLES).map(key => (
            <RoleCard key={key} roleKey={key} />
          ))}
        </div>
      )}

      {/* ══════════════════════════════════════════════
          TAB: ATTENDANCE
      ══════════════════════════════════════════════ */}
      {activeTab === 'attendance' && (
        <div className="table-section">
          <div className="section-title">Attendance Log — Today</div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Staff</th>
                  <th>Role</th>
                  <th>Branch</th>
                  <th>Clock In</th>
                  <th>Clock Out</th>
                  <th>Hours</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {todayAttendance.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="empty-message">No attendance recorded today.</td>
                  </tr>
                ) : (
                  todayAttendance.map((a, i) => {
                    const staffMember = staffAccounts.find(s => s.name === a.name);
                    return (
                      <tr key={i}>
                        <td className="staff-name">{a.name}</td>
                        <td>{staffMember ? <RoleChip role={staffMember.role} /> : '—'}</td>
                        <td>{staffMember?.branch || '—'}</td>
                        <td>{a.clockIn}</td>
                        <td>{a.clockOut || '—'}</td>
                        <td>{a.hours || '—'}</td>
                        <td>
                          <span className={`badge ${a.clockOut ? 'badge-completed' : 'badge-pending'}`}>
                            {a.clockOut ? 'Completed' : 'On Shift'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Add Staff Modal ── */}
      {addStaffOpen && (
        <AddStaffModal
          onClose={() => setAddStaffOpen(false)}
          onAdd={handleAddStaff}
          roles={STAFF_ROLES}
        />
      )}
    </div>
  );
}