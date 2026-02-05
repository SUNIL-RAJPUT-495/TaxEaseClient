import React, { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, Check, CreditCard, Menu, X } from "lucide-react";

// --- MOCK LAYOUT COMPONENTS (To ensure code runs without errors) ---
const Navbar = () => (
  <nav className="fixed top-0 w-full h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 z-50 flex items-center px-4">
    <div className="container mx-auto flex justify-between items-center">
      <div className="font-bold text-xl">TaxEase</div>
      <div className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
        <Link to="/">Home</Link>
        <Link to="/services">Services</Link>
        <Link to="/about">About</Link>
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

// --- REUSABLE UI COMPONENTS (Recreated to match Shadcn UI styles) ---

const Button = ({ children, className = "", variant = "default", size = "default", asChild, ...props }) => {
  const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    default: "bg-slate-900 text-slate-50 hover:bg-slate-900/90",
    destructive: "bg-red-500 text-slate-50 hover:bg-red-500/90",
    outline: "border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900",
    ghost: "hover:bg-slate-100 hover:text-slate-900",
    link: "text-slate-900 underline-offset-4 hover:underline",
  };

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  };

  const Comp = asChild ? React.Fragment : "button";
  return (
    <Comp className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </Comp>
  );
};

const Input = React.forwardRef(({ className = "", type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={`flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

const Label = React.forwardRef(({ className = "", ...props }, ref) => (
  <label
    ref={ref}
    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
    {...props}
  />
));
Label.displayName = "Label";

const Card = React.forwardRef(({ className = "", ...props }, ref) => (
  <div ref={ref} className={`rounded-lg border border-slate-200 bg-white text-slate-950 shadow-sm ${className}`} {...props} />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef(({ className = "", ...props }, ref) => (
  <div ref={ref} className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props} />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef(({ className = "", ...props }, ref) => (
  <h3 ref={ref} className={`text-2xl font-semibold leading-none tracking-tight ${className}`} {...props} />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef(({ className = "", ...props }, ref) => (
  <p ref={ref} className={`text-sm text-slate-500 ${className}`} {...props} />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef(({ className = "", ...props }, ref) => (
  <div ref={ref} className={`p-6 pt-0 ${className}`} {...props} />
));
CardContent.displayName = "CardContent";

const Separator = React.forwardRef(({ className = "", orientation = "horizontal", ...props }, ref) => (
  <div
    ref={ref}
    className={`shrink-0 bg-slate-200 ${orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]"} ${className}`}
    {...props}
  />
));
Separator.displayName = "Separator";


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
  // NOTE: Replaced useToast with standard alert for standalone functionality
  
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePayment = async () => {
    if (!formData.name || !formData.email || !formData.phone) {
      alert("Missing Information: Please fill in all required fields.");
      return;
    }

    setIsProcessing(true);

    // Simulate Razorpay payment
    setTimeout(() => {
      setIsProcessing(false);
      alert("Payment Successful! Your order has been placed. Redirecting to dashboard...");
      navigate("/dashboard");
    }, 2000);
  };

  if (!service || !plan) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold text-slate-900 mb-4">Service Not Found</h1>
            <Link to="/services">
              <Button>Browse Services</Button>
            </Link>
          </div>
        </main>
        <Footer />
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
          {/* Back Button */}
          <Link 
            to="/services" 
            className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Services
          </Link>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Checkout Form */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Checkout</h1>
                <p className="text-slate-500">Complete your purchase to get started</p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Your Information</CardTitle>
                  <CardDescription>We'll use this to process your order</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="pan">PAN Number (Optional)</Label>
                      <Input
                        id="pan"
                        name="pan"
                        placeholder="ABCDE1234F"
                        value={formData.pan}
                        onChange={handleChange}
                        className="uppercase"
                        maxLength={10}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Security Note */}
              <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                <Shield className="w-5 h-5 text-green-600 flex-shrink-0" />
                <p className="text-sm text-slate-600">
                  Your payment is secured with 256-bit SSL encryption. We never store your card details.
                </p>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="text-lg">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Selected Plan */}
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
                          <Check className="w-4 h-4 text-green-600" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Separator />

                  {/* Price Breakdown */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Subtotal</span>
                      <span className="text-slate-900">₹{plan.price}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">GST (18%)</span>
                      <span className="text-slate-900">₹{tax}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span className="text-slate-900">Total</span>
                      <span className="text-slate-900 text-xl">₹{total}</span>
                    </div>
                  </div>

                  {/* Pay Button */}
                  <Button 
                    size="lg" 
                    className="w-full"
                    onClick={handlePayment}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      "Processing..."
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4 mr-2" />
                        Pay ₹{total}
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-center text-slate-500">
                    By proceeding, you agree to our Terms of Service and Privacy Policy
                  </p>
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