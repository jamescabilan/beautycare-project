-- Disable Row-Level Security on all tables
-- This allows the application to read and write data without RLS restrictions

-- Disable RLS on products table
ALTER TABLE products DISABLE ROW LEVEL SECURITY;

-- Disable RLS on orders table
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;

-- Disable RLS on order_items table
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;

-- Disable RLS on staff_accounts table
ALTER TABLE staff_accounts DISABLE ROW LEVEL SECURITY;

-- Disable RLS on attendance_log table
ALTER TABLE attendance_log DISABLE ROW LEVEL SECURITY;

-- Disable RLS on sales_transactions table
ALTER TABLE sales_transactions DISABLE ROW LEVEL SECURITY;

-- Disable RLS on restock_requests table
ALTER TABLE restock_requests DISABLE ROW LEVEL SECURITY;

-- Disable RLS on app_settings table
ALTER TABLE app_settings DISABLE ROW LEVEL SECURITY;
