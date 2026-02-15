import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Clock, Award, CheckCircle } from "lucide-react";

const Hero = () => {
  const stats = [
    { label: "Happy Customers", value: "10,000+" },
    { label: "ITRs Filed", value: "50,000+" },
    { label: "Years Experience", value: "10+" },
  ];

  const features = [
    "100% Secure & Confidential",
    "Expert CA Assistance",
    "Quick Processing",
  ];

  return (
    <div className="relative w-full overflow-hidden bg-slate-50 font-sans">
      
      {/* --- Animations (Exact Replica of your custom classes) --- */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-fade-up { animation: fadeUp 0.8s ease-out forwards; }
        .text-gradient {
          background: linear-gradient(to right, #2563eb, #4f46e5);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>

      {/* --- Background Blobs (Exactly positioned as per your code) --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top Right Blob (primary/5) */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-600/5 rounded-full blur-3xl" />
        {/* Bottom Left Blob (accent/5) */}
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl" />
      </div>

      <section className="relative pt-24 pb-16 min-h-screen flex items-center">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* --- Left Content --- */}
            <div className="space-y-8 animate-fade-up">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-blue-600/10 text-blue-600 px-4 py-2 rounded-full text-sm font-medium">
                <Shield className="w-4 h-4" />
                <span>Trusted by 10,000+ Customers</span>
              </div>

              {/* Heading */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                Simplify Your{" "}
                <span className="text-gradient">
                  Tax Filing
                </span>{" "}
                & Compliance
              </h1>

              {/* Subheading */}
              <p className="text-lg md:text-xl text-slate-500 max-w-xl leading-relaxed">
                Expert tax services tailored for individuals and businesses in India. 
                From ITR filing to GST compliance, we've got you covered.
              </p>

              {/* Features List */}
              <div className="flex flex-wrap gap-4">
                {features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons (Styled exactly like shadcn Button size="xl") */}
              <div className="flex flex-wrap gap-4 pt-2">
                {/* Primary Button */}
                <Link 
                  to="/services" 
                  className="group inline-flex h-12 items-center justify-center rounded-md bg-blue-700 px-8 text-lg font-medium text-white shadow transition-colors hover:bg-blue-900/90"
                >
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                
                {/* Outline Button */}
                <Link 
                  to="/chat" 
                  className="inline-flex h-12 items-center justify-center rounded-md border border-slate-200 bg-white px-8 text-lg font-medium text-slate-900 shadow-sm transition-colors hover:bg-slate-100 hover:text-slate-900"
                >
                  Talk to Expert
                </Link>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-8 pt-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="space-y-1">
                    <p className="text-2xl md:text-3xl font-bold text-slate-900">
                      {stat.value}
                    </p>
                    <p className="text-sm text-slate-500">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* --- Right Visual (Hidden on mobile, Visible on LG) --- */}
            <div className="relative hidden lg:block px-6">
              <div className="relative animate-float">
                
                {/* Main Card (bg-card, rounded-2xl, shadow-xl) */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200 relative z-20">
                  
                  {/* Card Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">Tax Filing Made Easy</h3>
                      <p className="text-sm text-slate-500">Complete in 3 simple steps</p>
                    </div>
                  </div>

                  {/* Steps List */}
                  <div className="space-y-4">
                    {["Upload Documents", "Expert Review", "File & Done"].map((step, index) => (
                      <div key={step} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-600/10 text-blue-600 flex items-center justify-center text-sm font-semibold">
                          {index + 1}
                        </div>
                        <span className="text-slate-900 font-medium">{step}</span>
                        {/* Line Separator */}
                        {index < 2 && <div className="flex-1 h-px bg-slate-200" />}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Floating Badge (Average 2-3 Days) */}
                <div className="absolute -bottom-4 -right-4 bg-green-50 text-green-700 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-30 border border-green-100">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium text-sm">Average 2-3 Days</span>
                </div>

                {/* Decorative Blur behind card (accent/20) */}
                <div className="absolute -top-4 -left-4 w-20 h-20 bg-indigo-600/20 rounded-2xl blur-xl -z-10" />
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;