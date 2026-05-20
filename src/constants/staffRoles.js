export const STAFF_ROLES = {
  beauty_consultant: {
    label: 'Beauty Consultant',
    color: 'pink',
    icon: '💄',
    description: 'Customer-facing sales & product recommendations',
    permissions: {
      pos: true,
      viewInventory: true,
      submitRestock: false,
      viewSalesReport: true,
      approveSales: false,
      manageStaff: false,
      viewBranchReport: false,
    },
    accessibleTabs: ['overview', 'orders', 'products', 'branches', 'reports'],
  },
  cashier: {
    label: 'Cashier',
    color: 'teal',
    icon: '🧾',
    description: 'Processes payments, issues receipts, handles POS',
    permissions: {
      pos: true,
      viewInventory: false,
      submitRestock: false,
      viewSalesReport: true,
      approveSales: false,
      manageStaff: false,
      viewBranchReport: false,
    },
    accessibleTabs: ['overview', 'orders', 'products', 'branches', 'reports'],
  },
  inventory_clerk: {
    label: 'Inventory Clerk',
    color: 'amber',
    icon: '📦',
    description: 'Monitors stock, receives deliveries, submits restock requests',
    permissions: {
      pos: false,
      viewInventory: true,
      submitRestock: true,
      viewSalesReport: false,
      approveSales: false,
      manageStaff: false,
      viewBranchReport: false,
    },
    accessibleTabs: ['overview', 'orders', 'products', 'branches', 'reports'],
  },
  store_supervisor: {
    label: 'Store Supervisor',
    color: 'blue',
    icon: '🏪',
    description: 'Approves sales, manages staff, views all branch reports',
    permissions: {
      pos: true,
      viewInventory: true,
      submitRestock: true,
      viewSalesReport: true,
      approveSales: true,
      manageStaff: true,
      viewBranchReport: true,
    },
    accessibleTabs: ['overview', 'orders', 'products', 'branches', 'reports'],
  },
};

// Admin role - only the admin user role (not staff) has full access
export const ADMIN_ACCESSIBLE_TABS = ['overview', 'products', 'orders', 'staff', 'reports', 'attendance', 'pos', 'settings'];
