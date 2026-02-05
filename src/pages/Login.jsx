import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FileText, Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import Axios from "../utils/axios"
import  SummaryApi  from "../common/SummerAPI";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

     try {
      const res = await Axios({
        url:SummaryApi.verifyUser.url,
        method:SummaryApi.verifyUser.method,
        data:{email,password}
      });
      console.log(res.data);
    } catch (error) {
      console.error("Signup Error:", error);
      alert("Signup Failed: " + (error.response?.data?.message || error.message));
      return;

      }
    setTimeout(() => {
      setIsLoading(false);
      alert("Login Successful! Redirecting...");
      
      if (email.includes("admin")) {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans relative overflow-hidden">
      
      
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up { animation: fadeUp 0.8s ease-out forwards; }
      `}</style>

      {/* --- Background Decorative Elements --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-cyan-400/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Back Button */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Main Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xl animate-fade-up overflow-hidden">
          
          {/* Card Header */}
          <div className="flex flex-col space-y-1.5 p-6 pb-2 text-center">
            <Link to="/" className="flex items-center justify-center gap-2 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-md">
                <FileText className="w-6 h-6 text-white" />
              </div>
            </Link>
            <h3 className="font-bold text-2xl text-slate-900 leading-none tracking-tight">Welcome Back</h3>
            <p className="text-sm text-slate-500 mt-2">Sign in to your TaxEase account</p>
          </div>

          {/* Card Content */}
          <div className="p-6 pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Email Input */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium leading-none text-slate-900">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 pl-10 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium leading-none text-slate-900">
                    Password
                  </label>
                  <Link 
                    to="/forgot-password" 
                    className="text-sm text-blue-600 hover:underline font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 pl-10 pr-10 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900 focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={isLoading}
                className="inline-flex items-center justify-center rounded-md text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-slate-900 text-white hover:bg-slate-800 h-11 px-8 w-full shadow-sm"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-500">
                Don't have an account?{" "}
                <Link to="/signup" className="text-blue-600 font-semibold hover:underline">
                  Create one
                </Link>
              </p>
            </div>

            {/* Demo Note */}
            <div className="mt-6 p-3 bg-slate-100 rounded-lg text-center border border-slate-200">
              <p className="text-xs text-slate-500 font-medium">
                Demo: Use any email with "admin" to access admin dashboard
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;