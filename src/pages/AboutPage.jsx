import React from 'react';
import { 
  Target, 
  Eye, 
  ShieldCheck, 
  Users, 
  Award, 
  Clock 
} from "lucide-react";
import Navbar from "../component/layout/Navbar"; 

export const AboutPage = () => {
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
        
        {/* Top Hero Section (Matching Services & Contact Page) */}
        <section className="bg-blue-600 py-16 mb-12 animate-fade-up">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4">
              About Us
            </h1>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
              India’s fastest growing destination for online legal, tax, and compliance services. Empowering businesses to grow with confidence.
            </p>
          </div>
        </section>

        {/* Who We Are Section */}
        <section className="bg-white border border-slate-100 rounded-xl max-w-7xl mx-auto px-6 py-12 mb-16 flex flex-col items-center gap-6 animate-fade-up" style={{ animationDelay: '100ms' }}>
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-950 mb-6">Who We Are</h2>
            <div className="w-20 h-1 bg-slate-950 rounded mx-auto mb-8"></div>
            <p className="text-lg text-slate-700 max-w-4xl mx-auto leading-relaxed">
              <strong>My All Business Consultant</strong> is India’s fastest growing destination for “Online Legal Services”. 
              We are dedicated to simplifying legal, tax, and compliance processes for entrepreneurs, startups, and established businesses across the country. Our goal is to remove the complexity from legal procedures so you can focus on what you do best—growing your business.
            </p>
          </div>
        </section>

        {/* Mission and Vision Section */}
        <section className="max-w-7xl mx-auto p-4 grid md:grid-cols-2 gap-10 mb-20">
          
          {/* Vision Card */}
          <div className="bg-white p-10 rounded-xl shadow-lg border border-slate-100 animate-fade-up" style={{ animationDelay: '200ms' }}>
            <div className="w-16 h-16 rounded-full border border-slate-200 flex items-center justify-center bg-slate-50 mb-6">
              <Eye className="w-8 h-8 text-slate-950" />
            </div>
            <h2 className="text-2xl font-bold text-slate-950 mb-4">Our Vision</h2>
            <p className="text-lg text-slate-700 leading-relaxed">
              We have the vision to build legal things simplified through automation and technology. We aim to be the most trusted legal and business consulting partner in India, empowering businesses with innovative and hassle-free compliance solutions.
            </p>
          </div>

          {/* Mission Card */}
          <div className="bg-white p-10 rounded-xl shadow-lg border border-slate-100 animate-fade-up" style={{ animationDelay: '300ms' }}>
            <div className="w-16 h-16 rounded-full border border-slate-200 flex items-center justify-center bg-slate-50 mb-6">
              <Target className="w-8 h-8 text-slate-950" />
            </div>
            <h2 className="text-2xl font-bold text-slate-950 mb-4">Our Mission</h2>
            <p className="text-lg text-slate-700 leading-relaxed">
              Our mission is to offer affordable, quick, and automated professional services to clients. We strive to provide transparent, high-quality, and ethical consulting that drives long-term success for every business we partner with.
            </p>
          </div>

        </section>

        {/* Core Values / Why Choose Us Section */}
        <section className="max-w-7xl mx-auto p-4 animate-fade-up" style={{ animationDelay: '400ms' }}>
          <div className="text-center mb-12">
            <p className="text-base text-slate-600 uppercase tracking-widest font-semibold">CORE VALUES</p>
            <h2 className="text-4xl font-extrabold text-slate-950 mt-2">Why Choose Us?</h2>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 text-center">
            
            {/* Value 1 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center gap-4 hover:shadow-md transition duration-300">
              <ShieldCheck className="w-10 h-10 text-slate-950" />
              <h3 className="text-xl font-bold text-slate-900">100% Secure</h3>
              <p className="text-slate-600 text-sm">Your data and documents are handled with the highest level of security and confidentiality.</p>
            </div>

            {/* Value 2 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center gap-4 hover:shadow-md transition duration-300">
              <Clock className="w-10 h-10 text-slate-950" />
              <h3 className="text-xl font-bold text-slate-900">Fast Processing</h3>
              <p className="text-slate-600 text-sm">We leverage automation to ensure your legal filings and registrations are done swiftly.</p>
            </div>

            {/* Value 3 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center gap-4 hover:shadow-md transition duration-300">
              <Users className="w-10 h-10 text-slate-950" />
              <h3 className="text-xl font-bold text-slate-900">Expert Team</h3>
              <p className="text-slate-600 text-sm">Backed by experienced CAs, CSs, and legal professionals ready to guide you.</p>
            </div>

            {/* Value 4 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center gap-4 hover:shadow-md transition duration-300">
              <Award className="w-10 h-10 text-slate-950" />
              <h3 className="text-xl font-bold text-slate-900">Affordable Pricing</h3>
              <p className="text-slate-600 text-sm">Premium business consulting services structured with transparent and fair pricing.</p>
            </div>

          </div>
        </section>

      </main>
    </div>
  );
};

export default AboutPage;