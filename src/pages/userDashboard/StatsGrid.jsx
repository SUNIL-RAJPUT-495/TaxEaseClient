import React from "react";
import { ShoppingBag, Clock, CheckCircle } from "lucide-react";

const StatsGrid = ({ total, pending, completed }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100"><ShoppingBag className="w-6 h-6 text-blue-600" /></div>
        <div><p className="text-2xl font-bold text-slate-900">{total}</p><p className="text-sm text-slate-500">Total Services</p></div>
      </div>
    </div>
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-yellow-50 flex items-center justify-center border border-yellow-100"><Clock className="w-6 h-6 text-yellow-600" /></div>
        <div><p className="text-2xl font-bold text-slate-900">{pending}</p><p className="text-sm text-slate-500">Pending / Unpaid</p></div>
      </div>
    </div>
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center border border-green-100"><CheckCircle className="w-6 h-6 text-green-600" /></div>
        <div><p className="text-2xl font-bold text-slate-900">{completed}</p><p className="text-sm text-slate-500">Active / Paid</p></div>
      </div>
    </div>
  </div>
);

export default StatsGrid;