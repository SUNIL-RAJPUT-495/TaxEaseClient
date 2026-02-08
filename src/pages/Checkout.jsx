import React, { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, Check, CreditCard, Loader2 } from "lucide-react";
import Axios from "../utils/axios";
import SummaryApi from "../common/SummerAPI";

// --- Utility: Load Razorpay SDK ---
const loadRazorpayScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// --- UI Components ---
const Navbar = () => (
  <nav className="fixed top-0 w-full h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 z-50 flex items-center px-4">
    <div className="container mx-auto flex justify-between items-center">
      <div className="font-bold text-xl">TaxEase</div>
      <div className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
        <Link to="/">Home</Link>
        <Link to="/services">Services</Link>
      </div>
    </div>
  </nav>
);

const Footer = () => (
  <footer className="bg-slate-50 border-t border-slate-200 py-8 text-center text-slate-500 text-sm">
    <div className="container mx-auto">
      <p>© 2024 TaxEase. All rights reserved.</p>
    </div>
  </footer>
);

const Button = ({ children, className = "", disabled, ...props }) => (
  <button
    disabled={disabled}
    className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50 bg-slate-900 text-slate-50 hover:bg-slate-900/90 h-10 px-4 py-2 ${className}`}
    {...props}
  >
    {children}
  </button>
);

const Input = ({ className = "", ...props }) => (
  <input
    className={`flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 ${className}`}
    {...props}
  />
);

const Label = ({ children, htmlFor }) => (
  <label htmlFor={htmlFor} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
    {children}
  </label>
);

const Card = ({ children, className = "" }) => <div className={`rounded-lg border border-slate-200 bg-white text-slate-950 shadow-sm ${className}`}>{children}</div>;
const CardHeader = ({ children, className = "" }) => <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>{children}</div>;
const CardContent = ({ children, className = "" }) => <div className={`p-6 pt-0 ${className}`}>{children}</div>;
const Separator = () => <div className="shrink-0 bg-slate-200 h-[1px] w-full" />;

// --- Service Data ---
const serviceData = {
  "itr-filing": {
    title: "ITR Filing",
    plans: {
      basic: { name: "Basic", price: 499, features: ["Single Form 16", "Basic deductions", "Email support"] },
      standard: { name: "Standard", price: 999, features: ["Multiple Form 16", "All deductions", "Phone support"] },
      premium: { name: "Premium", price: 1999, features: ["All Standard features", "Business income", "Dedicated CA"] },
    },
  },
  "tax-planning": {
    title: "Tax Planning",
    plans: {
      basic: { name: "Basic", price: 999, features: ["Tax analysis", "80C optimization", "Email consultation"] },
      standard: { name: "Standard", price: 2499, features: ["Complete analysis", "All deductions", "Quarterly consults"] },
      premium: { name: "Premium", price: 4999, features: ["All Standard features", "Wealth structuring", "Monthly consults"] },
    },
  },
  gst: {
    title: "GST Services",
    plans: {
      basic: { name: "Basic", price: 799, features: ["GST Registration", "Monthly GSTR-3B", "Email support"] },
      standard: { name: "Standard", price: 1999, features: ["All Basic features", "Monthly GSTR-1", "Phone support"] },
      premium: { name: "Premium", price: 3999, features: ["All Standard features", "Annual return", "GST audit"] },
    },
  },
  "notice-handling": {
    title: "Notice Handling",
    plans: {
      basic: { name: "Basic", price: 1999, features: ["Notice analysis", "Response drafting", "Basic follow-up"] },
      standard: { name: "Standard", price: 4999, features: ["All Basic features", "Multiple submissions", "Hearing prep"] },
      premium: { name: "Premium", price: 9999, features: ["All Standard features", "Full representation", "Appeals"] },
    },
  },
};

const Checkout = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const serviceId = searchParams.get("service") || "itr-filing";
  const planId = searchParams.get("plan") || "basic";
  
  const service = serviceData[serviceId];
  const plan = service?.plans[planId];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    pan: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // --- Pre-fill Data ---
  useEffect(() => {
    const fetchUserProfile = async () => {
        try {
            const res = await Axios({
                url: SummaryApi.userDetails.url,
                method: SummaryApi.userDetails.method
            });
            if(res.data.success){
                setFormData(prev => ({
                    ...prev,
                    name: res.data.data.name || "",
                    email: res.data.data.email || "",
                    phone: res.data.data.phone || ""
                }));
            }
        } catch (error) {
            console.log("Guest checkout or error fetching profile");
        }
    };
    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ --- HANDLE PAYMENT LOGIC ---
  const handlePayment = async () => {
    if (!formData.name || !formData.email || !formData.phone) {
      alert("Missing Information: Please fill in all required fields.");
      return;
    }

    setIsProcessing(true);

    // 1. Load Razorpay Script
    const isScriptLoaded = await loadRazorpayScript("https://checkout.razorpay.com/v1/checkout.js");
    if (!isScriptLoaded) {
      alert("Razorpay SDK failed to load. Check your internet connection.");
      setIsProcessing(false);
      return;
    }

    const tax = Math.round(plan.price * 0.18);
    const totalAmount = plan.price + tax;

    try {
      // 2. Create Order on Backend
      const { data } = await Axios({
        url: SummaryApi.createOrder.url,
        method: SummaryApi.createOrder.method,
        data: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          pan: formData.pan,
          service: service.title,
          plan: plan.name,
          amount: totalAmount,
        }
      });

      console.log("Backend Response:", data); // Debugging

      if (!data.success) {
        throw new Error(data.message || "Could not create order");
      }

      // Check if Key ID exists
      if (!data.key_id) {
         console.error("Razorpay Key ID is missing from backend response");
         alert("Payment Error: Configuration missing. Please contact support.");
         setIsProcessing(false);
         return;
      }

      // 3. Initialize Razorpay Options
      const options = {
        key: data.key_id, // ✅ Dynamic Key from Backend
        // key: "rzp_test_XXXX", // ⚠️ Use this ONLY for temporary testing if backend key fails
        
        amount: data.order.amount,
        currency: "INR",
        name: "TaxEase",
        description: `Payment for ${service.title} - ${plan.name}`,
        
        // ✅ IMPORTANT: Using 'orderId' because your Mongoose Schema saves it as 'orderId'
        order_id: data.order.orderId, 
        
        handler: async function (response) {
          try {
            // 4. Verify Payment on Backend
            const verifyRes = await Axios({
              url: SummaryApi.verifyPayment.url,
              method: SummaryApi.verifyPayment.method,
              data: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }
            });

            if (verifyRes.data.success) {
              alert("Payment Successful! Redirecting...");
              navigate("/dashboard"); 
            } else {
              alert("Payment verification failed! Please contact support.");
            }
          } catch (error) {
            console.error(error);
            alert("Error verifying payment.");
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#0f172a", 
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response){
        alert(`Payment Failed: ${response.error.description}`);
      });
      rzp.open();

    } catch (error) {
      console.error("Payment Error:", error);
      alert("Payment initiation failed: " + (error.response?.data?.message || error.message));
    } finally {
      setIsProcessing(false);
    }
  };

  if (!service || !plan) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <main className="pt-24 pb-16 text-center">
            <h1 className="text-2xl font-bold">Service Not Found</h1>
            <Link to="/services"><Button className="mt-4">Browse Services</Button></Link>
        </main>
      </div>
    );
  }

  const tax = Math.round(plan.price * 0.18);
  const total = plan.price + tax;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <Link to="/services" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Services
          </Link>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Checkout</h1>
                <p className="text-slate-500">Complete your purchase to get started</p>
              </div>

              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Your Information</h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input id="name" name="name" placeholder="Enter full name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input id="email" name="email" type="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone *</Label>
                      <Input id="phone" name="phone" type="tel" placeholder="+91..." value={formData.phone} onChange={handleChange} required />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="pan">PAN Number (Optional)</Label>
                      <Input id="pan" name="pan" placeholder="ABCDE1234F" value={formData.pan} onChange={handleChange} className="uppercase" maxLength={10} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                <Shield className="w-5 h-5 text-green-600 flex-shrink-0" />
                <p className="text-sm text-slate-600">Your payment is secured with 256-bit SSL encryption.</p>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <h3 className="text-lg font-semibold">Order Summary</h3>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 bg-slate-100/50 rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-slate-900">{service.title}</h3>
                        <p className="text-sm text-slate-500">{plan.name} Plan</p>
                      </div>
                      <p className="font-bold text-slate-900">₹{plan.price}</p>
                    </div>
                    <ul className="space-y-2">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm text-slate-500">
                          <Check className="w-4 h-4 text-green-600" /> {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm"><span className="text-slate-500">Subtotal</span><span>₹{plan.price}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-slate-500">GST (18%)</span><span>₹{tax}</span></div>
                    <Separator />
                    <div className="flex justify-between font-semibold"><span className="text-slate-900">Total</span><span className="text-xl">₹{total}</span></div>
                  </div>

                  <Button size="lg" className="w-full h-12 text-base" onClick={handlePayment} disabled={isProcessing}>
                    {isProcessing ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</>
                    ) : (
                      <><CreditCard className="w-4 h-4 mr-2" /> Pay ₹{total}</>
                    )}
                  </Button>

                  <p className="text-xs text-center text-slate-500">By proceeding, you agree to our Terms of Service.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;