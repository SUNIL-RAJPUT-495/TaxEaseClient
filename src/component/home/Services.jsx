import React from "react";
import { Link } from "react-router-dom";
import { FileText, Calculator, Receipt, AlertCircle, ArrowRight } from "lucide-react";

const services = [
  {
    id: "itr-filing",
    title: "ITR Filing",
    description: "Hassle-free income tax return filing for salaried, business, and professionals with expert CA assistance.",
    icon: FileText,
    features: ["Salaried ITR", "Business ITR", "Capital Gains", "Foreign Income"],
    color: "bg-blue-500",
    startingPrice: "₹499",
  },
  {
    id: "tax-planning",
    title: "Tax Planning",
    description: "Strategic tax planning to maximize your savings and optimize your tax liability legally.",
    icon: Calculator,
    features: ["Section 80C/80D", "Investment Planning", "Tax Optimization", "Advance Tax"],
    color: "bg-emerald-500",
    startingPrice: "₹999",
  },
  {
    id: "gst",
    title: "GST Services",
    description: "Complete GST solutions including registration, return filing, and compliance management.",
    icon: Receipt,
    features: ["GST Registration", "Return Filing", "Invoice Generation", "Compliance"],
    color: "bg-violet-500",
    startingPrice: "₹799",
  },
  {
    id: "notice-handling",
    title: "Notice Handling",
    description: "Expert assistance for responding to income tax notices and handling assessments professionally.",
    icon: AlertCircle,
    features: ["Notice Response", "Assessment Help", "Appeal Filing", "Representation"],
    color: "bg-amber-500",
    startingPrice: "₹1,999",
  },
];

const Services = () => {
  return (
    <section className="py-20 bg-slate-50 font-sans">
      {/* Inline Styles for Animation (Taaki config file na chedni pade) */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up { animation: fadeUp 0.8s ease-out forwards; }
      `}</style>

      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-blue-600 font-bold text-sm uppercase tracking-wider">
            Our Services
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
            Complete Tax & Compliance Solutions
          </h2>
          <p className="text-slate-600 text-lg">
            From individual tax filing to complex business compliance, we provide 
            end-to-end solutions tailored to your needs.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div 
              key={service.id}
              className="group relative bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 overflow-hidden animate-fade-up flex flex-col"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              
              {/* Card Header Content */}
              <div className="p-6 pb-4">
                {/* Icon Box */}
                <div className={`w-12 h-12 rounded-xl ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                  <service.icon className="w-6 h-6 text-white" />
                </div>
                
                {/* Title */}
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
                  {service.title}
                </h3>
                
                {/* Description */}
                <p className="text-slate-500 text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>

              {/* Card Body Content */}
              <div className="p-6 pt-0 mt-auto space-y-4">
                {/* Feature List */}
                <ul className="space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Footer Section (Price & Link) */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 font-medium uppercase">Starting at</span>
                    <p className="font-bold text-lg text-slate-900">{service.startingPrice}</p>
                  </div>
                  
                  <Link 
                    to={`/services/${service.id}`}
                    className="group/btn flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-2 rounded-lg transition-all"
                  >
                    View Plans
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <Link 
            to="/services" 
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold transition-all shadow-lg hover:shadow-blue-500/30"
          >
            View All Services
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
};

export default Services;