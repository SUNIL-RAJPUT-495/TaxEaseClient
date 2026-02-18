import React, { useState, useEffect } from "react";
import Axios from "../../utils/axios";
import { Plus, Trash2, Save, FilePlus } from "lucide-react";
import SummaryApi from "../../common/SummerAPI";
import toast from "react-hot-toast";

const SetDocRequirements = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  
  const [allPlans, setAllPlans] = useState([]);   
  const [displayPlans, setDisplayPlans] = useState([]); 
  
  const [selectedPlan, setSelectedPlan] = useState("");
  const [docList, setDocList] = useState([{ docName: "", isMandatory: true }]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch Services
        const resServices = await Axios({
          url: SummaryApi.getAllServices.url,
          method: SummaryApi.getAllServices.method
        });
        if (resServices.data.success) {
            setServices(resServices.data.data || []);
        }

        // 2. Fetch Plans
        const resPlans = await Axios({
          url: SummaryApi.getplan.url,
          method: SummaryApi.getplan.method
        });
        if (resPlans.data.success) {
            setAllPlans(resPlans.data.data || []);
        }
      } catch (error) {
        toast.error("Failed to load dropdown options");
      }
    };
    
    fetchData();
  }, []);
  console.log()

  const handleServiceChange = (id) => {
    setSelectedService(id);
    setSelectedPlan(""); 
    
    const service = services.find(s => s._id === id);
    
    if (service && service.plans && service.plans.length > 0) {
        setDisplayPlans(service.plans);
    } else {
        const matchingPlans = allPlans.filter(p => p.serviceId === id || p.service === id);
        
        setDisplayPlans(matchingPlans.length > 0 ? matchingPlans : allPlans);
    }
  };

  const addField = () => {
    setDocList([...docList, { docName: "", isMandatory: true }]);
  };

  const removeField = (index) => {
    const values = [...docList];
    values.splice(index, 1);
    setDocList(values);
  };

  const handleInputChange = (index, event) => {
    const values = [...docList];
    values[index] = { ...values[index], docName: event.target.value };
    setDocList(values);
  };

  const handleCheckboxChange = (index) => {
    const values = [...docList];
    values[index] = { ...values[index], isMandatory: !values[index].isMandatory };
    setDocList(values);
  };

  const handleSave = async () => {
    if (!selectedService) return toast.error("Please select a Service");
    if (!selectedPlan) return toast.error("Please select a Plan");
    
    const validDocs = docList.filter(doc => doc.docName.trim() !== "");
    if (validDocs.length === 0) return toast.error("Please add at least one document name");

    try {
      setLoading(true);
      const res = await Axios({
        url: SummaryApi.setDocuments.url,
        method: SummaryApi.setDocuments.method,
        data: {
            serviceId: selectedService,
            planId: selectedPlan,
            documents: validDocs
        }
      });
      
      toast.success("Document requirements saved successfully!");
      
    } catch (error) {
      toast.error(error.response?.data?.message || "Error saving requirements");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-3xl shadow-sm border border-slate-200">
      <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2">
        <FilePlus className="text-blue-600" /> Manage Document Requirements
      </h2>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Select Service</label>
          <select 
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" 
            value={selectedService}
            onChange={(e) => handleServiceChange(e.target.value)}
          >
            <option value="">Choose Service</option>
            {services.map(s => <option key={s._id} value={s._id}>{s.name || s.categoryName}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Select Plan</label>
          <select 
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" 
            value={selectedPlan}
            onChange={(e) => setSelectedPlan(e.target.value)}
            disabled={!selectedService}
          >
            <option value="">Choose Plan</option>
            {/* 🔥 Yahan displayPlans use hoga */}
            {displayPlans.map(p => <option key={p._id} value={p._id}>{p.planName}</option>)}
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-bold text-slate-700">Documents Needed:</label>
        
        {docList.map((doc, index) => (
          <div key={index} className="flex gap-3 items-center animate-in slide-in-from-left duration-200 bg-slate-50 p-2 rounded-2xl border border-slate-100">
            <input
              type="text"
              placeholder={`Document Name (e.g. Pan Card)`}
              className="flex-1 p-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700"
              value={doc.docName}
              onChange={(e) => handleInputChange(index, e)}
            />
            
            <label className="flex items-center gap-2 px-3 cursor-pointer">
                <input 
                   type="checkbox" 
                   checked={doc.isMandatory}
                   onChange={() => handleCheckboxChange(index)}
                   className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm font-bold text-slate-600 select-none">Required</span>
            </label>

            {docList.length > 1 && (
              <button 
                onClick={() => removeField(index)} 
                title="Remove Document"
                className="p-3 text-red-500 hover:text-white hover:bg-red-500 rounded-xl transition-all"
              >
                <Trash2 size={20} />
              </button>
            )}
          </div>
        ))}
        
        <button onClick={addField} className="flex items-center gap-2 text-blue-600 font-bold py-3 px-4 rounded-xl border-2 border-dashed border-blue-200 hover:bg-blue-50 hover:border-blue-400 w-full justify-center transition-all mt-2">
          <Plus size={18} /> Add Another Document
        </button>
      </div>

      <button 
        onClick={handleSave} 
        disabled={loading}
        className="w-full bg-blue-700 text-white py-4 rounded-2xl font-black mt-8 flex items-center justify-center gap-2 hover:bg-blue-800 transition-all shadow-lg shadow-blue-200 disabled:opacity-70"
      >
        <Save size={20} /> {loading ? "SAVING..." : "SAVE ALL REQUIREMENTS"}
      </button>
    </div>
  );
};

export default SetDocRequirements;