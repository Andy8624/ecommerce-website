import { useState, useEffect, useCallback } from "react";
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    AreaChart,
    Area,
} from "recharts";
import { useOrderChartData } from "../../../utils/GetSampleDataOrdersChart";
import { Spin } from "antd";

const OrderChart = () => {
    const [timeFilter, setTimeFilter] = useState("7days");
    const [filteredData, setFilteredData] = useState({
        chartData: [],
        statistics: {},
    });
    const [chartType, setChartType] = useState("orders");

    // Get data from the hook
    const { isLoading, getFilteredData } = useOrderChartData();

    // Use useCallback to memoize the fetchData function
    const fetchData = useCallback(() => {
        if (!isLoading) {
            const data = getFilteredData(timeFilter);
            setFilteredData(data);
        }
    }, [timeFilter, isLoading]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const getActiveButtonClass = (period) => {
        return timeFilter === period
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300";
    };

    const getActiveChartTypeClass = (type) => {
        return chartType === type
            ? "bg-emerald-600 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300";
    };

    const formatNumber = (num) => {
        return num.toLocaleString("vi-VN");
    };

    // Show loading state while data is being fetched
    if (isLoading) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md flex justify-center items-center" style={{ minHeight: "300px" }}>
                <div className="text-center">
                    <Spin size="large" />
                    <div className="mt-3 text-gray-500">Đang tải dữ liệu...</div>
                </div>
            </div>
        );
    }

    // Check for empty data
    const hasData = filteredData.chartData && filteredData.chartData.length > 0;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            {/* Only render stats cards if we have data */}
            {filteredData.statistics && (
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-gradient-to-r from-emerald-500 to-green-400 p-4 rounded-lg shadow text-white shadow-lg">
                        <h3 className="text-sm font-medium opacity-80">Tổng doanh thu</h3>
                        <p className="text-2xl font-bold mt-2">
                            {formatNumber(filteredData.statistics?.totalRevenue || 0)}₫
                        </p>
                        <p className="text-xs mt-2 opacity-80">
                            Trong{" "}
                            {timeFilter === "today"
                                ? "hôm nay"
                                : timeFilter === "7days"
                                    ? "7 ngày qua"
                                    : timeFilter === "30days"
                                        ? "30 ngày qua"
                                        : "1 năm qua"}
                        </p>
                    </div>

                    <div className="bg-gradient-to-r from-indigo-500 to-blue-400 p-4 rounded-lg shadow text-white shadow-lg">
                        <h3 className="text-sm font-medium opacity-80">Tổng đơn hàng</h3>
                        <p className="text-2xl font-bold mt-2">
                            {formatNumber(filteredData.statistics?.totalOrders || 0)}
                        </p>
                        <p className="text-xs mt-2 opacity-80">
                            Trong{" "}
                            {timeFilter === "today"
                                ? "hôm nay"
                                : timeFilter === "7days"
                                    ? "7 ngày qua"
                                    : timeFilter === "30days"
                                        ? "30 ngày qua"
                                        : "1 năm qua"}
                        </p>
                    </div>

                    <div className="bg-gradient-to-r from-amber-500 to-orange-400 p-4 rounded-lg shadow text-white shadow-lg">
                        <h3 className="text-sm font-medium opacity-80">Sản phẩm đã bán</h3>
                        <p className="text-2xl font-bold mt-2">
                            {formatNumber(filteredData.statistics?.totalProductsSold || 0)}
                        </p>
                        <p className="text-xs mt-2 opacity-80">
                            Trong{" "}
                            {timeFilter === "today"
                                ? "hôm nay"
                                : timeFilter === "7days"
                                    ? "7 ngày qua"
                                    : timeFilter === "30days"
                                        ? "30 ngày qua"
                                        : "1 năm qua"}
                        </p>
                    </div>
                </div>
            )}

            {/* Time filter buttons */}
            <div className="mb-6 flex justify-between items-center">
                <div className="flex space-x-2">
                    <button
                        onClick={() => setTimeFilter("today")}
                        className={`px-4 py-2 rounded-md font-medium transition-colors ${getActiveButtonClass(
                            "today"
                        )}`}
                    >
                        Hôm nay
                    </button>
                    <button
                        onClick={() => setTimeFilter("7days")}
                        className={`px-4 py-2 rounded-md font-medium transition-colors ${getActiveButtonClass(
                            "7days"
                        )}`}
                    >
                        7 Ngày
                    </button>
                    <button
                        onClick={() => setTimeFilter("30days")}
                        className={`px-4 py-2 rounded-md font-medium transition-colors ${getActiveButtonClass(
                            "30days"
                        )}`}
                    >
                        30 Ngày
                    </button>
                    <button
                        onClick={() => setTimeFilter("1year")}
                        className={`px-4 py-2 rounded-md font-medium transition-colors ${getActiveButtonClass(
                            "1year"
                        )}`}
                    >
                        1 Năm
                    </button>
                </div>

                <div className="flex space-x-2">
                    <button
                        onClick={() => setChartType("orders")}
                        className={`px-4 py-2 rounded-md font-medium transition-colors ${getActiveChartTypeClass(
                            "orders"
                        )}`}
                    >
                        Đơn hàng
                    </button>
                    <button
                        onClick={() => setChartType("revenue")}
                        className={`px-4 py-2 rounded-md font-medium transition-colors ${getActiveChartTypeClass(
                            "revenue"
                        )}`}
                    >
                        Doanh thu
                    </button>
                    <button
                        onClick={() => setChartType("products")}
                        className={`px-4 py-2 rounded-md font-medium transition-colors ${getActiveChartTypeClass(
                            "products"
                        )}`}
                    >
                        Sản phẩm đã bán
                    </button>
                </div>
            </div>

            <div className="h-[16.9rem] w-full">
                {!hasData ? (
                    <div className="h-full w-full flex items-center justify-center bg-gray-50 rounded-lg">
                        <p className="text-gray-500 text-lg">Không có dữ liệu trong khoảng thời gian này</p>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        {chartType === "orders" ? (
                            <AreaChart data={filteredData.chartData}>
                                {/* Chart content for orders */}
                                <defs>
                                    <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.1} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                <XAxis
                                    dataKey="date"
                                    textAnchor="end"
                                    tick={{ fill: "#666", fontSize: 12 }}
                                    tickMargin={10}
                                />
                                <YAxis
                                    tick={{ fill: "#666", fontSize: 12 }}
                                    tickFormatter={(value) => value.toLocaleString()}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                                        border: "1px solid #ddd",
                                        borderRadius: "4px",
                                        boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
                                    }}
                                    formatter={(value) => [value.toLocaleString(), "Số đơn hàng"]}
                                />
                                <Legend verticalAlign="top" height={36} />
                                <Area
                                    type="monotone"
                                    dataKey="orders"
                                    stroke="#4f46e5"
                                    fillOpacity={1}
                                    fill="url(#colorOrders)"
                                    strokeWidth={2}
                                    name="Số đơn hàng"
                                    activeDot={{ r: 6, strokeWidth: 2, stroke: "#4f46e5" }}
                                />
                            </AreaChart>
                        ) : chartType === "revenue" ? (
                            <AreaChart data={filteredData.chartData}>
                                {/* Chart content for revenue */}
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                <XAxis
                                    dataKey="date"
                                    textAnchor="end"
                                    tick={{ fill: "#666", fontSize: 12 }}
                                    tickMargin={10}
                                />
                                <YAxis
                                    tick={{ fill: "#666", fontSize: 12 }}
                                    tickFormatter={(value) =>
                                        value >= 1000000
                                            ? `${(value / 1000000).toFixed(1)}M`
                                            : value >= 1000
                                                ? `${(value / 1000).toFixed(0)}K`
                                                : value
                                    }
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                                        border: "1px solid #ddd",
                                        borderRadius: "4px",
                                        boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
                                    }}
                                    formatter={(value) => [
                                        value.toLocaleString() + "₫",
                                        "Doanh thu",
                                    ]}
                                />
                                <Legend verticalAlign="top" height={36} />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#10b981"
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                    strokeWidth={2}
                                    name="Doanh thu"
                                    activeDot={{ r: 6, strokeWidth: 2, stroke: "#10b981" }}
                                />
                            </AreaChart>
                        ) : (
                            <AreaChart data={filteredData.chartData}>
                                {/* Chart content for products sold */}
                                <defs>
                                    <linearGradient id="colorProducts" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                <XAxis
                                    dataKey="date"
                                    textAnchor="end"
                                    tick={{ fill: "#666", fontSize: 12 }}
                                    tickMargin={10}
                                />
                                <YAxis
                                    tick={{ fill: "#666", fontSize: 12 }}
                                    tickFormatter={(value) => value.toLocaleString()}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                                        border: "1px solid #ddd",
                                        borderRadius: "4px",
                                        boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
                                    }}
                                    formatter={(value) => [
                                        value.toLocaleString(),
                                        "Sản phẩm đã bán",
                                    ]}
                                />
                                <Legend verticalAlign="top" height={36} />
                                <Area
                                    type="monotone"
                                    dataKey="productsSold"
                                    stroke="#f59e0b"
                                    fillOpacity={1}
                                    fill="url(#colorProducts)"
                                    strokeWidth={2}
                                    name="Sản phẩm đã bán"
                                    activeDot={{ r: 6, strokeWidth: 2, stroke: "#f59e0b" }}
                                />
                            </AreaChart>
                        )}
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};

export default OrderChart;
