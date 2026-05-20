# LuxeCare Beauty Co. - React Application

A modern, modular React e-commerce application built with Vite for a beauty product company. The application features a complete shopping experience with product management, shopping cart, branches information, and admin dashboard.

## 📁 Project Structure

```
src/
├── components/              # Reusable React components
│   ├── Hero.jsx            # Hero section with badges
│   ├── Navigation.jsx       # Top navigation bar
│   ├── ProductGrid.jsx      # Product display with filtering & sorting
│   ├── Toast.jsx            # Toast notification system
│   ├── Toast.css            # Toast styling
│   └── modals/
│       ├── CheckoutModal.jsx    # Checkout form modal
│       └── DeleteModal.jsx      # Delete confirmation modal
│
├── context/                 # React Context for state management
│   └── AppContext.jsx       # Global app state (products, bag, orders, branches)
│
├── pages/                   # Page components
│   ├── ShopPage.jsx        # Main shopping page
│   ├── BagPage.jsx         # Shopping bag/cart page
│   ├── BranchesPage.jsx    # Branches information page
│   └── AdminPage.jsx       # Admin dashboard (product management, orders)
│
├── styles/                  # CSS files organized by component
│   ├── variables.css        # CSS custom properties/theme
│   ├── global.css           # Main style imports
│   ├── navigation.css       # Navigation bar styles
│   ├── hero.css            # Hero section styles
│   ├── products.css        # Product grid & card styles
│   ├── buttons.css         # Button styles & animations
│   ├── bag.css             # Shopping bag page styles
│   ├── branches.css        # Branches page styles
│   ├── admin.css           # Admin dashboard styles
│   └── modals.css          # Modal and form styles
│
├── utils/                   # Utility functions
│   └── helpers.js          # Product filtering, formatting, toast management
│
├── App.jsx                 # Main App component
├── main.jsx                # Entry point
└── index.css               # Global CSS & fonts
```

## 🎯 Key Features

### 1. **Shop Page**
- Product grid with filtering by category
- Search functionality
- Sorting options (price, name)
- Product cards with ratings and availability
- Add to bag button

### 2. **Shopping Bag**
- View all items in cart
- Adjust quantities
- Remove items
- Order summary with shipping calculation
- Free shipping for orders ₱1,500+
- Checkout button

### 3. **Checkout**
- Customer information form
- Payment method selection
- Branch pickup options
- Order confirmation

### 4. **Branches Page**
- Display all store locations
- Branch information (hours, phone, address)
- Branch status badges

### 5. **Admin Dashboard**
- **Overview Tab**: Statistics (products, stock, orders, revenue)
- **Products Tab**: 
  - Add/edit products
  - Delete products
  - Product table with stock status
- **Orders Tab**: View all placed orders

## 🎨 Design System

### Color Palette
```
Primary: #2c2420 (Charcoal)
Accent: #c97b6e (Rose)
Secondary: #e8c4b8 (Blush)
Gold: #c9a96e
Background: #fdf9f5 (Warm White)
```

### Typography
- **Headings**: Playfair Display (serif)
- **Body**: DM Sans (sans-serif)

### Spacing & Shadows
- Uses CSS custom properties for consistent spacing
- Subtle shadows for depth
- Responsive design with mobile breakpoints

## 🔧 Component Architecture

### State Management
The app uses React Context API (`AppContext`) for global state:
- `products`: Array of product objects
- `bag`: Shopping cart items
- `orders`: Placed orders history
- `branches`: Store locations

### Functions
- `addToBag(id)`: Add product to cart
- `removeFromBag(id)`: Remove product from cart
- `changeQty(id, delta)`: Update item quantity
- `saveProduct(data)`: Add/edit product
- `deleteProduct(id)`: Delete product
- `placeOrder(data)`: Create order

## 🚀 Running the Project

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## 📱 Responsive Design

The application is fully responsive with breakpoints at:
- **Desktop**: Full feature set
- **Tablet**: Optimized grid layouts
- **Mobile**: Single column layouts, adjusted typography

## 🎁 Sample Data

The app comes with:
- 10 sample beauty products across 6 categories
- 5 branch locations
- Pre-configured forms and modals

## 💡 Key Implementation Details

### Filtering & Sorting
- Real-time search across product names, descriptions, and categories
- Category-based filtering with dropdown
- Multiple sort options (featured, price ascending/descending, name A-Z)

### Form Handling
- Controlled component forms in modals
- Validation for required fields
- Toast notifications for user feedback

### Responsive Images
- Product emojis instead of images
- Color-coded product backgrounds by category
- Scalable vector-based icons

## 🔐 Features

- **Empty States**: Friendly messages when cart or search results are empty
- **Toast Notifications**: Success/error feedback for all actions
- **Smooth Animations**: Page transitions and hover effects
- **Accessibility**: Semantic HTML, proper form labels, keyboard navigation

---

**Version**: 1.0.0  
**Built with**: React 19 + Vite 8  
**License**: MIT
