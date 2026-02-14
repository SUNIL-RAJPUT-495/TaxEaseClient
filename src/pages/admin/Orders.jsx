import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from '../../utils/axios';
import SummaryApi from '../../common/SummerAPI';
import { Search, Loader2, User, Check, X, ListChecks, AlertCircle, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // 'all', 'unseen', 'paid', 'failed'
  const navigate = useNavigate();

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        url: SummaryApi.allOrders.url,
        method: SummaryApi.allOrders.method,
      });
      if (response.data.success) setOrders(response.data.data);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  // 🔥 API Call to mark as seen and then Navigate
  const handleManageOrder = async (orderId) => {
    try {
      // 1. API call to update database
      await Axios({
        url: SummaryApi.markOrderAsSeen.url,
        method: SummaryApi.markOrderAsSeen.method,
        data: { orderId }
      });

      // 2. Navigate to Details Page
      navigate(`/admin/order/${orderId}`);
    } catch (error) {
      console.error("Error marking as seen:", error);
      // Fail safe: Navigate anyway even if API fails
      navigate(`/admin/order/${orderId}`);
    }
  };

  const handleOrderStatusUpdate = async (orderId, newStatus) => {
    try {
      const res = await Axios({
        url: SummaryApi.updateOrderStatus.url,
        method: SummaryApi.updateOrderStatus.method,
        data: { orderId, status: newStatus }
      });
      if (res.data.success) {
        setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
        toast.success(`Order marked as ${newStatus}`);
      }
    } catch (error) {
      toast.error("Failed to update order");
    }
  };

  // 🔥 Filter Logic: Search + Status Tabs + Unseen Logic
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
        order.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        order._id?.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    if (activeTab === "unseen") return matchesSearch && order.isSeen === false;
    return matchesSearch && order.status === activeTab;
  });

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;

  return (
    <div className="p-6 min-h-screen bg-slate-50 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Orders Management</h1>
        
        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search customer or ID..." 
            className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white shadow-sm" 
            value={searchTerm} 
            onChange={e => setSearchTerm(e.target.value)} 
          />
        </div>
      </div>

      {/* 🔥 TOP OPTIONS (4 Buttons) */}
      <div className="flex flex-wrap bg-white p-1 rounded-xl shadow-sm border border-slate-200 w-fit gap-1">
        <button 
          onClick={() => setActiveTab("all")} 
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'all' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          <ListChecks size={16}/> All ({orders.length})
        </button>
        <button 
          onClick={() => setActiveTab("unseen")} 
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'unseen' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          <EyeOff size={16}/> Unseen ({orders.filter(o => !o.isSeen).length})
        </button>
        <button 
          onClick={() => setActiveTab("paid")} 
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'paid' ? 'bg-green-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          <Check size={16}/> Paid ({orders.filter(o => o.status === 'paid').length})
        </button>
        <button 
          onClick={() => setActiveTab("failed")} 
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'failed' ? 'bg-red-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          <X size={16}/> Rejected ({orders.filter(o => o.status === 'failed').length})
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 font-semibold border-b border-slate-200 text-slate-900">
            <tr>
              <th className="p-4">Order ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Service</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredOrders.map((order) => (
              <tr 
                key={order._id} 
                // 🔥 Logic: Background Blue for Unseen Orders
                className={`transition-colors duration-200 ${!order.isSeen ? 'bg-blue-50/80 hover:bg-blue-100/80' : 'hover:bg-slate-50'}`}
              >
                <td className="p-4 font-mono text-xs font-semibold">
                    #{order._id.slice(-6).toUpperCase()}
                    {!order.isSeen && <span className="ml-2 px-2 py-0.5 bg-blue-600 text-[10px] text-white rounded-full font-bold animate-pulse">NEW</span>}
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs"><User size={14} /></div>
                    <div>
                        <p className="font-bold text-slate-900">{order.userId?.name}</p>
                        <p className="text-[11px] text-slate-500">{order.userId?.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 font-medium text-slate-700">{order.service}</td>
                <td className="p-4 font-bold uppercase text-[10px]">
                    <span className={`px-2 py-1 rounded-full border ${order.status === 'paid' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200'}`}>
                        {order.status}
                    </span>
                </td>

                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2 items-center">
                    <button onClick={() => handleOrderStatusUpdate(order._id, 'paid')} disabled={order.status === 'paid'} className="p-1.5 border border-green-200 bg-green-50 rounded-lg hover:bg-green-100 text-green-600 disabled:opacity-30"><Check size={16} /></button>
                    <button onClick={() => handleOrderStatusUpdate(order._id, 'failed')} disabled={order.status === 'failed'} className="p-1.5 border border-red-200 bg-red-50 rounded-lg hover:bg-red-100 text-red-600 disabled:opacity-30"><X size={16} /></button>
                    
                    <div className="h-6 w-px bg-slate-200 mx-1"></div>

                    <button
                      onClick={() => handleManageOrder(order._id)}
                      className={`px-4 py-1.5 rounded-lg transition-all font-bold text-xs shadow-sm active:scale-95 ${!order.isSeen ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-800 text-white hover:bg-slate-900'}`}
                    >
                      {!order.isSeen ? 'Manage Now' : 'Manage'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Orders;