import React, { useState } from "react";
import { 
  ArrowLeft, Plus, X, Save, Check, FileText, Calculator, Receipt, AlertCircle 
} from "lucide-react";
import { Link } from "react-router-dom";
import Axios from "../../../utils/axios"
import SummaryApi from "../../../common/SummerAPI";


const CreateServicePlan = () => {
  const [serviceCategory, setServiceCategory] = useState("ITR Filing");
  const [planName, setPlanName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState([]);
  const [currentFeature, setCurrentFeature] = useState("");
  const [isPopular, setIsPopular] = useState(false);
  const [loading, setLoading] = useState(false);


  const addFeature = (e) => {
    e.preventDefault();
    if (currentFeature.trim()) {
      setFeatures([...features, currentFeature]);
      setCurrentFeature("");
    }
  };

  const removeFeature = (index) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addFeature(e);
    }
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const finalData = {
      serviceCategory,
      planName,
      price,
      description,
      features,
      isPopular
    };

    try {
      const res = await Axios({
        method: SummaryApi.createPlan.method,
        url: SummaryApi.createPlan.url,
        data: finalData
      });

      console.log("Response:", res);

      if (res.data.success) { 
        alert("Plan created successfully!");

        setPlanName("");
        setPrice("");
        setDescription("");
        setFeatures([]);
        setCurrentFeature("");
        setIsPopular(false);
        setServiceCategory("ITR Filing"); 
      }

    } catch (err) {
      console.error("Error creating plan:", err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex items-center gap-4">
        <Link to="/admin/services" className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Create New Plan</h1>
          <p className="text-sm text-slate-500">Add a pricing package to your services.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Service Category</label>
              <select 
                value={serviceCategory} 
                onChange={(e) => setServiceCategory(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              >
                <option>ITR Filing</option>
                <option>Tax Planning</option>
                <option>GST Services</option>
                <option>Notice Handling</option>
              </select>
            </div>


            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Plan Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Standard"
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Price (₹)</label>
                <input 
                  type="text" 
                  placeholder="e.g. 2,499"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>
            </div>


            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Short Description</label>
              <textarea 
                rows="2"
                placeholder="e.g. Comprehensive planning for professionals"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                required
              />
            </div>



            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Plan Features</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Type a feature and press Enter"
                  value={currentFeature}
                  onChange={(e) => setCurrentFeature(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="flex-1 h-10 px-3 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <button 
                  type="button" 
                  onClick={addFeature}
                  className="h-10 w-10 bg-slate-100 hover:bg-slate-200 rounded-md flex items-center justify-center text-slate-600 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>



              <div className="space-y-2 mt-2">
                {features.length === 0 && (
                  <p className="text-xs text-slate-400 italic">No features added yet.</p>
                )}
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded-md border border-slate-100">
                    <div className="flex items-center gap-2">
                      <Check className="w-3 h-3 text-green-500" />
                      <span className="text-sm text-slate-700">{feature}</span>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => removeFeature(index)}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>



            <div className="flex items-center gap-2 pt-2">
              <input 
                type="checkbox" 
                id="isPopular"
                checked={isPopular}
                onChange={(e) => setIsPopular(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="isPopular" className="text-sm font-medium text-slate-700 cursor-pointer">
                Mark as "Most Popular"
              </label>
            </div>



            <div className="pt-4">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full h-11 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? "Saving..." : <><Save className="w-4 h-4" /> Create Plan</>}
              </button>
            </div>

          </form>
        </div>

        <div>
          <div className="sticky top-24">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Live Preview</h3>
            


            <div className={`relative flex flex-col bg-white rounded-xl overflow-hidden transition-all duration-300 ${
              isPopular 
                ? "border-2 border-blue-600 shadow-xl scale-[1.02] z-10" 
                : "border border-slate-200 shadow-lg"
            }`}>
              


              {isPopular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-b-lg shadow-sm tracking-wide uppercase">
                  Most Popular
                </div>
              )}



              <div className="p-6 pb-2 pt-8 text-center sm:text-left">
                <span className="inline-block px-2 py-1 bg-slate-100 text-xs font-medium text-slate-500 rounded mb-2">
                  {serviceCategory}
                </span>
                <h3 className="text-xl font-bold text-slate-900">
                  {planName || "Plan Name"}
                </h3>
                <p className="text-sm text-slate-500 mt-1 min-h-[20px]">
                  {description || "Plan description will appear here..."}
                </p>
                <div className="pt-4 flex items-baseline gap-1 justify-center sm:justify-start">
                  <span className="text-4xl font-extrabold text-slate-900">
                    {price ? `₹${price}` : "₹0"}
                  </span>
                  <span className="text-slate-400 font-medium">/filing</span>
                </div>
              </div>



              <div className="p-6 pt-0 flex-1 flex flex-col">
                <ul className="space-y-3 mt-4 mb-8 flex-1">
                  {features.length > 0 ? (
                    features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-600 leading-snug">{feature}</span>
                      </li>
                    ))
                  ) : (
                    <>


                      <li className="flex items-start gap-3 opacity-30">
                        <Check className="w-5 h-5 text-slate-300" />
                        <span className="text-sm text-slate-400">Feature 1 goes here...</span>
                      </li>
                      <li className="flex items-start gap-3 opacity-30">
                        <Check className="w-5 h-5 text-slate-300" />
                        <span className="text-sm text-slate-400">Feature 2 goes here...</span>
                      </li>
                    </>
                  )}
                </ul>

                <button className={`w-full inline-flex items-center justify-center rounded-lg text-sm font-bold h-11 transition-all ${
                  isPopular 
                    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md" 
                    : "border border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
                }`}>
                  Choose Plan
                </button>
              </div>
            </div>

            <p className="text-center text-xs text-slate-400 mt-6">
              This is how the card will appear to users on the Services page.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CreateServicePlan;