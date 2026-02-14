import React, { useEffect, useState } from "react";
import {  AlertCircle,  Plus, Users, Loader2, CheckCircle2, 
  Pencil, Trash2 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Axios from "../../utils/axios";
import SummaryApi from "../../common/SummerAPI";
import { toast } from "react-hot-toast";

const AllServices = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllPlans = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        url: SummaryApi.getAllServices?.url,
        method: SummaryApi.getAllServices?.method,
      });

      if (response.data.success) {
        setPlans(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
      toast.error("Failed to load plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllPlans();
  }, []);

  // 🔥 DELETE PLAN LOGIC
  const handleDeletePlan = async (planId, planName) => {
    if (window.confirm(`Are you sure you want to delete the "${planName}" plan? This action cannot be undone.`)) {
      try {
        const response = await Axios({
          // 🛠️ SummaryApi se config uthayenge
          url: SummaryApi.deletePlan.url,
          method: SummaryApi.deletePlan.method,
          data: { id: planId } // Backend controller 'id' expect kar raha hai
        });

        if (response.data.success) {
          toast.success("Plan deleted successfully");
          setPlans(prev => prev.filter(p => p._id !== planId));
        }
      } catch (error) {
        console.error("Delete Error:", error);
        toast.error(error.response?.data?.message || "Failed to delete plan");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      
      {/* --- Page Header --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Service Plans</h1>
          <p className="text-sm text-slate-500">Manage pricing and track subscriptions.</p>
        </div>
        <button 
          className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg active:scale-95" 
          onClick={() => navigate("/admin/services/create")}
        >
          <Plus className="w-4 h-4" />
          Add New Plan
        </button>
      </div>

      {/* --- Plans Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {plans && plans.length > 0 ? (
          plans.map((plan) => (
            <div 
              key={plan._id} 
              className={`relative flex flex-col bg-white border ${plan.isPopular ? 'border-blue-500 ring-1 ring-blue-500/20' : 'border-slate-200'} rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 group`}
            >
              {plan.isPopular && (
                <span className="absolute -top-3 left-6 bg-blue-600 text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest shadow-md">
                  Most Popular
                </span>
              )}

              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">{plan.planName}</h3>
                  <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest bg-blue-50 w-fit px-2 py-0.5 rounded mt-1">{plan.serviceCategory}</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-slate-900">₹{plan.price}</span>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">One Time Payment</p>
                </div>
              </div>

              <p className="text-sm text-slate-500 mb-6 line-clamp-2 italic leading-relaxed">"{plan.description}"</p>

              <div className="space-y-2.5 mb-8 flex-1">
                {plan.features?.slice(0, 5).map((feature, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm text-slate-600">
                    <div className="bg-green-100 p-0.5 rounded-full"><CheckCircle2 size={12} className="text-green-600" /></div>
                    <span className="truncate font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="pt-5 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                      <Users size={16} />
                    </div>
                    <div className="leading-none">
                      <span className="text-sm font-black text-slate-900">{plan.totalUsers || 0}</span>
                      <p className="text-[9px] text-slate-400 font-bold uppercase">Users</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                     <button 
                       onClick={() => navigate(`/admin/services/edit/${plan._id}`)}
                       className="p-2.5 bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-xl transition-all"
                       title="Edit Plan"
                     >
                       <Pencil size={16} />
                     </button>
                     <button 
                       onClick={() => handleDeletePlan(plan._id, plan.planName)}
                       className="p-2.5 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 rounded-xl transition-all"
                       title="Delete Plan"
                     >
                       <Trash2 size={16} />
                     </button>
                  </div>
                </div>
              </div>

              <div className={`absolute top-4 right-4 w-2.5 h-2.5 rounded-full border-2 border-white ${plan.isActive ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]' : 'bg-red-500'}`} />
            </div>
          ))
        ) : (
          <div className="col-span-full py-24 text-center bg-white border-2 border-dashed rounded-3xl border-slate-200">
             <AlertCircle className="w-12 h-12 text-slate-200 mx-auto mb-3" />
             <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Empty Vault</p>
             <p className="text-xs text-slate-300 mt-1">Add your first service plan to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllServices;