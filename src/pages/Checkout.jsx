import React, { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, CreditCard, Loader2, Lock, FileText, AlertCircle } from "lucide-react";
import Axios from "../utils/axios";
import SummaryApi from "../common/SummerAPI";
import OrderStepper from "../component/OrderStepper"; 
import { toast } from 'react-hot-toast';

// Helper function (Razorpay removed as it's not needed for IMB)

const CheckoutHeader = () => (
  <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-50 flex items-center justify-between px-4 md:px-10 shadow-sm">
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white"><FileText size={20} strokeWidth={3} /></div>
      <span className="text-xl font-bold text-slate-900 tracking-tight">Tax<span className="text-blue-600">Ease</span></span>
    </div>
    <div className="flex items-center gap-2 text-green-700 bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
      <Lock size={14} /><span className="text-xs font-bold uppercase tracking-wide">Secure Checkout</span>
    </div>
  </header>
);

const Card = ({ children, className = "" }) => <div className={`rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm ${className}`}>{children}</div>;
const CardHeader = ({ children, className = "" }) => <div className={`flex flex-col space-y-1.5 p-6 border-b border-slate-100 ${className}`}>{children}</div>;
const CardContent = ({ children, className = "" }) => <div className={`p-6 ${className}`}>{children}</div>;
const Separator = () => <div className="shrink-0 bg-slate-100 h-[1px] w-full my-4" />;
const Input = ({ className = "", ...props }) => (<input className={`flex h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all ${className}`} {...props} />);
const Label = ({ children, htmlFor }) => (<label htmlFor={htmlFor} className="text-sm font-semibold text-slate-700 mb-1.5 block">{children}</label>);

const CheckoutPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const planId = searchParams.get("planId");

  const [planDetails, setPlanDetails] = useState(null);
  const [loadingPlan, setLoadingPlan] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", pan: "" });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
        try {
            const res = await Axios({ url: SummaryApi.userDetails.url, method: SummaryApi.userDetails.method });
            if(res.data.success){
                setFormData(prev => ({
                    ...prev,
                    name: res.data.data.name || "",
                    email: res.data.data.email || "",
                    phone: res.data.data.phone || ""
                }));
            }
        } catch (error) { console.log("Guest checkout"); }
    };

    const fetchSelectedPlan = async () => {
        if(!planId) { setLoadingPlan(false); return; }
        try {
            const res = await Axios({
                url: `${SummaryApi.getPlanDetails.url}?planId=${planId}`,
                method: SummaryApi.getPlanDetails.method
            });
            if(res.data.success) { setPlanDetails(res.data.data); }
        } catch (error) { console.error("Plan fetch error", error); } 
        finally { setLoadingPlan(false); }
    };

    fetchUserProfile();
    fetchSelectedPlan();
  }, [planId]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handlePayment = async () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.pan ) {
        return toast.error("Please fill all fields");
    }
    
    setIsProcessing(true);
    const toastId = toast.loading("Initializing secure payment...");

    const price = planDetails?.price || 0;
    const tax = Math.round(price * 0.18);
    const totalAmount = price + tax;

    try {
      const { data } = await Axios({
        url: SummaryApi.createOrder.url, 
        method: "POST", 
        data: { 
            ...formData, 
            service: planDetails?.category || "Service", 
            plan: planDetails?.planName || "Basic", 
            amount: totalAmount,
            planId: planId 
        }
      });

      console.log("Gateway Response:", data);

      if (data.success && (data.payment_url || data.redirect_url || data.url)) {
          const paymentLink = data.payment_url || data.redirect_url || data.url;
          toast.success("Redirecting to Payment Page...", { id: toastId });
          
          window.location.href = paymentLink;
      } 
      else if (data.success && data.message === "Order Created") {
          throw new Error("Backend is still sending Razorpay response. Please update your backend controller to send a payment URL.");
      }
      else {
          throw new Error(data.message || "Failed to initiate payment. No URL received.");
      }

    } catch (error) {
      console.error("Payment Handler Error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Something went wrong.";
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  };

  if (loadingPlan) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>;
  if (!planDetails) return <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4"><AlertCircle className="w-12 h-12 text-red-500 mb-4" /><h2 className="text-2xl font-bold text-slate-900">Plan Not Found</h2><Link to="/services" className="bg-blue-600 text-white px-6 py-2 rounded-lg mt-4">Browse Plans</Link></div>;

  const price = planDetails.price;
  const tax = Math.round(price * 0.18);
  const total = price + tax;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <CheckoutHeader />
      <OrderStepper currentStep={2} status="pending" />

      <main className="pt-36 pb-20 px-4 md:px-8"> 
        <div className="max-w-6xl mx-auto">
          
          <Link to="/services" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-6 font-medium text-sm">
            <ArrowLeft className="w-4 h-4" /> Return to Plans
          </Link>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* --- Form Section --- */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-slate-800">Customer Details</h2>
                    <p className="text-slate-500 text-sm">Invoice will be sent to this email.</p>
                </div>
                <div className="grid md:grid-cols-2 gap-5">
                    <div className="md:col-span-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" name="name" value={formData.name} onChange={handleChange} />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" value={formData.email} onChange={handleChange} />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="pan">PAN Number </Label>
                      <Input id="pan" name="pan" value={formData.pan} onChange={handleChange} className="uppercase" maxLength={10} />
                    </div>
                </div>
              </div>
            </div>

            {/* --- Right Column: Dynamic Order Summary --- */}
            <div className="lg:col-span-4">
              <div className="sticky top-40 space-y-4">
                <Card className="shadow-lg border-slate-200 overflow-hidden">
                    <div className="bg-blue-700 p-4 text-white">
                        <h3 className="text-sm font-bold uppercase tracking-wide opacity-90">Order Summary</h3>
                    </div>
                    
                    <CardContent className="space-y-4 pt-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="font-bold text-lg text-slate-900">{planDetails.category || "Service"}</h4> 
                            
                                <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 text-blue-700 tracking-wide">
                                    {planDetails.planName}
                                </span>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-lg text-slate-900">₹{price}</p>
                            </div>
                        </div>

                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <ul className="space-y-2">
                                {planDetails.features && planDetails.features.slice(0, 4).map((f, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs text-slate-600 font-medium">
                                    <Check className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" /> {f}
                                </li>
                                ))}
                            </ul>
                        </div>

                        <Separator />

                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between text-slate-500"><span>Base Price</span><span>₹{price}</span></div>
                            <div className="flex justify-between text-slate-500"><span>GST (18%)</span><span>₹{tax}</span></div>
                        </div>

                        <Separator />

                        <div className="flex justify-between items-center">
                            <span className="font-bold text-slate-800">Total Amount</span>
                            <span className="text-2xl font-black text-blue-600">₹{total}</span>
                        </div>
                    </CardContent>

                    <div className="p-4 bg-slate-50 border-t border-slate-100">
                        <button 
                            onClick={handlePayment} 
                            disabled={isProcessing}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-xl font-bold transition-all shadow-md shadow-blue-200 active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                            {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Make Payment <CreditCard className="w-4 h-4" /></>}
                        </button>
                    </div>
                </Card>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;