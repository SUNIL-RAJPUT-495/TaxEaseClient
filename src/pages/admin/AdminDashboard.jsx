import React, { useEffect, useState } from "react";
import { 
  Users, ShoppingBag, IndianRupee, FileCheck, TrendingUp, Loader2 
} from "lucide-react";
import Axios from "../../utils/axios"
import SummaryApi from "../../common/SummerAPI";

const StatusBadge = ({ status }) => {
  let styles = "";
  let label = "";

  switch (status) {
    case "created":
      styles = "bg-yellow-50 text-yellow-700 border-yellow-200";
      label = "Pending";
      break;
    case "paid":
      styles = "bg-green-50 text-green-700 border-green-200";
      label = "Paid";
      break;
    case "failed":
      styles = "bg-red-50 text-red-700 border-red-200";
      label = "Failed";
      break;
    default:
      styles = "bg-slate-100 text-slate-600 border-slate-200";
      label = status || "Unknown";
  }

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${styles}`}>
      {label}
    </span>
  );
};

const AdminDashboard = () => {
  
  // --- States ---
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    failedOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Currency Formatter ---
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0 
    }).format(amount);
  };

  // --- Fetch All Data ---
  const fetchDashboardData = async () => {
    try {
        setLoading(true);

        // 1. Fetch Stats (Revenue, Counts)
        const statsRes = await Axios({
            url: SummaryApi.orderStats.url, 
            method: SummaryApi.orderStats.method
        });

        // 2. Fetch Recent Orders
        const ordersRes = await Axios({
            url: SummaryApi.recentOrders.url,
            method: SummaryApi.recentOrders.method
        });

        if (statsRes.data.success) {
            setStats(statsRes.data.data);
        }

        if (ordersRes.data.success) {
            setRecentOrders(ordersRes.data.data);
        }

    } catch (error) {
        console.error("Dashboard Data Error:", error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const statsCards = [
    { label: "Total Orders", value: stats.totalOrders, icon: ShoppingBag, change: "Updated", color: "bg-blue-500" },
    { label: "Total Revenue", value: formatCurrency(stats.totalRevenue), icon: IndianRupee, change: "Live", color: "bg-emerald-500" },
    { label: "Failed Orders", value: stats.failedOrders, icon: FileCheck, change: "Alert", color: "bg-red-500" },
  ];

  if (loading) {
    return (
        <div className="flex h-[80vh] items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      
      {/* --- Stats Cards --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsCards.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm transition-all hover:shadow-md">
            <div className="p-6 pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-400 font-medium">{stat.change}</span>
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center shadow-sm`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- Recent Orders Table --- */}
      <div className="rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm overflow-hidden">
        <div className="flex flex-col space-y-1.5 p-6 border-b border-slate-100 bg-slate-50/30">
          <h3 className="text-xl font-bold text-slate-900">Recent Orders</h3>
          <p className="text-sm text-slate-500">Latest transactions from users</p>
        </div>
        
        <div className="p-0">
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="h-12 px-6 align-middle font-semibold text-slate-500">Customer</th>
                  <th className="h-12 px-6 align-middle font-semibold text-slate-500">Service</th>
                  <th className="h-12 px-6 align-middle font-semibold text-slate-500">Amount</th>
                  <th className="h-12 px-6 align-middle font-semibold text-slate-500">Status</th>
                  <th className="h-12 px-6 align-middle font-semibold text-slate-500">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentOrders.length > 0 ? (
                    recentOrders.map((order) => (
                    <tr key={order._id} className="transition-colors hover:bg-slate-50/50">
                        <td className="p-6 py-4 align-middle">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                                    {order.userId?.name?.[0] || "U"}
                                </div>
                                <div>
                                    <p className="font-medium text-slate-900">{order.userId?.name || "Unknown"}</p>
                                    <p className="text-xs text-slate-500">{order.userId?.email}</p>
                                </div>
                            </div>
                        </td>
                        <td className="p-6 py-4 align-middle">
                        <div>
                            <p className="text-slate-900 font-medium">{order.service}</p>
                            <p className="text-xs text-slate-500">{order.plan} Plan</p>
                        </div>
                        </td>
                        <td className="p-6 py-4 align-middle font-bold text-slate-700">
                            {formatCurrency(order.amount)}
                        </td>
                        <td className="p-6 py-4 align-middle">
                        <StatusBadge status={order.status} />
                        </td>
                        <td className="p-6 py-4 align-middle text-slate-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                    </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="5" className="p-8 text-center text-slate-500">No recent orders found.</td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;