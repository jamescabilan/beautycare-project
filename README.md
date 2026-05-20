# LuxeCare Beauty Co. - React Application

A modern, fully modular React 19 e-commerce application built with Vite featuring a complete beauty product store with shopping cart, admin dashboard, and branch management.

## 🌟 Features

### Customer Features
- **Shop**: Browse beauty products with advanced filtering and sorting
- **Search**: Real-time product search across names, descriptions, and categories
- **Shopping Cart**: Add/remove products, adjust quantities, view order summary
- **Checkout**: Complete order with customer details and payment method selection
- **Branches**: View all store locations with hours and contact information
- **Toast Notifications**: Real-time feedback for all user actions

### Admin Features
- **Dashboard Overview**: View key metrics (products, stock, orders, revenue)
- **Product Management**: Add, edit, and delete products
- **Order History**: Track all completed orders
- **Inventory Tracking**: Monitor stock levels with status indicators

## 🎨 Design Highlights

- **Elegant Color Scheme**: Rose, blush, gold, and charcoal palette
- **Premium Typography**: Playfair Display for headings, DM Sans for body
- **Smooth Animations**: Subtle transitions and hover effects
- **Fully Responsive**: Desktop, tablet, and mobile optimized
- **Modern UI**: Clean cards, glass-morphism effects, intuitive navigation

## 📁 Project Structure

The application is organized with a modular component architecture:

```
src/
├── components/          # Reusable UI components
├── context/            # Global state management (AppContext)
├── pages/              # Page-level components
├── styles/             # Organized CSS modules
└── utils/              # Helper functions and utilities
```

**See [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) for detailed structure.**  
**See [ARCHITECTURE.md](ARCHITECTURE.md) for component relationships and data flow.**

## 🚀 Quick Start

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```
The application will start at `http://localhost:5174/` (or available port)

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Code Quality
```bash
npm run lint
```

## 💻 Tech Stack

- **React 19.2.6**: UI library
- **Vite 8.0.12**: Build tool and dev server
- **ESLint**: Code quality checking
- **CSS3**: Modern styling with custom properties

## 📦 Sample Data

The application comes pre-configured with:
- **10 Sample Products**: Across 6 beauty categories
- **5 Store Branches**: Complete with hours and location details
- **Demo Orders**: Example order history in admin

## 🎯 Pages

1. **Shop Page**: Hero section + product grid with filters
2. **Bag Page**: Shopping cart with order summary
3. **Checkout Modal**: Order completion form
4. **Branches Page**: Store location information
5. **Admin Dashboard**: Multi-tab admin interface

## 🔧 Key Functions

### State Management (Context)
- `addToBag(productId)` - Add item to cart
- `removeFromBag(itemId)` - Remove item from cart
- `changeQty(itemId, delta)` - Update quantity
- `saveProduct(data)` - Add or edit product
- `deleteProduct(id)` - Delete product from catalog
- `placeOrder(data)` - Complete order and clear cart

### Utilities
- `filterProducts()` - Filter by search and category
- `sortProducts()` - Sort by price or name
- `formatPrice()` - Format currency display
- `getStarRating()` - Format star ratings
- `showToast()` - Display notifications

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🛠️ Customization

### Colors
Edit CSS variables in `src/styles/variables.css`:
```css
--rose: #c97b6e;
--gold: #c9a96e;
--charcoal: #2c2420;
/* etc. */
```

### Products
Modify the initial products array in `src/context/AppContext.jsx`

### Branches
Update the branches array in `src/context/AppContext.jsx`

## 🚀 Deployment

```bash
# Build for production
npm run build

# The 'dist' folder is ready to deploy
```

## 📚 Documentation

- [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) - Complete folder and file guide
- [ARCHITECTURE.md](ARCHITECTURE.md) - Component relationships and data flow

## 🎓 Learning Resources

This project demonstrates:
- React Context API for state management
- Modular component architecture
- CSS custom properties and organization
- Responsive design patterns
- Form handling and validation
- Real-time filtering and sorting

## 📝 License

MIT

## 🤝 Contributing

Feel free to fork and submit pull requests for improvements.

---

**Version**: 1.0.0  
**Last Updated**: 2026-05-17  
**Maintained by**: LuxeCare Beauty Co. Development Team
