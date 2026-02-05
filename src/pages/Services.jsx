import React from "react";
import { Link } from "react-router-dom";
import { 
  FileText, 
  Calculator, 
  Receipt, 
  AlertCircle, 
  ArrowRight, 
  Check 
} from "lucide-react";
import Navbar from "../component/layout/Navbar"; 

const services = [
  {
    id: "itr-filing",
    title: "ITR Filing",
    description: "Hassle-free income tax return filing for salaried individuals, businesses, and professionals with expert CA assistance.",
    icon: FileText,
    color: "bg-blue-500",
    plans: [
      {
        name: "Basic",
        price: "₹499",
        description: "For salaried individuals with simple tax needs",
        features: ["Single Form 16 processing", "Basic deductions (80C, 80D)", "Email support", "E-filing with ITR-1", "Acknowledgment copy"],
      },
      {
        name: "Standard",
        price: "₹999",
        popular: true,
        description: "For professionals and multiple income sources",
        features: ["Multiple Form 16 processing", "All deductions & exemptions", "Capital gains handling", "ITR-1, ITR-2, ITR-3", "Phone & email support", "Tax saving suggestions"],
      },
      {
        name: "Premium",
        price: "₹1,999",
        description: "For businesses and complex tax situations",
        features: ["All Standard features", "Business income (ITR-3, ITR-4)", "Foreign income & assets", "Dedicated CA support", "Priority processing", "Year-round tax advice"],
      },
    ],
  },
  {
    id: "tax-planning",
    title: "Tax Planning",
    description: "Strategic tax planning to maximize your savings and optimize your tax liability legally.",
    icon: Calculator,
    color: "bg-emerald-500",
    plans: [
      {
        name: "Basic",
        price: "₹999",
        description: "For individuals starting tax planning",
        features: ["Tax liability analysis", "Section 80C optimization", "Basic investment advice", "Email consultation", "Annual review"],
      },
      {
        name: "Standard",
        price: "₹2,499",
        popular: true,
        description: "Comprehensive planning for professionals",
        features: ["Complete tax analysis", "All deduction optimization", "Investment portfolio review", "Quarterly consultations", "Advance tax planning", "HRA & LTA optimization"],
      },
      {
        name: "Premium",
        price: "₹4,999",
        description: "End-to-end tax strategy for HNIs",
        features: ["All Standard features", "Wealth structuring advice", "Estate planning basics", "Monthly consultations", "Business tax planning", "Dedicated relationship manager"],
      },
    ],
  },
  {
    id: "gst",
    title: "GST Services",
    description: "Complete GST solutions including registration, return filing, and compliance management.",
    icon: Receipt,
    color: "bg-violet-500",
    plans: [
      {
        name: "Basic",
        price: "₹799",
        description: "For small businesses with low turnover",
        features: ["GST Registration", "Monthly GSTR-3B filing", "Quarterly GSTR-1 filing", "Basic compliance support", "Email support"],
      },
      {
        name: "Standard",
        price: "₹1,999",
        popular: true,
        description: "For growing businesses",
        features: ["All Basic features", "Monthly GSTR-1 filing", "Input tax credit optimization", "E-way bill assistance", "Phone support", "Compliance calendar"],
      },
      {
        name: "Premium",
        price: "₹3,999",
        description: "For large businesses & exporters",
        features: ["All Standard features", "GSTR-9 annual return", "GST audit assistance", "Refund processing", "Dedicated GST expert", "Priority support"],
      },
    ],
  },
  {
    id: "notice-handling",
    title: "Notice Handling",
    description: "Expert assistance for responding to income tax notices and handling assessments professionally.",
    icon: AlertCircle,
    color: "bg-amber-500",
    plans: [
      {
        name: "Basic",
        price: "₹1,999",
        description: "For simple notice responses",
        features: ["Notice analysis", "Response drafting", "Document preparation", "Email submission support", "Basic follow-up"],
      },
      {
        name: "Standard",
        price: "₹4,999",
        popular: true,
        description: "For complex notices & scrutiny",
        features: ["All Basic features", "Detailed case analysis", "Multiple submissions", "Department correspondence", "Phone consultation", "Hearing preparation"],
      },
      {
        name: "Premium",
        price: "₹9,999",
        description: "Full representation & appeals",
        features: ["All Standard features", "In-person representation", "Appeal preparation", "CIT Appeals handling", "Dedicated CA manager", "Unlimited consultations"],
      },
    ],
  },
];

const ServicesPage = () => {
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
                {service.plans.map((plan, planIndex) => (
                  <div 
                    key={plan.name}
                    className={`relative flex flex-col bg-white rounded-xl transition-all duration-300 animate-fade-up overflow-hidden ${
                      plan.popular 
                        ? "border-2 border-blue-600 shadow-xl scale-[1.02] z-10" 
                        : "border border-slate-200 hover:border-blue-300 hover:shadow-lg"
                    }`}
                    style={{ animationDelay: `${planIndex * 100}ms` }}
                  >
                    
                    {/* Most Popular Badge */}
                    {plan.popular && (
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
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-slate-600 leading-snug">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Button */}
                      <Link 
                        to={`/checkout?service=${service.id}&plan=${plan.name.toLowerCase()}`}
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
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>

    </div>
  );
};

export default ServicesPage;