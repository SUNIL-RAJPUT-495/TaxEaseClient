import React from "react";
import { 
  Users, ShoppingBag, IndianRupee, FileCheck, TrendingUp 
} from "lucide-react";

// --- Mock Data ---
const recentOrders = [
  {
    id: "ORD001",
    user: "Priya Sharma",
    email: "priya@email.com",
    service: "ITR Filing",
    plan: "Standard",
    amount: "₹999",
    status: "completed",
    date: "2024-01-16",
  },
  {
    id: "ORD002",
    user: "Rajesh Kumar",
    email: "rajesh@email.com",
    service: "GST Services",
    plan: "Premium",
    amount: "₹3,999",
    status: "in_progress",
    date: "2024-01-15",
  },
  {
    id: "ORD003",
    user: "Anita Patel",
    email: "anita@email.com",
    service: "Tax Planning",
    plan: "Basic",
    amount: "₹999",
    status: "pending",
    date: "2024-01-14",
  },
];

const stats = [
  { label: "Total Users", value: "1,234", icon: Users, change: "+12%", color: "bg-blue-500" },
  { label: "Total Orders", value: "456", icon: ShoppingBag, change: "+8%", color: "bg-emerald-500" },
  { label: "Revenue", value: "₹4.5L", icon: IndianRupee, change: "+23%", color: "bg-violet-500" },
  { label: "Completed", value: "389", icon: FileCheck, change: "+15%", color: "bg-amber-500" },
];

// --- Helper Component: Status Badge ---
const StatusBadge = ({ status }) => {
  let styles = "";
  let label = "";

  switch (status) {
    case "pending":
      styles = "bg-yellow-50 text-yellow-700 border-yellow-200";
      label = "Pending";
      break;
    case "in_progress":
      styles = "bg-blue-50 text-blue-700 border-blue-200";
      label = "In Progress";
      break;
    case "completed":
      styles = "bg-green-50 text-green-700 border-green-200";
      label = "Completed";
      break;
    default:
      styles = "bg-slate-100 text-slate-600 border-slate-200";
      label = "Unknown";
  }

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${styles}`}>
      {label}
    </span>
  );
};

// --- Main Component ---
const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm transition-all hover:shadow-md">
            <div className="p-6 pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600 font-medium">{stat.change}</span>
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

      {/* Recent Orders Table */}
      <div className="rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6 border-b border-slate-100">
          <h3 className="text-xl font-bold text-slate-900">Recent Orders</h3>
          <p className="text-sm text-slate-500">Latest transactions from users</p>
        </div>
        
        <div className="p-0">
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm text-left">
              <thead className="bg-slate-50/50">
                <tr className="border-b border-slate-200">
                  <th className="h-12 px-6 align-middle font-semibold text-slate-500">Order ID</th>
                  <th className="h-12 px-6 align-middle font-semibold text-slate-500">Customer</th>
                  <th className="h-12 px-6 align-middle font-semibold text-slate-500">Service</th>
                  <th className="h-12 px-6 align-middle font-semibold text-slate-500">Amount</th>
                  <th className="h-12 px-6 align-middle font-semibold text-slate-500">Status</th>
                  <th className="h-12 px-6 align-middle font-semibold text-slate-500">Date</th>
                  <th className="h-12 px-6 align-middle font-semibold text-slate-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="transition-colors hover:bg-slate-50/80">
                    <td className="p-6 py-4 align-middle font-medium text-slate-900">{order.id}</td>
                    <td className="p-6 py-4 align-middle">
                      <div>
                        <p className="font-medium text-slate-900">{order.user}</p>
                        <p className="text-xs text-slate-500">{order.email}</p>
                      </div>
                    </td>
                    <td className="p-6 py-4 align-middle">
                      <div>
                        <p className="text-slate-900 font-medium">{order.service}</p>
                        <p className="text-xs text-slate-500">{order.plan}</p>
                      </div>
                    </td>
                    <td className="p-6 py-4 align-middle font-bold text-slate-700">{order.amount}</td>
                    <td className="p-6 py-4 align-middle">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="p-6 py-4 align-middle text-slate-500">{order.date}</td>
                    <td className="p-6 py-4 align-middle text-right">
                      <button className="inline-flex items-center justify-center rounded-lg text-xs font-medium transition-colors border border-slate-200 hover:bg-slate-100 hover:text-slate-900 h-8 px-3">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;