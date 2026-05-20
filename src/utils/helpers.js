// Toast utilities
export let toastShowFunc = null;

export function setToastShowFunc(func) {
  toastShowFunc = func;
}

export function showToast(message, type = '') {
  if (toastShowFunc) {
    toastShowFunc(message, type);
  }
}

// Product utilities
export function getCategories(products) {
  return [...new Set(products.map(p => p.category))].sort();
}

export function filterProducts(products, search, category) {
  return products.filter(p => {
    const matchSearch = !search || 
      p.name.toLowerCase().includes(search.toLowerCase()) || 
      p.desc.toLowerCase().includes(search.toLowerCase()) || 
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchCat = !category || p.category === category;
    return matchSearch && matchCat;
  });
}

export function sortProducts(products, sortType) {
  const sorted = [...products];
  if (sortType === 'price-asc') sorted.sort((a, b) => a.price - b.price);
  else if (sortType === 'price-desc') sorted.sort((a, b) => b.price - a.price);
  else if (sortType === 'name-asc') sorted.sort((a, b) => a.name.localeCompare(b.name));
  return sorted;
}

// Currency formatting
export function formatPrice(price) {
  return `₱${price.toLocaleString()}`;
}

// Rating star display
export function getStarRating(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return '★'.repeat(full) + (half ? '☆' : '');
}

// Stock status
export function getStockStatus(stock) {
  if (stock <= 0) return { class: 'out', label: 'Out of stock' };
  if (stock < 15) return { class: 'low', label: `Only ${stock} left` };
  return { class: 'in', label: 'In stock' };
}

export function getStockBadgeClass(stock) {
  if (stock <= 0) return 'out';
  if (stock < 15) return 'low';
  return 'in';
}

export function getStockBadgeLabel(stock) {
  if (stock <= 0) return 'Out of Stock';
  if (stock < 15) return `Low (${stock})`;
  return `In Stock (${stock})`;
}
