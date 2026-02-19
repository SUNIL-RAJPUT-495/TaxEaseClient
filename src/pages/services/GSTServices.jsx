import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Receipt, Check, ArrowRight, Loader2, ArrowLeft, Lock } from "lucide-react";
import Axios from "../../utils/axios";
import SummaryApi from "../../common/SummerAPI";
import OrderStepper from "../../component/OrderStepper";
import { useCheckPurchase } from "../../customHooks/useCheckPurchase";
import PurchaseGuard from "../../component/PurchaseGuard";

const GSTServices = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const { loading: checkingPurchase } = useCheckPurchase("GST Services", "category");

  const serviceInfo = {
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
 if (checkingPurchase) {
    return (
      <PurchaseGuard serviceName="GST Services" type="category"/>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-[60] flex items-center justify-between px-6 md:px-12 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-600">
            <ArrowLeft size={20} />
          </button>
          <div className="h-6 w-[1px] bg-slate-200 mx-2 hidden md:block"></div>
          <h1 className="text-lg font-bold text-slate-800">GST PLANS</h1>
        </div>
        <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
          <Lock size={14} /><span className="text-[10px] font-bold uppercase tracking-wider">Secure Checkout</span>
        </div>
      </header>

      <div className="fixed top-16 left-0 right-0 z-50 bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-5xl mx-auto">
          <OrderStepper currentStep={1} status="pending"/>
        </div>
      </div>

      <main className="pt-44 pb-16">
        
        <section className="bg-blue-600 py-12 mb-12">
          <div className="container mx-auto px-4 text-center">
            <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl ${serviceInfo.color} flex items-center justify-center shadow-lg`}>
              <serviceInfo.icon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight">
              {serviceInfo.title}
            </h1>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
              {serviceInfo.description}
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex flex-col justify-center items-center h-40 gap-3">
              <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
              <p className="text-slate-400 text-sm font-medium">Loading available plans...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {plans.length > 0 ? (
                plans.map((plan, index) => (
                  <div
                    key={plan._id || index}
                    className={`relative flex flex-col bg-white rounded-xl transition-all duration-300 border ${
                      plan.isPopular 
                        ? "border-blue-500 shadow-xl scale-[1.02] z-10" 
                        : "border-slate-200 hover:border-blue-300 hover:shadow-lg"
                    }`}
                  >
                    
                    {plan.isPopular && (
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[10px] font-black px-3 py-1 rounded-b-lg shadow-sm tracking-widest uppercase">
                        Most Popular
                      </div>
                    )}

                    <div className="p-6 pb-2 pt-8">
                      <h3 className="text-xl font-bold text-slate-900">{plan.planName}</h3>
                      <p className="text-sm text-slate-500 mt-1 min-h-[40px] leading-relaxed">{plan.description}</p>
                      <div className="pt-4 flex items-baseline gap-1">
                        <span className="text-4xl font-extrabold text-slate-900">₹{plan.price}</span>
                        <span className="text-slate-400 font-medium">/service</span>
                      </div>
                    </div>

                    <div className="p-6 pt-0 flex-1 flex flex-col">
                      <ul className="space-y-3 mt-4 mb-8 flex-1">
                        {plan.features?.map((feature, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-slate-600 leading-snug">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <Link
                        to={`/checkout?planId=${plan._id}`}
                        className={`w-full inline-flex items-center justify-center rounded-lg text-sm font-bold h-11 transition-all ${
                          plan.isPopular
                            ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
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
                <div className="col-span-3 text-center py-20 bg-white rounded-xl border border-dashed border-slate-300 text-slate-400">
                    <p className="font-medium">No GST plans available at the moment.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Floating Trust Badge */}
      <div className="fixed bottom-6 left-6 hidden lg:block">
        <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm flex items-center gap-3">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">
            <Check size={16} strokeWidth={3} />
          </div>
          <p className="text-[10px] font-bold text-slate-700 uppercase tracking-tight">Verified Expert Assistance</p>
        </div>
      </div>

    </div>
  );
};

export default GSTServices;