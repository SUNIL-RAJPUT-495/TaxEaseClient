import React from "react";
import { Shield, Clock, HeadphonesIcon, FileCheck, Users, IndianRupee } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "100% Data Secure",
    description: "Your financial data is encrypted and protected with bank-grade security protocols.",
  },
  {
    icon: Clock,
    title: "Quick Processing",
    description: "Most returns are filed within 2-3 working days with our streamlined process.",
  },
  {
    icon: HeadphonesIcon,
    title: "Expert Support",
    description: "Get assistance from qualified CAs and tax experts whenever you need help.",
  },
  {
    icon: FileCheck,
    title: "Error-Free Filing",
    description: "Multi-level verification ensures accurate and compliant tax filings every time.",
  },
  {
    icon: Users,
    title: "Dedicated Manager",
    description: "Premium plans include a dedicated relationship manager for personalized service.",
  },
  {
    icon: IndianRupee,
    title: "Affordable Pricing",
    description: "Transparent pricing with no hidden charges. Pay only for what you need.",
  },
];

const Features = () => {
  return (
    <section className="py-20 bg-slate-50 font-sans">
      
      {/* Inline Styles for Animation */}
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
            Why Choose Us
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
            Trusted by Thousands Across India
          </h2>
          <p className="text-slate-600 text-lg">
            We combine technology with expertise to deliver the best tax filing experience.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="flex gap-4 p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Icon Box */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              
              {/* Text Content */}
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
};

export default Features;