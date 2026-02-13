import React from "react";
import { FileText, Download } from "lucide-react";

const StatusBadge = ({ status }) => {
  let styles = "";
  let label = "";
  switch (status) {
    case "created": styles = "bg-yellow-50 text-yellow-600 border-yellow-200"; label = "Pending Payment"; break;
    case "paid": styles = "bg-green-50 text-green-600 border-green-200"; label = "Active / Paid"; break;
    case "failed": styles = "bg-red-50 text-red-600 border-red-200"; label = "Failed"; break;
    default: styles = "bg-slate-100 text-slate-600 border-slate-200"; label = status || "Unknown";
  }
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors ${styles}`}>{label}</span>;
};

const ServicesList = ({ orders = [] }) => (
  <div className="rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm">
    <div className="flex flex-col space-y-1.5 p-6 pb-2">
      <h3 className="text-2xl font-semibold leading-none tracking-tight">My Services</h3>
      <p className="text-sm text-slate-500">Track your purchased services and their status</p>
    </div>
    <div className="p-6 pt-0">
      <div className="space-y-4 mt-4">
        {orders.length > 0 ? [...orders].reverse().map((order) => (
          <div key={order._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-blue-300 transition-colors gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100"><FileText className="w-5 h-5 text-blue-600" /></div>
              <div>
                <p className="font-medium text-slate-900">{order.service}</p>
                <p className="text-sm text-slate-500">{order.plan} Plan • {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 sm:justify-end">
              <StatusBadge status={order.status} />
              <span className="font-medium text-slate-900">₹{order.amount}</span>
              {order.status === 'paid' && <button className="p-2 hover:bg-slate-100 rounded-md"><Download size={16} /></button>}
            </div>
          </div>
        )) : <div className="text-center py-8 text-slate-500">No services purchased yet.</div>}
      </div>
    </div>
  </div>
);

export default ServicesList;