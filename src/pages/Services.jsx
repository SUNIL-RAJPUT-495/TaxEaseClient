import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  FileText, 
  Calculator, 
  Receipt, 
  AlertCircle, 
  ArrowRight, 
  Check,
  Loader2 
} from "lucide-react";
import Navbar from "../component/layout/Navbar"; 
import Axios from "../utils/axios";
import SummaryApi from "../common/SummerAPI";

const ServicesPage = () => {
  const [itrPlans, setItrPlans] = useState([]);
  const [gstPlans, setGstPlans] = useState([]);
  const [taxPlans, setTaxPlans] = useState([]);
  const [noticePlans, setNoticePlans] = useState([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllPlans = async () => {
      setLoading(true);
      try {
        const [itrRes, gstRes, taxRes, noticeRes] = await Promise.all([
          Axios({
            url: `${SummaryApi.getplan.url}?category=ITR%20Filing`,
            method: SummaryApi.getplan.method,
          }),
          Axios({
            url: `${SummaryApi.getplan.url}?category=GST%20Services`,
            method: SummaryApi.getplan.method,
          }),
          Axios({
            url: `${SummaryApi.getplan.url}?category=Tax%20Planning`,
            method: SummaryApi.getplan.method,
          }),
          Axios({
            url: `${SummaryApi.getplan.url}?category=Notice%20Handling`,
            method: SummaryApi.getplan.method,
          })
        ]);

        if (itrRes.data.success) setItrPlans(itrRes.data.data || []);
        if (gstRes.data.success) setGstPlans(gstRes.data.data || []);
        if (taxRes.data.success) setTaxPlans(taxRes.data.data || []);
        if (noticeRes.data.success) setNoticePlans(noticeRes.data.data || []);

      } catch (err) {
        console.error("Error fetching service plans:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllPlans();
  }, []);
console.log(itrPlans)

  const services = [
    {
      id: "itr-filing",
      title: "ITR Filing",
      description: "Hassle-free income tax return filing for salaried individuals, businesses, and professionals with expert CA assistance.",
      icon: FileText,
      color: "bg-blue-500",
      plans: itrPlans
    },
    {
      id: "tax-planning",
      title: "Tax Planning",
      description: "Strategic tax planning to maximize your savings and optimize your tax liability legally.",
      icon: Calculator,
      color: "bg-emerald-500",
      plans: taxPlans
    },
    {
      id: "gst",
      title: "GST Services",
      description: "Complete GST solutions including registration, return filing, and compliance management.",
      icon: Receipt,
      color: "bg-violet-500",
      plans: gstPlans
    },
    {
      id: "notice-handling",
      title: "Notice Handling",
      description: "Expert assistance for responding to income tax notices and handling assessments professionally.",
      icon: AlertCircle,
      color: "bg-amber-500",
      plans: noticePlans 
    },
  ];

  // Loading Screen
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar />

      {/* Inline Animation Style */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up { animation: fadeUp 0.8s ease-out forwards; }
      `}</style>

      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="bg-blue-600 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4">
              Our Services
            </h1>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Choose from our comprehensive range of tax and compliance services designed 
              for individuals and businesses across India.
            </p>
          </div>
        </section>

        {/* Services Sections */}
        <div className="container mx-auto px-4 py-16 space-y-24">
          {services.map((service) => (
            <section key={service.id} id={service.id} className="scroll-mt-24">
              
              {/* Service Header */}
              <div className="flex items-center gap-4 mb-8">
                <div className={`w-14 h-14 rounded-xl ${service.color} flex items-center justify-center shadow-lg`}>
                  <service.icon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                    {service.title}
                  </h2>
                  <p className="text-slate-500 mt-1 text-lg">{service.description}</p>
                </div>
              </div>

              {/* Plans Grid */}
              <div className="grid md:grid-cols-3 gap-6">
                {service.plans && service.plans.length > 0 ? (
                  service.plans.map((plan, planIndex) => (
                    <div 
                      key={plan._id || planIndex} 
                      className={`relative flex flex-col bg-white rounded-xl transition-all duration-300 animate-fade-up overflow-hidden ${
                        plan.popular 
                          ? "border-2 border-blue-600 shadow-xl scale-[1.02] z-10" 
                          : "border border-slate-200 hover:border-blue-300 hover:shadow-lg"
                      }`}
                      style={{ animationDelay: `${planIndex * 100}ms` }}
                    >
                      
                      {/* Most Popular Badge */}
                      {plan.isPopular && (
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-b-lg shadow-sm tracking-wide uppercase">
                          Most Popular
                        </div>
                      )}

                      {/* Card Header */}
                      <div className="p-6 pb-2 pt-8">
                        <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                        <p className="text-sm text-slate-500 mt-1 min-h-[40px]">{plan.description}</p>
                        <div className="pt-4 flex items-baseline gap-1">
                          <span className="text-4xl font-extrabold text-slate-900">
                            {plan.price}
                          </span>
                          <span className="text-slate-400 font-medium">/filing</span>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-6 pt-0 flex-1 flex flex-col">
                        <ul className="space-y-3 mt-4 mb-8 flex-1">
                          {plan.features?.map((feature, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-slate-600 leading-snug">{feature}</span>
                            </li>
                          ))}
                        </ul>

                        {/* Button */}
                        <Link 
                          to={`/services/${service.id}`}
                          className={`w-full inline-flex items-center justify-center rounded-lg text-sm font-bold h-11 transition-all ${
                            plan.popular 
                              ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg" 
                              : "border border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
                          }`}
                        >
                          Choose {plan.name}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-10 bg-slate-100 rounded-lg text-slate-500">
                    No plans available for {service.title} at the moment.
                  </div>
                )}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ServicesPage;