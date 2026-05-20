/**
 * Supabase Service Layer
 * Provides all database operations for BeautyCare
 */

import { supabase } from './supabase';

// ──────────────────────────────────
// PRODUCTS
// ──────────────────────────────────

export const productService = {
  // Fetch all products
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: true });
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  },

  // Get single product
  async getById(id) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  },

  // Create product
  async create(productData) {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  // Update product
  async update(id, productData) {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  // Delete product
  async delete(id) {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  // Update product stock
  async updateStock(id, newStock) {
    try {
      const { data, error } = await supabase
        .from('products')
        .update({ stock: newStock })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating product stock:', error);
      throw error;
    }
  }
};

// ──────────────────────────────────
// ORDERS
// ──────────────────────────────────

export const orderService = {
  // Fetch all orders
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  },

  // Get single order with items
  async getById(id) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching order:', error);
      return null;
    }
  },

  // Create order
  async create(orderData) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  // Update order status
  async updateStatus(id, status) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  // Delete order
  async delete(id) {
    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting order:', error);
      throw error;
    }
  }
};

// ──────────────────────────────────
// ORDER ITEMS
// ──────────────────────────────────

export const orderItemService = {
  // Add item to order
  async create(orderId, itemData) {
    try {
      const { data, error } = await supabase
        .from('order_items')
        .insert([{ order_id: orderId, ...itemData }])
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating order item:', error);
      throw error;
    }
  },

  // Get items for order
  async getByOrderId(orderId) {
    try {
      const { data, error } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderId);
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching order items:', error);
      return [];
    }
  }
};

// ──────────────────────────────────
// STAFF ACCOUNTS
// ──────────────────────────────────

export const staffService = {
  // Fetch all staff
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('staff_accounts')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching staff:', error);
      return [];
    }
  },

  // Create staff account
  async create(staffData) {
    try {
      const { data, error } = await supabase
        .from('staff_accounts')
        .insert([staffData])
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating staff account:', error);
      throw error;
    }
  },

  // Update staff account
  async update(id, staffData) {
    try {
      const { data, error } = await supabase
        .from('staff_accounts')
        .update(staffData)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating staff:', error);
      throw error;
    }
  },

  // Delete staff account
  async delete(id) {
    try {
      const { error } = await supabase
        .from('staff_accounts')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting staff:', error);
      throw error;
    }
  },

  // Authenticate staff
  async authenticate(username, password) {
    try {
      const { data, error } = await supabase
        .from('staff_accounts')
        .select('*')
        .eq('username', username)
        .single();
      if (error) throw error;
      // In production, use proper password hashing (bcrypt)
      if (data && data.password_hash === password) {
        return data;
      }
      return null;
    } catch (error) {
      console.error('Error authenticating staff:', error);
      return null;
    }
  }
};

// ──────────────────────────────────
// ATTENDANCE
// ──────────────────────────────────

export const attendanceService = {
  // Get attendance records
  async getByDate(date) {
    try {
      const { data, error } = await supabase
        .from('attendance_log')
        .select('*')
        .eq('date', date)
        .order('clock_in', { ascending: true });
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching attendance:', error);
      return [];
    }
  },

  // Log attendance
  async create(attendanceData) {
    try {
      const { data, error } = await supabase
        .from('attendance_log')
        .insert([attendanceData])
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error logging attendance:', error);
      throw error;
    }
  },

  // Update clock out
  async updateClockOut(id, clockOut) {
    try {
      const { data, error } = await supabase
        .from('attendance_log')
        .update({ clock_out: clockOut })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating clock out:', error);
      throw error;
    }
  }
};

// ──────────────────────────────────
// SALES TRANSACTIONS
// ──────────────────────────────────

export const salesService = {
  // Record sale
  async create(saleData) {
    try {
      const { data, error } = await supabase
        .from('sales_transactions')
        .insert([saleData])
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error recording sale:', error);
      throw error;
    }
  },

  // Get sales by date range
  async getByDateRange(startDate, endDate) {
    try {
      const { data, error } = await supabase
        .from('sales_transactions')
        .select('*')
        .gte('created_at', startDate)
        .lte('created_at', endDate)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching sales:', error);
      return [];
    }
  }
};

// ──────────────────────────────────
// RESTOCK REQUESTS
// ──────────────────────────────────

export const restockService = {
  // Submit restock request
  async create(requestData) {
    try {
      const { data, error } = await supabase
        .from('restock_requests')
        .insert([requestData])
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating restock request:', error);
      throw error;
    }
  },

  // Get pending requests
  async getPending() {
    try {
      const { data, error } = await supabase
        .from('restock_requests')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching restock requests:', error);
      return [];
    }
  },

  // Update request status
  async updateStatus(id, status) {
    try {
      const { data, error } = await supabase
        .from('restock_requests')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating restock request:', error);
      throw error;
    }
  }
};

// ──────────────────────────────────
// SETTINGS
// ──────────────────────────────────

export const settingsService = {
  // Get setting
  async get(key) {
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', key)
        .single();
      if (error) throw error;
      return data?.value;
    } catch (error) {
      console.error('Error fetching setting:', error);
      return null;
    }
  },

  // Set setting
  async set(key, value) {
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .upsert([{ key, value }])
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error setting value:', error);
      throw error;
    }
  },

  // Get all settings
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .select('*');
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching settings:', error);
      return [];
    }
  }
};
