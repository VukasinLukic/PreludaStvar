"use client";

import { useState, useEffect } from "react";
import { Bar, Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { ChevronUp, ChevronDown, Users, ShoppingBag, DollarSign, Box } from "lucide-react";
import { collection, getDocs, query, where, orderBy, limit, Timestamp } from "firebase/firestore";
import { firestore } from "@/lib/firebaseClient";
import { Order } from "@/types/order";

// Register ChartJS components
Chart.register(...registerables);

interface DashboardStats {
  totalOrders: number;
  totalSales: number;
  activeCustomers: number;
  totalProducts: number;
  percentChangeOrders: number;
  percentChangeSales: number;
  salesData: number[];
  orderData: number[];
  topProducts: { name: string; quantity: number }[];
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalSales: 0,
    activeCustomers: 0,
    totalProducts: 0,
    percentChangeOrders: 0,
    percentChangeSales: 0,
    salesData: [0, 0, 0, 0, 0, 0, 0],
    orderData: [0, 0, 0, 0, 0, 0, 0],
    topProducts: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Get current date and 30 days ago for comparison
      const now = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(now.getDate() - 30);
      const sixtyDaysAgo = new Date();
      sixtyDaysAgo.setDate(now.getDate() - 60);

      // Get orders from the last 30 days
      const recentOrdersQuery = query(
        collection(firestore, "orders"),
        where("createdAt", ">=", Timestamp.fromDate(thirtyDaysAgo)),
        orderBy("createdAt", "desc")
      );
      
      // Get orders from 30-60 days ago for comparison
      const previousOrdersQuery = query(
        collection(firestore, "orders"),
        where("createdAt", ">=", Timestamp.fromDate(sixtyDaysAgo)),
        where("createdAt", "<", Timestamp.fromDate(thirtyDaysAgo)),
        orderBy("createdAt", "desc")
      );

      const [recentOrdersSnapshot, previousOrdersSnapshot] = await Promise.all([
        getDocs(recentOrdersQuery),
        getDocs(previousOrdersQuery)
      ]);

      // Calculate total sales from recent orders
      const recentOrders: Order[] = recentOrdersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
      const previousOrders: Order[] = previousOrdersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
      
      const totalRecentSales = recentOrders.reduce((sum, order) => sum + order.total, 0);
      const totalPreviousSales = previousOrders.reduce((sum, order) => sum + order.total, 0);

      // Calculate percent changes
      const percentChangeOrders = previousOrders.length > 0 
        ? ((recentOrders.length - previousOrders.length) / previousOrders.length) * 100
        : 100;
      
      const percentChangeSales = totalPreviousSales > 0
        ? ((totalRecentSales - totalPreviousSales) / totalPreviousSales) * 100
        : 100;

      // Get unique customers from the orders
      const customerEmails = new Set(recentOrders.map(order => order.shippingInfo.email));
      
      // Get product statistics
      const productsQuery = query(collection(firestore, "products"), limit(100));
      const productsSnapshot = await getDocs(productsQuery);
      
      // Calculate top products from orders
      const productCount: Record<string, number> = {};
      
      recentOrders.forEach(order => {
        order.items.forEach(item => {
          if (productCount[item.productId]) {
            productCount[item.productId] += item.quantity;
          } else {
            productCount[item.productId] = item.quantity;
          }
        });
      });
      
      // Convert to array for sorting
      const topProducts = Object.entries(productCount)
        .map(([productId, quantity]) => {
          // Find product name from order items
          const productName = recentOrders.flatMap(order => 
            order.items.filter(item => item.productId === productId)
          )[0]?.name || productId;
          
          return { name: productName, quantity };
        })
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);

      // Generate weekly data for the charts
      const lastWeek = Array(7).fill(0).map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.setHours(0, 0, 0, 0);
      }).reverse();
      
      const salesData = lastWeek.map(date => {
        return recentOrders
          .filter(order => {
            const orderDate = order.createdAt.toDate().setHours(0, 0, 0, 0);
            return orderDate === date;
          })
          .reduce((sum, order) => sum + order.total, 0);
      });
      
      const orderData = lastWeek.map(date => {
        return recentOrders.filter(order => {
          const orderDate = order.createdAt.toDate().setHours(0, 0, 0, 0);
          return orderDate === date;
        }).length;
      });

      setStats({
        totalOrders: recentOrders.length,
        totalSales: totalRecentSales,
        activeCustomers: customerEmails.size,
        totalProducts: productsSnapshot.size,
        percentChangeOrders,
        percentChangeSales,
        salesData,
        orderData,
        topProducts
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) {
    return <div className="animate-pulse p-4">Loading dashboard data...</div>;
  }

  // Get last 7 days for chart labels
  const lastWeekLabels = Array(7).fill(0).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - 6 + i);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  });

  const salesChartData = {
    labels: lastWeekLabels,
    datasets: [
      {
        label: 'Sales',
        data: stats.salesData,
        fill: false,
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgba(59, 130, 246, 1)',
        tension: 0.1
      }
    ]
  };

  const ordersChartData = {
    labels: lastWeekLabels,
    datasets: [
      {
        label: 'Orders',
        data: stats.orderData,
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        borderWidth: 0,
        borderRadius: 4,
      }
    ]
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                <ShoppingBag className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{stats.totalOrders}</div>
                    <div className={`ml-2 flex items-baseline text-sm font-semibold ${stats.percentChangeOrders >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stats.percentChangeOrders >= 0 ? <ChevronUp className="self-center flex-shrink-0 h-4 w-4" /> : <ChevronDown className="self-center flex-shrink-0 h-4 w-4" />}
                      <span className="sr-only">{stats.percentChangeOrders >= 0 ? 'Increased' : 'Decreased'} by</span>
                      {Math.abs(Math.round(stats.percentChangeOrders))}%
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Sales</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{formatCurrency(stats.totalSales)}</div>
                    <div className={`ml-2 flex items-baseline text-sm font-semibold ${stats.percentChangeSales >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stats.percentChangeSales >= 0 ? <ChevronUp className="self-center flex-shrink-0 h-4 w-4" /> : <ChevronDown className="self-center flex-shrink-0 h-4 w-4" />}
                      <span className="sr-only">{stats.percentChangeSales >= 0 ? 'Increased' : 'Decreased'} by</span>
                      {Math.abs(Math.round(stats.percentChangeSales))}%
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Active Customers</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{stats.activeCustomers}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                <Box className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Products</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{stats.totalProducts}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Weekly Sales</h3>
            <div className="h-64">
              <Line 
                data={salesChartData} 
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: (value) => formatCurrency(value as number)
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Orders This Week</h3>
            <div className="h-64">
              <Bar 
                data={ordersChartData} 
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        precision: 0
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Top products */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Top Selling Products</h3>
          <div className="flow-root mt-6">
            <ul className="-my-5 divide-y divide-gray-200">
              {stats.topProducts.map((product, index) => (
                <li key={index} className="py-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center bg-indigo-100 rounded-full text-indigo-700 font-semibold">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                    </div>
                    <div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {product.quantity} sold
                      </span>
                    </div>
                  </div>
                </li>
              ))}
              {stats.topProducts.length === 0 && (
                <li className="py-4 text-center text-gray-500">No product data available</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 