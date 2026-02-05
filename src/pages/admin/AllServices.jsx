import React from "react";
import { 
  FileText, Calculator, Receipt, AlertCircle, 
  MoreHorizontal, Plus, Users 
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const servicesData = [
  {
    id: 1,
    title: "ITR Filing",
    description: "Manage income tax return plans for salaried & business professionals.",
    icon: FileText,
    color: "bg-blue-500",
    activePlans: 3,
    totalUsers: 120,
  },
  {
    id: 2,
    title: "Tax Planning",
    description: "Strategic tax saving and investment planning services.",
    icon: Calculator,
    color: "bg-emerald-500",
    activePlans: 3,
    totalUsers: 85,
  },
  {
    id: 3,
    title: "GST Services",
    description: "GST registration, filing, and compliance management.",
    icon: Receipt,
    color: "bg-violet-500",
    activePlans: 3,
    totalUsers: 210,
  },
  {
    id: 4,
    title: "Notice Handling",
    description: "Expert assistance for income tax notices and scrutiny cases.",
    icon: AlertCircle,
    color: "bg-amber-500",
    activePlans: 3,
    totalUsers: 45,
  },
];

const AllServices = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      
      {/* --- Page Header --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">All Services</h1>
          <p className="text-sm text-slate-500">Manage and track all your service offerings.</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors" onClick={()=>navigate("/admin/services/create")}>
          <Plus className="w-4 h-4" />
          Add New Service
        </button>
      </div>

      {/* --- Services Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {servicesData.map((service) => (
          <div 
            key={service.id} 
            className="group bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200"
          >
            {/* Card Header */}
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl ${service.color} flex items-center justify-center shadow-sm`}>
                <service.icon className="w-6 h-6 text-white" />
              </div>
              <button className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-50">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            {/* Card Content */}
            <h3 className="text-lg font-bold text-slate-900 mb-1">{service.title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-6 min-h-[40px]">
              {service.description}
            </p>

            {/* Stats / Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="flex items-center gap-1.5 text-sm text-slate-600">
                <Users className="w-4 h-4 text-slate-400" />
                <span className="font-semibold">{service.totalUsers}</span>
                <span className="text-slate-400">Users</span>
              </div>
              
              <button className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline">
                Manage
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default AllServices;