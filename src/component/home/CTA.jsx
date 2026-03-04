import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Phone } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-20 bg-slate-100 relative overflow-hidden font-sans border-t border-slate-200">
      
      {/* --- Background Decorative Blobs (Soft Light Colors) --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top Left Blob */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        {/* Bottom Right Blob */}
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          
          {/* Heading */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-950 leading-tight">
            Ready to Simplify Your Tax & Compliance?
          </h2>
          
          {/* Subheading */}
          <p className="text-lg md:text-xl text-slate-700 max-w-2xl mx-auto leading-relaxed">
            Join thousands of satisfied businesses who trust My All Business Consultant. 
            Get started today with a free consultation.
          </p>
          
          {/* Buttons Section */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            
            {/* 1. Primary Blue Button (Start Free Consultation) */}
            <Link 
              to="/signup" 
              className="group inline-flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 px-8 py-4 rounded-lg font-bold text-lg transition-all shadow-md hover:shadow-lg"
            >
              Start Free Consultation
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            {/* 2. White Card Button (Call Us Now) */}
            <a 
              href="tel:+919799923625" 
              className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 px-8 py-4 rounded-lg font-bold text-lg transition-all shadow-sm"
            >
              <Phone className="w-5 h-5 text-blue-600" />
              Call Us Now
            </a>
          </div>

          {/* Footer Text */}
          <p className="text-slate-500 text-sm font-medium">
            Expert consultation • Fast processing • 100% Secure
          </p>

        </div>
      </div>
    </section>
  );
};

export default CTA;