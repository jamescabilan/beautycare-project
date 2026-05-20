import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { formatPrice } from '../../utils/helpers';
import '../../styles/admin-reports.css';

export function ReportsPage() {
  const { products, orders, salesTransactions } = useContext(AppContext);

  const allSales = [...orders, ...salesTransactions];
  const totalRevenue = allSales.reduce((sum, s) => sum + s.total, 0);
  const totalTransactions = allSales.length;
  const avgOrderValue = totalTransactions ? Math.round(totalRevenue / totalTransactions) : 0;
  const totalUnitsSold = salesTransactions.reduce((sum, s) => sum + (s.qty || s.items || 0), 0);

  // Category breakdown
  const categoryStats = [...new Set(products.map(p => p.category))].map(cat => {
    const catProducts = products.filter(p => p.category === cat);
    const revenue = catProducts.reduce((sum, p) => {
      const sold = salesTransactions.filter(s => s.productId === p.id).reduce((a, s) => a + s.qty, 0);
      return sum + sold * p.price;
    }, 0);
    const units = catProducts.reduce((sum, p) => {
      return sum + salesTransactions.filter(s => s.productId === p.id).reduce((a, s) => a + s.qty, 0);
    }, 0);
    return { cat, revenue, units };
  }).sort((a, b) => b.revenue - a.revenue);

  // Top products
  const topProducts = products.map(p => ({
    ...p,
    sold: salesTransactions.filter(s => s.productId === p.id).reduce((a, s) => a + s.qty, 0)
  })).filter(p => p.sold > 0).sort((a, b) => b.sold - a.sold).slice(0, 5);

  return (
    <div className="reports-page">
      <div className="page-header-alt">
        <div>
          <h2>Reports & Analytics</h2>
          <p>Sales breakdown and performance metrics</p>
        </div>
      </div>

      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-label">Total Revenue</div>
          <div className="stat-value">{formatPrice(totalRevenue)}</div>
          <div className="stat-sub">All channels</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Transactions</div>
          <div className="stat-value">{totalTransactions}</div>
          <div className="stat-sub">Orders + counter</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Avg Order Value</div>
          <div className="stat-value">{formatPrice(avgOrderValue)}</div>
          <div className="stat-sub">Per transaction</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Units Sold</div>
          <div className="stat-value">{totalUnitsSold}</div>
          <div className="stat-sub">Total units</div>
        </div>
      </div>

      <div className="reports-grid">
        <div className="table-section">
          <div className="section-title">Sales by Category</div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Units Sold</th>
                  <th>Revenue</th>
                  <th>Share</th>
                </tr>
              </thead>
              <tbody>
                {categoryStats.length > 0 ? (
                  categoryStats.map(cat => {
                    const totalCatRevenue = categoryStats.reduce((s, c) => s + c.revenue, 0) || 1;
                    const share = Math.round((cat.revenue / totalCatRevenue) * 100);
                    return (
                      <tr key={cat.cat}>
                        <td className="cat-name">{cat.cat}</td>
                        <td>{cat.units}</td>
                        <td className="revenue">{formatPrice(cat.revenue)}</td>
                        <td>{share}%</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="4" className="empty-message">No sales data yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="table-section">
          <div className="section-title">Top Products</div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>Product</th>
                  <th>Units Sold</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.length > 0 ? (
                  topProducts.map(p => (
                    <tr key={p.id}>
                      <td className="emoji">{p.emoji}</td>
                      <td className="product-name">{p.name}</td>
                      <td>{p.sold}</td>
                      <td className="revenue">{formatPrice(p.sold * p.price)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="empty-message">No sales data yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
