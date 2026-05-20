import React, { createContext, useState, useCallback, useMemo, useEffect } from 'react';
import { showToast } from '../utils/helpers';
import { productService, orderService, orderItemService } from '../config/supabaseServices';

export const AppContext = createContext();

const initialProducts = [
  { id:1, name:'Rose Glow Vitamin C Serum', category:'Skincare', price:899, oprice:1200, stock:45, emoji:'🧴', badge:'sale', rating:4.8, description:'Brightening serum with 15% Vitamin C and rose hip oil for radiant, even-toned skin.' },
  { id:2, name:'Hydra Velvet Lip Gloss', category:'Makeup', price:350, oprice:null, stock:80, emoji:'💋', badge:'new', rating:4.6, description:'Ultra-glossy lip color with hyaluronic acid for plump, moisturized lips all day.' },
  { id:3, name:'Silk Repair Hair Mask', category:'Haircare', price:650, oprice:null, stock:30, emoji:'💆', badge:'bestseller', rating:4.9, description:'Deep conditioning treatment with keratin and argan oil for silky, frizz-free hair.' },
  { id:4, name:'Glow Mist Setting Spray', category:'Skincare', price:520, oprice:null, stock:60, emoji:'✨', badge:'', rating:4.5, description:'Refreshing setting spray that locks in makeup while giving a dewy, luminous finish.' },
  { id:5, name:'Velvet Matte Foundation', category:'Makeup', price:1100, oprice:1400, stock:25, emoji:'🎨', badge:'sale', rating:4.7, description:'Full-coverage matte foundation with SPF 30. Buildable formula for all skin types.' },
  { id:6, name:'Lavender Body Butter', category:'Body Care', price:480, oprice:null, stock:55, emoji:'🫧', badge:'', rating:4.4, description:'Rich whipped body butter with shea and lavender oil for deeply moisturized skin.' },
  { id:7, name:'Petal Bloom Eau de Parfum', category:'Fragrance', price:1850, oprice:null, stock:20, emoji:'🌸', badge:'new', rating:4.9, description:'A feminine floral fragrance with notes of peony, jasmine, and warm sandalwood.' },
  { id:8, name:'Pro Blending Brush Set', category:'Tools & Brushes', price:750, oprice:null, stock:40, emoji:'🖌', badge:'', rating:4.6, description:'8-piece professional brush set with ultra-soft synthetic bristles for flawless application.' },
  { id:9, name:'Niacinamide Pore Toner', category:'Skincare', price:420, oprice:null, stock:70, emoji:'💧', badge:'', rating:4.5, description:'10% niacinamide toner that minimizes pores, controls oil, and brightens skin tone.' },
  { id:10, name:'Glossy Brow Gel', category:'Makeup', price:280, oprice:null, stock:90, emoji:'🪮', badge:'', rating:4.3, description:'Clear brow gel that keeps brows groomed, defined, and perfectly in place all day.' }
];

const branches = [
  { name:'BGC Branch', address:'2F Bonifacio High Street, BGC, Taguig City', hours:'Mon–Sun: 10am–9pm', phone:'+63 2 8XXX XXXX', emoji:'🏬', tag:'Flagship Store' },
  { name:'Makati Branch', address:'G/F Glorietta 4, Ayala Center, Makati City', hours:'Mon–Sun: 10am–9pm', phone:'+63 2 8XXX XXXX', emoji:'🌆', tag:'Mall Kiosk' },
  { name:'Quezon City Branch', address:'3F SM North EDSA, Annex Wing, QC', hours:'Mon–Sun: 10am–9pm', phone:'+63 2 8XXX XXXX', emoji:'🏢', tag:'Full Store' },
  { name:'Cebu Branch', address:'G/F Ayala Center Cebu, Cebu City', hours:'Mon–Sun: 10am–9pm', phone:'+63 32 XXX XXXX', emoji:'🌴', tag:'Full Store' },
  { name:'Davao Branch', address:'2F Abreeza Ayala Mall, J.P. Laurel Ave, Davao', hours:'Mon–Sun: 10am–9pm', phone:'+63 82 XXX XXXX', emoji:'🌿', tag:'Coming Soon' },
];

