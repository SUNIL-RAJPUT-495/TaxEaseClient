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
    <div className="relative w-full">
      {/* --- Inline Styles for Custom Animations (Config na chedhne ke liye) --- */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-fade-up { animation: fadeUp 0.8s ease-out forwards; }
      `}</style>

      <section className="relative min-h-screen bg-slate-50 pt-24 pb-16 overflow-hidden font-sans">
        
        {/* Background Blobs (Tailwind Classes) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-8rem)]">
            
            {/* --- LEFT SIDE: CONTENT --- */}
            <div className="space-y-8 animate-fade-up">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold border border-blue-200">
                <Shield className="w-4 h-4" />
                <span>Trusted by 10,000+ Customers</span>
              </div>

              {/* Heading */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight">
                Simplify Your{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                  Tax Filing
                </span>{" "}
                & Compliance
              </h1>

              {/* Subheading */}
              <p className="text-lg md:text-xl text-slate-600 max-w-xl leading-relaxed">
                Expert tax services tailored for individuals and businesses in India. 
                From ITR filing to GST compliance, we've got you covered.
              </p>

              {/* Features List */}
              <div className="flex flex-wrap gap-4">
                {features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons (Pure Tailwind) */}
              <div className="flex flex-wrap gap-4">
                <Link 
                  to="/services" 
                  className="group bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-bold text-lg inline-flex items-center gap-2 transition-all shadow-lg hover:shadow-blue-500/25"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <Link 
                  to="/contact" 
                  className="border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 px-8 py-4 rounded-lg font-bold text-lg inline-flex items-center gap-2 transition-all"
                >
                  Talk to Expert
                </Link>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-8 pt-4 border-t border-slate-200 mt-8">
                {stats.map((stat) => (
                  <div key={stat.label} className="space-y-1">
                    <p className="text-2xl md:text-3xl font-bold text-slate-900">
                      {stat.value}
                    </p>
                    <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* --- RIGHT SIDE: VISUAL CARD --- */}
            <div className="relative hidden lg:block">
              <div className="relative animate-float">
                
                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-8 border border-slate-100">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Tax Filing Made Easy</h3>
                      <p className="text-sm text-slate-500">Complete in 3 simple steps</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {["Upload Documents", "Expert Review", "File & Done"].map((step, index) => (
                      <div key={step} className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold border border-blue-200">
                          {index + 1}
                        </div>
                        <span className="text-slate-700 font-semibold text-lg">{step}</span>
                        {index < 2 && <div className="flex-1 h-px bg-slate-100" />}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Floating Badge */}
                <div className="absolute -bottom-6 -right-6 bg-green-50 text-green-700 px-6 py-3 rounded-xl shadow-lg border border-green-100 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span className="font-bold text-sm">Average 2-3 Days</span>
                </div>

                {/* Decorative Blur behind card */}
                <div className="absolute -top-4 -left-4 w-20 h-20 bg-blue-500/20 rounded-2xl blur-xl -z-10" />
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;