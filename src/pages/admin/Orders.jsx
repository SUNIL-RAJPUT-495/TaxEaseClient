import React, { useEffect, useState } from 'react';
import Axios from '../../utils/axios';
import SummaryApi from '../../common/SummerAPI';
import { Search, Loader2, FileText, Calendar, User } from 'lucide-react';


const StatusBadge = ({ status }) => {
  let styles = "";
  switch (status) {
    case "paid": 
      styles = "bg-green-100 text-green-700 border-green-200"; 
      break;
    case "failed": 
      styles = "bg-red-100 text-red-700 border-red-200"; 
      break;
    default: 
      styles = "bg-yellow-100 text-yellow-700 border-yellow-200";
  }
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles}`}>
      {status?.toUpperCase()}
    </span>
  );
};

function Orders() {
  // --- States ---
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // --- API Call ---
  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        url: SummaryApi.allOrders.url, // Ensure SummaryAPI mein 'allOrders' hai
        method: SummaryApi.allOrders.method,
      });

      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  // --- Search Logic ---
  const filteredOrders = orders.filter((order) => 
    order.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.service?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order._id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- Loading Screen ---
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-slate-50 space-y-6">
      
      {/* --- Header Section --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Orders Management</h1>
          <p className="text-slate-500 text-sm">View and manage all customer transactions.</p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search Order ID, User or Service..." 
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* --- Table Section --- */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            
            {/* Table Head */}
            <thead className="bg-slate-50 text-slate-900 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Service Details</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                    
                    {/* ID */}
                    <td className="p-4 font-mono text-xs text-slate-500">
                      #{order._id.slice(-6).toUpperCase()}
                    </td>

                    {/* Customer Info */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                           <User className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{order.userId?.name || "Deleted User"}</p>
                          <p className="text-xs text-slate-400">{order.userId?.email || "No Email"}</p>
                        </div>
                      </div>
                    </td>

                    {/* Service Info */}
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-400" />
                        <span className="font-medium text-slate-700">{order.service}</span>
                      </div>
                      <span className="text-xs text-slate-400 ml-6 block">{order.plan} Plan</span>
                    </td>

                    {/* Amount */}
                    <td className="p-4 font-bold text-slate-900">
                      ₹{order.amount}
                    </td>

                    {/* Status Badge */}
                    <td className="p-4">
                      <StatusBadge status={order.status} />
                    </td>

                    {/* Date */}
                    <td className="p-4 text-slate-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-10 text-center text-slate-500">
                    No orders found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default Orders;