const initialStaffAccounts = [
  { id:1, name:'Maria Santos', username:'staff', branch:'BGC Branch', status:'Active', lastLogin:'Today 08:32', role:'staff' },
  { id:2, name:'Jess Reyes', username:'jess.reyes', branch:'Makati Branch', status:'Active', lastLogin:'Yesterday', role:'staff' },
  { id:3, name:'Nico Cruz', username:'nico.cruz', branch:'QC Branch', status:'Inactive', lastLogin:'3 days ago', role:'staff' },
];

export function AppProvider({ children }) {
  // Initialize products - load from localStorage or use initial
  const [products, setProducts] = useState(() => {
    try {
      const stored = localStorage.getItem('beautycare_products');
      return stored ? JSON.parse(stored) : initialProducts;
    } catch {
      return initialProducts;
    }
  });

  // Initialize orders - load from localStorage or use empty array
  const [orders, setOrders] = useState(() => {
    try {
      const stored = localStorage.getItem('beautycare_orders');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [bag, setBag] = useState([]);
  const [nextId, setNextId] = useState(11);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  // Load orders from Supabase on mount
  useEffect(() => {
    const loadOrders = async () => {
      try {
        setIsLoadingOrders(true);
        const supabaseOrders = await orderService.getAll();
        if (supabaseOrders && supabaseOrders.length > 0) {
          // Map Supabase orders to app format
          const mappedOrders = supabaseOrders.map(order => ({
            id: order.id,
            customer: order.customer_name,
            email: order.customer_email,
            phone: order.customer_phone,
            address: order.delivery_address,
            items: order.order_items?.length || 0,
            orderItems: order.order_items || [],
            total: order.total,
            date: new Date(order.created_at).toLocaleDateString('en-PH'),
            status: order.status === 'pending' ? 'Preparing' : order.status === 'shipped' ? 'On the Way' : 'Delivered'
          }));
          setOrders(mappedOrders);
          localStorage.setItem('beautycare_orders', JSON.stringify(mappedOrders));
        }
      } catch (error) {
        console.error('Error loading orders from Supabase:', error);
        // Fall back to localStorage
      } finally {
        setIsLoadingOrders(false);
      }
    };
    
    loadOrders();
  }, []);

  // Load products from Supabase on mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoadingProducts(true);
        const supabaseProducts = await productService.getAll();
        if (supabaseProducts && supabaseProducts.length > 0) {
          setProducts(supabaseProducts);
          localStorage.setItem('beautycare_products', JSON.stringify(supabaseProducts));
        }
      } catch (error) {
        console.error('Error loading products from Supabase:', error);
        // Fall back to localStorage
      } finally {
        setIsLoadingProducts(false);
      }
    };
    
    loadProducts();
  }, []);

  // Persist products to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('beautycare_products', JSON.stringify(products));
  }, [products]);

  // Persist orders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('beautycare_orders', JSON.stringify(orders));
  }, [orders]);

  // Use useMemo to maintain constant references for dependency arrays
  const ORDER_STATUS_FLOW = useMemo(() => ['Preparing', 'On the Way', 'Delivered'], []);
  const VALID_EMAIL = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/, []);
  const VALID_PHONE = useMemo(() => /^\+?[0-9()\-\s]{7,}$/, []);

  const toastError = (message) => {
    showToast(message, 'error');
    return false;
  };

  const getProduct = (id) => products.find(p => p.id === id);
  const isPositiveNumber = (value) => Number.isFinite(value) && value >= 0;
  
  // Authentication
  const [currentUser, setCurrentUser] = useState(null);
  
  // New admin portal features
  const [staffAccounts, setStaffAccounts] = useState(initialStaffAccounts);
  const [salesTransactions, setSalesTransactions] = useState([]);
  const [attendanceLog, setAttendanceLog] = useState([]);
  const [restockRequests, setRestockRequests] = useState([]);
  const [settings, setSettings] = useState({
    storeName: 'LuxeCare Beauty Co.',
    currency: 'PHP (₱)',
    freeShippingThreshold: 1500,
    shippingFee: 120
  });

  // Authentication methods
  const login = useCallback((userData) => {
    setCurrentUser(userData);
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const addToBag = useCallback((id) => {
    const product = products.find(p => p.id === id);
    if (!product) {
      toastError('Product not found');
      return false;
    }
    if (product.stock <= 0) {
      toastError('This product is out of stock');
      return false;
    }
    
    setBag(prevBag => {
      const item = prevBag.find(b => b.id === id);
      if (item) {
        if (item.qty + 1 > product.stock) {
          toastError('Not enough stock for this item');
          return prevBag;
        }
        return prevBag.map(b => b.id === id ? { ...b, qty: b.qty + 1 } : b);
      }
      return [...prevBag, { ...product, qty: 1 }];
    });
    return true;
  }, [products]);

  const removeFromBag = useCallback((id) => {
    setBag(prevBag => {
      const exists = prevBag.some(b => b.id === id);
      if (!exists) {
        toastError('Item not found in bag');
        return prevBag;
      }
      return prevBag.filter(b => b.id !== id);
    });
    return true;
  }, []);

  const changeQty = useCallback((id, delta) => {
    setBag(prevBag => {
      const item = prevBag.find(b => b.id === id);
      if (!item) {
        toastError('Item not found in bag');
        return prevBag;
      }
      const product = getProduct(id);
      const nextQty = item.qty + delta;
      if (nextQty < 1) {
        toastError('Quantity must be at least 1');
        return prevBag;
      }
      if (product && nextQty > product.stock) {
        toastError('Not enough stock for this item');
        return prevBag;
      }
      const updated = prevBag.map(b => 
        b.id === id ? { ...b, qty: b.qty + delta } : b
      );
      return updated;
    });
    return true;
  }, [products]);

  const clearBag = useCallback(() => {
    setBag([]);
  }, []);

  const saveProduct = useCallback(async (productData) => {
    if (!productData?.name?.trim()) {
      return toastError('Product name is required');
    }
    const parsedPrice = Number(productData.price);
    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      return toastError('Price must be a positive number');
    }
    const parsedStock = Number(productData.stock ?? 0);
    if (!isPositiveNumber(parsedStock)) {
      return toastError('Stock must be 0 or greater');
    }
    const parsedRating = Number(productData.rating ?? 0);
    if (!Number.isFinite(parsedRating) || parsedRating < 0 || parsedRating > 5) {
      return toastError('Rating must be between 0 and 5');
    }
    
    try {
      if (productData.id) {
        const exists = products.some(p => p.id === productData.id);
        if (!exists) {
          return toastError('Product not found');
        }
        // Update in Supabase
        const updated = await productService.update(productData.id, {
          name: productData.name,
          category: productData.category,
          price: parsedPrice,
          oprice: productData.oprice ? Number(productData.oprice) : null,
          stock: parsedStock,
          emoji: productData.emoji,
          badge: productData.badge,
          rating: parsedRating,
          description: productData.description
        });
        
        if (!updated) {
          throw new Error('Failed to update product');
        }
        
        setProducts(prev => prev.map(p => p.id === productData.id ? productData : p));
      } else {
        // Create in Supabase
        const newProduct = await productService.create({
          name: productData.name,
          category: productData.category,
          price: parsedPrice,
          oprice: productData.oprice ? Number(productData.oprice) : null,
          stock: parsedStock,
          emoji: productData.emoji,
          badge: productData.badge,
          rating: parsedRating,
          description: productData.description
        });
        
        if (!newProduct) {
          throw new Error('Failed to create product');
        }
        
        setProducts(prev => [...prev, { ...productData, id: newProduct.id }]);
      }
      return true;
    } catch (error) {
      console.error('Error saving product:', error);
      return toastError('Failed to save product: ' + error.message);
    }
  }, [products]);

  const deleteProduct = useCallback(async (id) => {
    const exists = products.some(p => p.id === id);
    if (!exists) {
      toastError('Product not found');
      return false;
    }
    try {
      // Delete from Supabase
      const deleted = await productService.delete(id);
      if (!deleted) {
        throw new Error('Failed to delete product');
      }
      
      setProducts(prev => prev.filter(p => p.id !== id));
      setBag(prev => prev.filter(b => b.id !== id));
      showToast('Product deleted', 'success');
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      return toastError('Failed to delete product: ' + error.message);
    }
  }, [products]);

  const placeOrder = useCallback(async (orderData) => {
    if (!bag.length) {
      return toastError('Your bag is empty');
    }
    if (!orderData?.customer?.trim()) {
      return toastError('Customer name is required');
    }
    if (!orderData?.email?.trim() || !VALID_EMAIL.test(orderData.email)) {
      return toastError('Please enter a valid email');
    }
    if (!orderData?.phone?.trim() || !VALID_PHONE.test(orderData.phone)) {
      return toastError('Please enter a valid phone number');
    }
    if (!orderData?.payment?.trim()) {
      return toastError('Payment method is required');
    }
    if (!orderData?.branch?.trim()) {
      return toastError('Branch selection is required');
    }
    if (orderData.branch === 'Home Delivery' && !orderData?.address?.trim()) {
      return toastError('Delivery address is required');
    }

    const bagItems = bag.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      qty: item.qty,
      total: item.price * item.qty
    }));

    for (const item of bagItems) {
      const product = getProduct(item.id);
      if (!product) {
        return toastError('Some items are no longer available');
      }
      if (item.qty > product.stock) {
        return toastError(`Not enough stock for ${item.name}`);
      }
    }

    const subtotal = bag.reduce((s, b) => s + b.price * b.qty, 0);
    const shipping = subtotal >= settings.freeShippingThreshold ? 0 : settings.shippingFee;
    
    try {
      // Save to Supabase
      const newOrderData = {
        customer_name: orderData.customer,
        customer_email: orderData.email,
        customer_phone: orderData.phone,
        delivery_address: orderData.address || orderData.branch,
        payment_method: orderData.payment,
        branch_pickup: orderData.branch,
        total: subtotal + shipping,
        status: 'pending'
      };
      
      const savedOrder = await orderService.create(newOrderData);
      
      if (!savedOrder) {
        throw new Error('Failed to create order');
      }

      // Save order items to Supabase
      for (const item of bagItems) {
        await orderItemService.create(savedOrder.id, {
          product_id: item.id,
          qty: item.qty,
          price: item.price
        });
      }

      // Update local state
      const newOrder = {
        ...orderData,
        id: savedOrder.id,
        items: bag.reduce((sum, item) => sum + item.qty, 0),
        orderItems: bagItems,
        total: subtotal + shipping,
        date: new Date().toLocaleDateString('en-PH'),
        status: 'Preparing'
      };

      setOrders(prev => [...prev, newOrder]);
      setProducts(prev => prev.map(p => {
        const match = bagItems.find(item => item.id === p.id);
        return match ? { ...p, stock: Math.max(0, p.stock - match.qty) } : p;
      }));
      
      // Update stock in Supabase
      for (const item of bagItems) {
        const product = getProduct(item.id);
        if (product) {
          await productService.updateStock(item.id, product.stock - item.qty);
        }
      }
      
      setBag([]);
      showToast('Order placed successfully!', 'success');
      return newOrder;
    } catch (error) {
      console.error('Error placing order:', error);
      return toastError('Failed to place order: ' + error.message);
    }
  }, [bag, settings.freeShippingThreshold, settings.shippingFee, products, orders.length]);

  const updateOrderStatus = useCallback(async (orderId, nextStatus) => {
    if (!ORDER_STATUS_FLOW.includes(nextStatus)) {
      return toastError('Invalid status');
    }

    const target = orders.find(order => order.id === orderId);
    if (!target) {
      return toastError('Order not found');
    }

    if (target.status === 'Delivered' || target.status === 'Cancelled') {
      toastError('Completed orders cannot be updated');
      return false;
    }

    const currentIndex = ORDER_STATUS_FLOW.indexOf(target.status);
    const nextIndex = ORDER_STATUS_FLOW.indexOf(nextStatus);
    if (nextIndex <= currentIndex) {
      toastError('Status can only move forward');
      return false;
    }

    try {
      // Map UI status to database status
      const dbStatus = nextStatus === 'Preparing' ? 'pending' : nextStatus === 'On the Way' ? 'shipped' : 'delivered';
      
      // Update in Supabase
      const updated = await orderService.updateStatus(orderId, dbStatus);
      if (!updated) {
        throw new Error('Failed to update order status');
      }
      
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: nextStatus } : order
      ));
      showToast(`Order status updated to ${nextStatus}`, 'success');
      return true;
    } catch (error) {
      console.error('Error updating order status:', error);
      return toastError('Failed to update order status: ' + error.message);
    }
  }, [ORDER_STATUS_FLOW, orders]);

  const cancelOrder = useCallback((orderId) => {
    const target = orders.find(order => order.id === orderId);
    if (!target) {
      toastError('Order not found');
      return false;
    }
    if (target.status !== 'Preparing') {
      toastError('Only preparing orders can be cancelled');
      return false;
    }

    setOrders(prev => prev.map(order => {
      if (order.id !== orderId) return order;
      return { ...order, status: 'Cancelled' };
    }));
    if (target?.orderItems?.length) {
      setProducts(prev => prev.map(p => {
        const match = target.orderItems.find(item => item.id === p.id);
        return match ? { ...p, stock: p.stock + match.qty } : p;
      }));
    }
    showToast('Order cancelled', 'info');
    return true;
  }, [orders]);

  // Staff management
  const addStaffAccount = useCallback((staffData) => {
    if (!staffData?.name?.trim() || !staffData?.username?.trim()) {
      return toastError('Staff name and username are required');
    }
    setStaffAccounts(prev => [...prev, { ...staffData, id: Date.now(), status: 'Active', lastLogin: 'Never' }]);
    return true;
  }, []);

  const removeStaffAccount = useCallback((id) => {
    const exists = staffAccounts.some(s => s.id === id);
    if (!exists) {
      return toastError('Staff account not found');
    }
    setStaffAccounts(prev => prev.filter(s => s.id !== id));
    return true;
  }, [staffAccounts]);

  // Sales tracking
  const recordSale = useCallback((saleData) => {
    if (!saleData?.productId || !Number.isFinite(saleData?.qty) || saleData.qty <= 0) {
      return toastError('Invalid sale data');
    }
    const product = getProduct(saleData.productId);
    if (!product) {
      return toastError('Product not found');
    }
    if (saleData.qty > product.stock) {
      return toastError('Not enough stock for this sale');
    }
    setSalesTransactions(prev => [...prev, {
      ...saleData,
      id: Date.now(),
      date: new Date().toLocaleDateString('en-PH'),
      timestamp: new Date().toLocaleTimeString('en-PH'),
      status: 'Confirmed'
    }]);
    // Reduce product stock
    setProducts(prev => prev.map(p => 
      p.id === saleData.productId ? { ...p, stock: p.stock - saleData.qty } : p
    ));
    return true;
  }, [products]);

  // Attendance
  const logAttendance = useCallback((attendanceData) => {
    if (!attendanceData?.staffId || !attendanceData?.type) {
      return toastError('Attendance data is required');
    }
    setAttendanceLog(prev => [...prev, { ...attendanceData, id: Date.now() }]);
    return true;
  }, []);

  // Restock requests
  const submitRestockRequest = useCallback((requestData) => {
    if (!requestData?.productId || !Number.isFinite(requestData?.qty) || requestData.qty <= 0) {
      return toastError('Invalid restock request');
    }
    setRestockRequests(prev => [...prev, {
      ...requestData,
      id: Date.now(),
      date: new Date().toLocaleDateString('en-PH'),
      status: 'Pending'
    }]);
    return true;
  }, []);

  const updateRestockStatus = useCallback((requestId, status) => {
    if (!status?.trim()) {
      return toastError('Status is required');
    }
    setRestockRequests(prev => prev.map(r => r.id === requestId ? { ...r, status } : r));
    return true;
  }, []);

  // Settings
  const updateSettings = useCallback((newSettings) => {
    const next = { ...settings, ...newSettings };
    if (!isPositiveNumber(Number(next.freeShippingThreshold)) || !isPositiveNumber(Number(next.shippingFee))) {
      return toastError('Shipping values must be 0 or greater');
    }
    setSettings(prev => ({ ...prev, ...newSettings }));
    return true;
  }, [settings]);

  return (
    <AppContext.Provider value={{
      // Auth
      currentUser,
      login,
      logout,
      // Products & Orders
      products,
      bag,
      orders,
      branches,
      // Admin features
      staffAccounts,
      salesTransactions,
      attendanceLog,
      restockRequests,
      settings,
      // Methods
      addToBag,
      removeFromBag,
      changeQty,
      saveProduct,
      deleteProduct,
      placeOrder,
      updateOrderStatus,
      cancelOrder,
      clearBag,
      addStaffAccount,
      removeStaffAccount,
      recordSale,
      logAttendance,
      submitRestockRequest,
      updateRestockStatus,
      updateSettings
    }}>
      {children}
    </AppContext.Provider>
  );
}
