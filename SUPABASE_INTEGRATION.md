# Supabase Integration - Complete Implementation Guide

## Files Created

### 1. **`.env.local`** (Environment Configuration)
- Location: Root of project
- Contains: Supabase credentials
- **NEVER commit this to GitHub** - add to `.gitignore`

### 2. **`src/config/supabase.js`** (Supabase Client)
- Initializes Supabase client
- Auto-imported by service layer
- Handles connection setup

### 3. **`src/config/supabaseServices.js`** (Database Service Layer)
- All database operations organized by entity
- Services: `productService`, `orderService`, `staffService`, etc.
- Ready to use in AppContext

### 4. **`sql_migrations.sql`** (Database Schema)
- SQL to create all tables
- Indexes for performance
- Run once in Supabase SQL Editor

### 5. **`SUPABASE_SETUP.md`** (Setup Instructions)
- Step-by-step Supabase project creation
- Credential setup guide
- Troubleshooting tips

---

## Quick Start (3 Steps)

### Step 1: Create Supabase Project
1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Enter project name, set password, choose region
4. Wait 2-3 minutes for setup

### Step 2: Add Credentials
1. Go to **Settings** → **API**
2. Copy `Project URL` and `Anon Public Key`
3. Paste into `.env.local`:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_key_here
   ```

### Step 3: Create Tables
1. Go to **SQL Editor** in Supabase
2. Paste content from `sql_migrations.sql`
3. Click **Run**
4. Done! ✓

---

## How to Use Supabase Services

### Import in your components:
```javascript
import { productService, orderService } from '../config/supabaseServices';

// Fetch all products
const products = await productService.getAll();

// Create product
const newProduct = await productService.create({
  name: 'New Product',
  price: 999,
  stock: 50,
  // ... other fields
});

// Update product
await productService.update(productId, {
  stock: newStock
});

// Delete product
await productService.delete(productId);
```

### All Available Services:

1. **`productService`**
   - `getAll()` - Get all products
   - `getById(id)` - Get single product
   - `create(data)` - Create product
   - `update(id, data)` - Update product
   - `delete(id)` - Delete product
   - `updateStock(id, newStock)` - Update just stock

2. **`orderService`**
   - `getAll()` - Get all orders
   - `getById(id)` - Get order with items
   - `create(data)` - Create order
   - `updateStatus(id, status)` - Update status
   - `delete(id)` - Cancel order

3. **`orderItemService`**
   - `create(orderId, itemData)` - Add item to order
   - `getByOrderId(orderId)` - Get order items

4. **`staffService`**
   - `getAll()` - Get all staff
   - `create(data)` - Add staff
   - `update(id, data)` - Update staff
   - `delete(id)` - Remove staff
   - `authenticate(username, password)` - Login staff

5. **`attendanceService`**
   - `getByDate(date)` - Get day's attendance
   - `create(data)` - Log clock-in
   - `updateClockOut(id, time)` - Log clock-out

6. **`salesService`**
   - `create(data)` - Record sale
   - `getByDateRange(start, end)` - Get sales report

7. **`restockService`**
   - `create(data)` - Submit restock request
   - `getPending()` - Get pending requests
   - `updateStatus(id, status)` - Approve/reject

8. **`settingsService`**
   - `get(key)` - Get single setting
   - `set(key, value)` - Save setting
   - `getAll()` - Get all settings

---

## Integration Approach

### Option A: Gradual Migration (Recommended)
Keep localStorage running while adding Supabase incrementally:

1. **Phase 1**: Products only
   - Update `saveProduct()` to use `productService`
   - Keep everything else on localStorage

2. **Phase 2**: Orders
   - Update `placeOrder()` to use `orderService`
   - Update `updateOrderStatus()` to use `orderService`

3. **Phase 3**: Staff
   - Update `addStaffAccount()` to use `staffService`
   - Update authentication logic

4. **Phase 4**: Complete migration
   - Remove localStorage calls
   - Make AppContext fully Supabase-based

### Option B: Full Replacement
Replace AppContext entirely - requires more testing but faster implementation.

---

## Example: Adding Supabase to saveProduct()

**Current code (localStorage):**
```javascript
const saveProduct = useCallback((productData) => {
  // validation...
  if (productData.id) {
    setProducts(prev => prev.map(p => p.id === productData.id ? productData : p));
  } else {
    setProducts(prev => [...prev, { ...productData, id: nextId }]);
  }
}, [nextId, products]);
```

**Updated (with Supabase):**
```javascript
import { productService } from '../config/supabaseServices';

const saveProduct = useCallback(async (productData) => {
  // validation...
  try {
    if (productData.id) {
      await productService.update(productData.id, productData);
    } else {
      await productService.create(productData);
    }
    // Update local state
    const updated = await productService.getAll();
    setProducts(updated);
  } catch (error) {
    showToast('Error saving product', 'error');
  }
}, []);
```

---

## Testing Supabase Connection

Add this to any component to test:

```javascript
useEffect(() => {
  const testConnection = async () => {
    const products = await productService.getAll();
    console.log('Products from Supabase:', products);
  };
  testConnection();
}, []);
```

Check browser console - if products show up, Supabase is working! ✓

---

## Troubleshooting

### Issue: "Cannot find module '@supabase/supabase-js'"
- **Solution**: Run `npm install @supabase/supabase-js`

### Issue: Products show as empty
- **Solution**: 
  1. Check `.env.local` has correct credentials
  2. Verify tables were created in Supabase
  3. Check RLS policies (disable for development)

### Issue: "CORS error" or "403 Forbidden"
- **Solution**: Go to Supabase → Authentication → Providers → Enable policies

### Issue: Changes not appearing
- **Solution**: Clear browser cache (`Ctrl+Shift+Delete`)

---

## Security Considerations

### For Development:
- RLS policies can be disabled
- Use anon key (it's public)
- localStorage as backup is fine

### For Production:
1. **Enable RLS** - Restrict data access
2. **Create RLS policies** - Authentication-based
3. **Use service role key** - Server-side only
4. **Environment security** - Protect .env.local
5. **Rate limiting** - Enable in Supabase
6. **Regular backups** - Supabase includes daily backups

---

## Next Steps

1. ✅ Create Supabase project
2. ✅ Add credentials to `.env.local`
3. ✅ Run SQL migrations
4. ✅ Test connection
5. ⏭️ Gradually update AppContext functions
6. ⏭️ Replace localStorage with Supabase
7. ⏭️ Deploy to production

---

## Useful Resources

- **Supabase Docs**: https://supabase.com/docs
- **Supabase JS Client**: https://supabase.com/docs/reference/javascript
- **Vite Env Variables**: https://vitejs.dev/guide/env-and-modes
- **React Hooks**: https://react.dev/reference/react

---

## Support

Check the browser console (`F12` → Console tab) for detailed error messages. All Supabase errors are logged there.

Good luck! 🚀
