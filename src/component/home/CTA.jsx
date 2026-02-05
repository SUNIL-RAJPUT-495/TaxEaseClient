import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Phone } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-20 bg-blue-600 relative overflow-hidden font-sans">
      
      {/* --- Background Decorative Blobs --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top Left Blob */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        {/* Bottom Right Blob */}
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          
          {/* Heading */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
            Ready to Simplify Your Tax Filing?
          </h2>
          
          {/* Subheading */}
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Join 10,000+ satisfied customers who trust TaxEase for their tax and compliance needs. 
            Get started today with a free consultation.
          </p>
          
          {/* Buttons Section */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            
            {/* 1. White Button (Start Free Consultation) */}
            <Link 
              to="/signup" 
              className="group inline-flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-lg font-bold text-lg transition-all shadow-lg hover:shadow-xl"
            >
              Start Free Consultation
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            {/* 2. Transparent Outline Button (Call Us Now) */}
            <a 
              href="tel:+919876543210" 
              className="inline-flex items-center gap-2 border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-lg font-bold text-lg transition-all backdrop-blur-sm"
            >
              <Phone className="w-5 h-5" />
              Call Us Now
            </a>
          </div>

          {/* Footer Text */}
          <p className="text-blue-200 text-sm font-medium">
            No credit card required • Free expert consultation • Cancel anytime
          </p>

        </div>
      </div>
    </section>
  );
};

export default CTA;