import React from "react";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Priya Sharma",
    role: "IT Professional, Bangalore",
    content: "TaxEase made my ITR filing so simple! The expert guidance helped me claim deductions I didn't even know about. Saved ₹25,000 in taxes!",
    rating: 5,
  },
  {
    name: "Rajesh Kumar",
    role: "Business Owner, Mumbai",
    content: "Been using their GST services for 2 years now. Timely filings, no compliance issues, and great support. Highly recommended for businesses!",
    rating: 5,
  },
  {
    name: "Anita Patel",
    role: "Freelancer, Delhi",
    content: "As a freelancer, taxes were always confusing. TaxEase simplified everything and their tax planning advice was invaluable. 5 stars!",
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section className="py-20 bg-white font-sans">
      
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
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
            What Our Customers Say
          </h2>
          <p className="text-slate-600 text-lg">
            Don't just take our word for it. Here's what our satisfied customers have to say.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.name}
              className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 animate-fade-up flex flex-col"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="space-y-4 flex-1">
                {/* Stars */}
                <div className="flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-slate-600 leading-relaxed italic">
                  "{testimonial.content}"
                </p>
              </div>

              {/* Author Section */}
              <div className="pt-4 mt-6 border-t border-slate-200">
                <p className="font-bold text-slate-900">{testimonial.name}</p>
                <p className="text-sm text-slate-500">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Testimonials;