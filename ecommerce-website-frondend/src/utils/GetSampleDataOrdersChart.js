import { useSelector } from 'react-redux';
import { useOrder } from '../features/seller/hooks/useOrder';

// Remove the mock data since we'll use real data
// const sampleOrders = [...];

const processOrderData = (orders) => {
  // Initialize data structures
  const ordersByDate = {};
  const revenueByDate = {};
  const productsSoldByDate = {};
  let totalOrders = 0;
  let totalRevenue = 0;
  let totalProductsSold = 0;

  // Process each order
  if (orders && orders.length) {
    orders.forEach((order) => {
      const date = new Date(order.createdAt).toISOString().split("T")[0]; // Get YYYY-MM-DD

      // Count orders
      ordersByDate[date] = (ordersByDate[date] || 0) + 1;
      totalOrders++;

      // Calculate revenue (sum of product prices + shipping)
      const orderRevenue =
        order.orderTools.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ) + (order.shippingCost || 0);

      revenueByDate[date] = (revenueByDate[date] || 0) + orderRevenue;
      totalRevenue += orderRevenue;

      // Count products sold (only for completed orders)
      if (order.status === "COMPLETED") {
        const productsSoldInOrder = order.orderTools.reduce(
          (sum, item) => sum + item.quantity,
          0
        );

        productsSoldByDate[date] =
          (productsSoldByDate[date] || 0) + productsSoldInOrder;
        totalProductsSold += productsSoldInOrder;
      }
    });
  }

  // Convert to array format for Recharts
  const dates = [
    ...new Set([
      ...Object.keys(ordersByDate),
      ...Object.keys(revenueByDate),
      ...Object.keys(productsSoldByDate),
    ]),
  ].sort();

  const chartData = dates.map((date) => ({
    date,
    orders: ordersByDate[date] || 0,
    revenue: revenueByDate[date] || 0,
    productsSold: productsSoldByDate[date] || 0,
  }));

  return {
    chartData,
    statistics: {
      totalOrders,
      totalRevenue,
      totalProductsSold,
    },
  };
};

const filterDataByPeriod = (data, period) => {
  const today = new Date();
  today.setHours(23, 59, 59, 999); // End of day
  console.log("today", today);

  let startDate;

  switch (period) {
    case "today":
      startDate = new Date(today);
      startDate.setHours(0, 0, 0, 0); // Start of day
      break;
    case "7days":
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 6); // Last 7 days including today
      startDate.setHours(0, 0, 0, 0);
      break;
    case "30days":
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 29); // Last 30 days including today
      startDate.setHours(0, 0, 0, 0);
      break;
    case "1year":
      startDate = new Date(today);
      startDate.setFullYear(today.getFullYear() - 1); // Last year
      startDate.setHours(0, 0, 0, 0);
      break;
    default:
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 6); // Default to 7 days
      startDate.setHours(0, 0, 0, 0);
  }

  const startDateStr = startDate.toISOString().split("T")[0];

  // Filter data by date range
  return data.filter((item) => item.date >= startDateStr);
};

const calculateStatistics = (data) => {
  return {
    totalOrders: data.reduce((sum, item) => sum + item.orders, 0),
    totalRevenue: data.reduce((sum, item) => sum + item.revenue, 0),
    totalProductsSold: data.reduce((sum, item) => sum + item.productsSold, 0),
  };
};

// Create a custom hook to use in components
export const useOrderChartData = () => {
  const userId = useSelector(state => state?.account?.user?.id);
  const { orders: allShopOrders, isLoading } = useOrder(userId);

  // Process data only if orders are available
  const processedData = allShopOrders ? processOrderData(allShopOrders) : { chartData: [], statistics: { totalOrders: 0, totalRevenue: 0, totalProductsSold: 0 } };

  return {
    isLoading,
    getAllData: () => processedData.chartData,
    getFilteredData: (period) => {
      const filteredData = filterDataByPeriod(processedData.chartData, period);
      return {
        chartData: filteredData,
        statistics: calculateStatistics(filteredData),
      };
    },
    getTotalStats: () => processedData.statistics,
  };
};
