# Component & Data Flow Architecture

## Component Hierarchy

```
App (with AppProvider)
├── Navigation
├── Toast
├── CheckoutModal
├── ShopPage
│   ├── Hero
│   └── ProductGrid
│       └── Product Cards (rendered from filtered/sorted products)
├── BagPage
│   └── Bag Items (with quantity controls)
├── BranchesPage
│   └── Branch Cards (from context)
└── AdminPage
    ├── Overview Statistics
    ├── Product Form
    ├── Products Table
    ├── Orders Table
    └── DeleteModal
```

## Data Flow

### Global State (AppContext)
```
AppProvider
├── products: Product[]        // All available products
├── bag: BagItem[]             // Items in shopping cart
├── orders: Order[]            // Completed orders
├── branches: Branch[]         // Store locations
├── nextId: number             // For generating new product IDs
└── Functions:
    ├── addToBag(productId)
    ├── removeFromBag(itemId)
    ├── changeQty(itemId, delta)
    ├── saveProduct(productData)
    ├── deleteProduct(productId)
    └── placeOrder(orderData)
```

### Component Data Flow

#### ShopPage
```
ShopPage
  ↓
ProductGrid (uses: products, addToBag)
  ↓
  ├─ Filters (search, category, sort)
  ├─ filterProducts() → filtered[]
  ├─ sortProducts() → sorted[]
  └─ Product Cards
      └─ addToBag() → showToast()
```

#### BagPage
```
BagPage (uses: bag, removeFromBag, changeQty)
  ↓
Bag Items List
  ├─ changeQty() for +/- buttons
  ├─ removeFromBag() for delete
  └─ Order Summary
      └─ checkout → CheckoutModal
```

#### CheckoutModal
```
CheckoutModal (receives: isOpen, onClose, onPlaceOrder, bag)
  ↓
Form (firstName, lastName, email, phone, address, payment, branch)
  ↓
onPlaceOrder()
  ↓
placeOrder() in AppContext
  ↓
Updates: orders[], empties: bag[]
  ↓
showToast() → ShopPage redirect
```

#### AdminPage
```
AdminPage (uses all context functions)
  ├─ Overview Tab
  │   └─ Statistics (products.length, totalStock, orders.length, revenue)
  │
  ├─ Products Tab
  │   ├─ Product Form
  │   │   ├─ saveProduct() (add or edit)
  │   │   └─ resetForm()
  │   │
  │   └─ Products Table
  │       ├─ editProduct() → fills form
  │       └─ promptDelete() → DeleteModal
  │
  └─ Orders Tab
      └─ Orders Table (read-only)
```

#### DeleteModal
```
DeleteModal (receives: isOpen, onClose, onConfirm)
  ↓
Confirmation Dialog
  ↓
onConfirm()
  ↓
deleteProduct() in AppContext
  ↓
Updates: products[], updates: bag[]
  ↓
showToast() → refreshes table
```

## State Updates Flow

### Adding a Product
```
User clicks "Add" button
  ↓
addToBag(productId) called
  ↓
setBag() updates state
  ↓
updateBagCount() recalculates
  ↓
showToast() shows feedback
  ↓
Navigation updates bag count
```

### Placing an Order
```
User submits checkout form
  ↓
handlePlaceOrder(orderData)
  ↓
placeOrder() adds to orders[]
  ↓
setBag([]) clears cart
  ↓
CheckoutModal closes
  ↓
showToast() → 800ms delay
  ↓
Navigate to ShopPage
```

### Editing a Product (Admin)
```
User clicks "Edit" in table
  ↓
handleEditProduct() fills form
  ↓
User submits form
  ↓
saveProduct() finds existing product
  ↓
Updates products[] in place
  ↓
showToast() confirms
  ↓
resetForm() clears
  ↓
renderAdminTable() refreshes display
```

## Utility Functions Flow

### Product Filtering
```
renderProducts()
  ↓
getCategories(products) → categories[]
  ↓
filterProducts(products, search, category) → filtered[]
  ↓
sortProducts(filtered, sortType) → sorted[]
  ↓
render product grid
```

### Formatting
```
formatPrice(899) → "₱899"
getStarRating(4.8) → "★★★★☆"
getStockStatus(stock) → { class, label }
getStockBadgeClass/Label() → stock status UI
```

### Toast Management
```
setToastShowFunc(showToastFn)
  ↓
showToast(message, type)
  ↓
Toast component updates state
  ↓
Display 3 seconds
  ↓
Auto-hide
```

## Props Drilling Minimized

Instead of prop drilling, the app uses Context for:
- ✅ products, bag, orders, branches
- ✅ addToBag, removeFromBag, changeQty, etc.

Direct props used only for:
- Navigation: currentPage, onPageChange
- Modals: isOpen, onClose, onConfirm/onPlaceOrder
- Pages: onCheckout, onShopClick

## Recommended Enhancements

1. **Redux/Zustand**: Replace Context for larger state
2. **React Query**: Add server fetching for products/orders
3. **Custom Hooks**: Extract filter/sort logic
4. **Suspense**: Add loading states for async operations
5. **Error Boundary**: Handle component crashes gracefully

---

This architecture keeps the app modular, maintainable, and scalable for future growth.
