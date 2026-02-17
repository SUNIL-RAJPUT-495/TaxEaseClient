import React, { useState, useEffect } from "react";
import Axios from "../../utils/axios";
import { Plus, Trash2, Save, FilePlus } from "lucide-react";

const SetDocRequirements = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState("");
  
  // 🔥 Is state mein saare documents store honge
  const [docList, setDocList] = useState([{ docName: "", isMandatory: true }]);

  useEffect(() => {
    // Fetch all services
    Axios.get("/api/admin/all-services").then(res => setServices(res.data.data));
  }, []);

  // Jab service select ho, tab uske plans set karo
  const handleServiceChange = (id) => {
    setSelectedService(id);
    const service = services.find(s => s._id === id);
    setPlans(service?.plans || []);
  };

  // Naya document field add karna
  const addField = () => {
    setDocList([...docList, { docName: "", isMandatory: true }]);
  };

  // Field remove karna
  const removeField = (index) => {
    const values = [...docList];
    values.splice(index, 1);
    setDocList(values);
  };

  // Input change handle karna
  const handleInputChange = (index, event) => {
    const values = [...docList];
    values[index].docName = event.target.value;
    setDocList(values);
  };

  const handleSave = async () => {
    try {
      await Axios.post("/api/admin/save-doc-requirements", {
        serviceId: selectedService,
        planId: selectedPlan,
        documents: docList
      });
      alert("Document requirements saved successfully!");
    } catch (error) {
      alert("Error saving requirements");
    }
  };

  return (
    <div className="p-6 bg-white rounded-3xl shadow-sm border">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FilePlus className="text-blue-600" /> Manage Document Requirements
      </h2>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-semibold mb-2">Select Service</label>
          <select className="w-full p-3 bg-slate-100 rounded-xl" onChange={(e) => handleServiceChange(e.target.value)}>
            <option value="">Choose Service</option>
            {services.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Select Plan</label>
          <select className="w-full p-3 bg-slate-100 rounded-xl" onChange={(e) => setSelectedPlan(e.target.value)}>
            <option value="">Choose Plan</option>
            {plans.map(p => <option key={p._id} value={p._id}>{p.planName}</option>)}
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-bold text-slate-700">Documents Needed:</label>
        {docList.map((doc, index) => (
          <div key={index} className="flex gap-2 items-center animate-in slide-in-from-left duration-200">
            <input
              type="text"
              placeholder={`Document Name (e.g. Pan Card)`}
              className="flex-1 p-3 border rounded-xl outline-none focus:border-blue-500"
              value={doc.docName}
              onChange={(e) => handleInputChange(index, e)}
            />
            {docList.length > 1 && (
              <button onClick={() => removeField(index)} className="p-3 text-red-500 hover:bg-red-50 rounded-xl">
                <Trash2 size={20} />
              </button>
            )}
          </div>
        ))}
        
        <button onClick={addField} className="flex items-center gap-2 text-blue-600 font-bold py-2 px-4 rounded-xl border-2 border-dashed border-blue-200 hover:bg-blue-50 w-full justify-center">
          <Plus size={18} /> Add More Documents
        </button>
      </div>

      <button onClick={handleSave} className="w-full bg-blue-700 text-white py-4 rounded-2xl font-bold mt-8 flex items-center justify-center gap-2 hover:bg-blue-800 transition-all">
        <Save size={20} /> Save All Requirements
      </button>
    </div>
  );
};

export default SetDocRequirements;