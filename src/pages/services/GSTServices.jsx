import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Receipt, Check, ArrowRight, Loader2 } from "lucide-react";
import Axios from "../../utils/Axios";
import SummaryApi from "../../common/SummerAPI";

const GSTServices = () => {
  // 1. State for Data & Loading
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  // Static Info
  const serviceInfo = {
    id: "gst",
    title: "GST Services",
    description: "Complete GST solutions including registration, return filing, and compliance management.",
    icon: Receipt,
    color: "bg-violet-500",
  };

  const getdata = async () => {
    try {
      const res = await Axios({
        url: `${SummaryApi.getplan.url}?category=GST%20Services`,
        method: SummaryApi.getplan.method,
      });

      console.log("GST Data:", res.data);

      // 2. Data Extraction
      if (res.data.success) {
        setPlans(res.data.data || []);
      }
    } catch (err) {
      console.log("Error fetching GST plans:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getdata();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up { animation: fadeUp 0.8s ease-out forwards; }
      `}</style>

      <main className="pt-24 pb-16">
        
        <section className="bg-blue-600 py-16">
          <div className="container mx-auto px-4 text-center">
            <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl ${serviceInfo.color} flex items-center justify-center shadow-lg`}>
              <serviceInfo.icon className="w-8 h-8 text-white" />
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4">
              {serviceInfo.title}
            </h1>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
              {serviceInfo.description}
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-16">
          
          {loading ? (
             <div className="flex justify-center items-center h-40">
                <Loader2 className="w-10 h-10 animate-spin text-violet-500" />
             </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              
              {plans.length > 0 ? (
                plans.map((plan, index) => (
                  <div
                    key={plan._id || index}
                    className={`relative flex flex-col bg-white rounded-xl transition-all duration-300 animate-fade-up overflow-hidden ${
                      plan.isPopular 
                        ? "border-2 border-violet-500 shadow-xl scale-[1.02] z-10" 
                        : "border border-slate-200 hover:border-violet-300 hover:shadow-lg"
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    
                    {plan.isPopular && (
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-violet-500 text-white text-xs font-bold px-3 py-1 rounded-b-lg shadow-sm tracking-wide uppercase">
                        Most Popular
                      </div>
                    )}

                    <div className="p-6 pb-2 pt-8">
                      {/* FIXED: 'planName' */}
                      <h3 className="text-xl font-bold text-slate-900">{plan.planName}</h3>
                      <p className="text-sm text-slate-500 mt-1 min-h-[40px]">{plan.description}</p>
                      <div className="pt-4 flex items-baseline gap-1">
                        <span className="text-4xl font-extrabold text-slate-900">
                           ₹{plan.price}
                        </span>
                        <span className="text-slate-400 font-medium">/filing</span>
                      </div>
                    </div>

                    <div className="p-6 pt-0 flex-1 flex flex-col">
                      <ul className="space-y-3 mt-4 mb-8 flex-1">
                        {plan.features?.map((feature, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-violet-500 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-slate-600 leading-snug">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <Link
                       to={`/checkout?service=${serviceInfo.id}&plan=${plan.planName.toLowerCase()}`}
                        className={`w-full inline-flex items-center justify-center rounded-lg text-sm font-bold h-11 transition-all ${
                          plan.isPopular
                            ? "bg-violet-500 text-white hover:bg-violet-600 shadow-md hover:shadow-lg"
                            : "border border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
                        }`}
                      >
                        Choose {plan.planName}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </div>

                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center text-slate-500">
                    No GST Services plans found.
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default GSTServices;