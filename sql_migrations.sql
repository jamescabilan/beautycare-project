-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  oprice DECIMAL(10, 2),
  stock INTEGER NOT NULL DEFAULT 0,
  emoji TEXT,
  badge TEXT,
  rating DECIMAL(2, 1) DEFAULT 4.5,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  branch_pickup TEXT NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'Preparing',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id BIGINT NOT NULL REFERENCES products(id),
  qty INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Staff Accounts Table
CREATE TABLE IF NOT EXISTS staff_accounts (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  branch TEXT NOT NULL,
  status TEXT DEFAULT 'Active',
  role TEXT DEFAULT 'staff',
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Attendance Log Table
CREATE TABLE IF NOT EXISTS attendance_log (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  staff_id BIGINT NOT NULL REFERENCES staff_accounts(id),
  name TEXT NOT NULL,
  role TEXT,
  branch TEXT,
  date DATE NOT NULL,
  clock_in TIMESTAMP WITH TIME ZONE NOT NULL,
  clock_out TIMESTAMP WITH TIME ZONE,
  hours DECIMAL(4, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sales Transactions Table
CREATE TABLE IF NOT EXISTS sales_transactions (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  order_id BIGINT REFERENCES orders(id),
  staff_id BIGINT REFERENCES staff_accounts(id),
  branch TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  payment_method TEXT,
  transaction_type TEXT,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Restock Requests Table
CREATE TABLE IF NOT EXISTS restock_requests (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  product_id BIGINT NOT NULL REFERENCES products(id),
  staff_id BIGINT REFERENCES staff_accounts(id),
  quantity_requested INTEGER NOT NULL,
  branch TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Settings Table
CREATE TABLE IF NOT EXISTS app_settings (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_staff_username ON staff_accounts(username);
CREATE INDEX IF NOT EXISTS idx_attendance_staff_id ON attendance_log(staff_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance_log(date);
