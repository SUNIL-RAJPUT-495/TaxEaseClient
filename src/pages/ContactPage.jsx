import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Loader2, 
  Send 
} from "lucide-react";
import { toast } from 'react-hot-toast';
import Navbar from "../component/layout/Navbar"; 
import SummaryApi from "../common/SummerAPI";
import Axios from "../utils/axios";

export const ContactPage = () => {
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    numbers: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function to handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Real API Submit Function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    

    try {
      // API call using Axios and your SummaryApi configuration
      const response = await Axios({
        url: SummaryApi.creatEinquiry.url,
        method: SummaryApi.creatEinquiry.method,
        data: formData // Sending the form data
      });

      // If successful
      if (response.data.success) {
        toast.success(response.data.message || 'Inquiry submitted successfully!');
        
        // Reset form
        setFormData({ name: "", email: "", numbers: "", message: "" });
      } else {
        // Handled by backend but success: false
        toast.error(response.data.message || 'Something went wrong.');
      }
    } catch (error) {
      console.error("Submission error:", error);
      // Fallback error from network or server crash
      toast.error(error?.response?.data?.message || 'Failed to submit. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
        
        {/* Top Hero Section */}
        <section className="bg-blue-600 py-16 mb-12 animate-fade-up">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4">
              Contact Us
            </h1>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Have questions or need assistance? Reach out to our expert team for quick, reliable, and professional support.
            </p>
          </div>
        </section>

        {/* Main Section: Get In Touch Text, and Form */}
        <section className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row gap-16">
          
          {/* Left Column: Title and Text */}
          <div className="flex-1 animate-fade-up" style={{ animationDelay: '100ms' }}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-950 mb-6">Get In Touch</h2>
            <div className="w-20 h-1 bg-slate-950 rounded mb-10"></div>
            
            <div className="space-y-6 text-lg text-slate-700 leading-relaxed">
              <p>
                We believe that open and clear communication is the foundation of great service. Whether you're exploring our offerings, need assistance with an ongoing matter, or simply want to connect, we're always here to help. Your questions and concerns matter to us, and we take pride in providing prompt, reliable, and professional support.
              </p>
              <p>
                Our Contact Us section makes it easy for you to reach out in the way that works best for you. You can contact us via email, phone, or by sending a quick message online. No matter how you choose to connect, our dedicated team is ready to listen, understand your needs, and provide clear guidance tailored to your situation.
              </p>
              <p>
                We value your time and ensure every inquiry is handled with care and transparency. From general questions to detailed consultations, we are committed to delivering solutions that help you move forward with confidence.
              </p>
              <p>
                If you’re unsure where to begin, don’t worry—just reach out. A simple message or call can start a meaningful conversation. We look forward to hearing from you and assisting you every step of the way.
              </p>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <form className="flex-1 bg-white p-10 rounded-xl shadow-lg border border-slate-100 space-y-8 animate-fade-up" style={{ animationDelay: '200ms' }} onSubmit={handleSubmit}>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900">Name <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-5 py-3.5 border border-slate-200 rounded-lg text-base placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 transition duration-150" 
                placeholder="Name"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900">Email <span className="text-red-500">*</span></label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-5 py-3.5 border border-slate-200 rounded-lg text-base placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 transition duration-150" 
                placeholder="Email"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900">Numbers</label>
              <input 
                type="tel" 
                name="numbers"
                value={formData.numbers}
                onChange={handleInputChange}
                className="w-full px-5 py-3.5 border border-slate-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-slate-300 transition duration-150" 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900">Comment or Message <span className="text-red-500">*</span></label>
              <textarea 
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                className="w-full h-40 px-5 py-4 border border-slate-200 rounded-lg text-base placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-slate-300 transition duration-150" 
                placeholder="Message"
              ></textarea>
            </div>
            
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white font-bold h-14 rounded-lg shadow-md hover:bg-blue-900 transition duration-150 disabled:bg-slate-500"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit
                </>
              )}
            </button>
          </form>
        </section>

        {/* Detailed Contact Information Block */}
        <section className="max-w-7xl mx-auto px-4 mt-24 mb-16 animate-fade-up" style={{ animationDelay: '300ms' }}>
          <div className="text-center">
            <p className="text-base text-slate-600 uppercase tracking-widest font-semibold">DETAILS</p>
            <h2 className="text-4xl font-extrabold text-slate-950 mt-2 mb-12">Contact Information</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10 text-center mt-12">
            
            {/* Company Mail Section */}
            <div className="bg-white p-10 rounded-xl shadow-lg border border-slate-100 flex flex-col items-center gap-6">
              <div className="w-20 h-20 rounded-full border border-slate-200 flex items-center justify-center bg-slate-50">
                <Mail className="w-9 h-9 text-slate-950" />
              </div>
              <p className="text-xl font-bold text-slate-900 mt-2">Company Mail</p>
              <p className="text-lg text-slate-700">info@myallbusinessconsultant.com</p>
            </div>
            
            {/* Phone Number Section */}
            <div className="bg-white p-10 rounded-xl shadow-lg border border-slate-100 flex flex-col items-center gap-6">
              <div className="w-20 h-20 rounded-full border border-slate-200 flex items-center justify-center bg-slate-50">
                <Phone className="w-9 h-9 text-slate-950" />
              </div>
              <p className="text-xl font-bold text-slate-900 mt-2">Office Phone Number</p>
              <p className="text-lg text-slate-700">+91 9799923625</p>
            </div>
            
            {/* Office Location Section */}
            <div className="bg-white p-10 rounded-xl shadow-lg border border-slate-100 flex flex-col items-center gap-6">
              <div className="w-20 h-20 rounded-full border border-slate-200 flex items-center justify-center bg-slate-50">
                <MapPin className="w-9 h-9 text-slate-950" />
              </div>
              <p className="text-xl font-bold text-slate-900 mt-2">Office Location</p>
              <p className="text-lg text-slate-700 leading-relaxed max-w-sm mx-auto">
                Flat – G01, Bharat Apartment, Shiv Shakti Vihar, Sanaganer, Jaipur – 302029
              </p>
            </div>

          </div>
        </section>

      </main>
    </div>
  );
};

export default ContactPage;