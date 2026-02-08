import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, Mail, Lock, Eye, EyeOff, ArrowLeft, AlertCircle, LayoutDashboard } from "lucide-react";
import Axios from "../utils/axios";
import SummaryApi from "../common/SummerAPI";

const AdminLogin = () => {
  const [data, setData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value
    }));
    if (error) setError("");
  };
const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError("");

  try {
    const res = await Axios({
      url: SummaryApi.verifyUser.url,
      method: SummaryApi.verifyUser.method,
      data: data // Backend verifyUser sirf email aur password mangta hai
    });

    if (res.data.success) {
      // 1. Purana kachra saaf karein
      localStorage.removeItem("token");
      localStorage.removeItem("user_data");

      // 2. Naya Real Token save karein
      localStorage.setItem("token", res.data.token);
      
      // 3. Backend se aayi hui real info save karein
      localStorage.setItem("user_data", JSON.stringify(res.data.data));

      setIsLoading(false);
      navigate("/admin"); 
    }
  } catch (error) {
    console.error("Login Error:", error);
    setError(error.response?.data?.message || "Invalid Admin Credentials");
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans relative overflow-hidden">
      
      {/* --- Dark Theme Background for Admin --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        
        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-700/50">
          
          {/* Admin Header */}
          <div className="bg-slate-50 p-6 border-b border-slate-100 flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-slate-900 flex items-center justify-center shadow-lg mb-3">
               <ShieldCheck className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-bold text-2xl text-slate-900">Admin Portal</h3>
            <span className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full border border-blue-200">
                AUTHORIZED ACCESS ONLY
            </span>
          </div>

          {/* Card Content */}
          <div className="p-8">
            
            {/* Error Message */}
            {error && (
                <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2 text-red-600 text-sm font-medium animate-pulse">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Admin Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="admin@taxease.com"
                    value={data.email}
                    onChange={handleChange}
                    className="flex h-11 w-full rounded-lg border border-slate-300 bg-white px-3 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-700">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={data.password}
                    onChange={handleChange}
                    className="flex h-11 w-full rounded-lg border border-slate-300 bg-white px-3 pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button 
                type="submit" 
                disabled={isLoading}
               className="w-full inline-flex items-center justify-center rounded-lg bg-slate-900 text-white h-12 text-sm font-bold hover:bg-slate-800 transition-colors focus:ring-4 focus:ring-slate-200 disabled:opacity-70"
              >
                {isLoading ? (
                    <span className="flex items-center gap-2">
                        <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Verifying...
                    </span>
                ) : (
                    <span className="flex items-center gap-2">
                        <LayoutDashboard className="w-4 h-4" />
                        Access Dashboard
                    </span>
                )}
              </button>
            </form>

            {/* Back to Home */}
            <div className="mt-8 text-center pt-6 border-t border-slate-100">
                <Link 
                    to="/" 
                    className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors text-sm font-medium"
                >
                    <ArrowLeft className="w-3 h-3" />
                    Back to Main Site
                </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;