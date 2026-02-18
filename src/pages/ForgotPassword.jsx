import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Phone, Mail, ShieldAlert, MessageCircle } from "lucide-react";

const ForgotPassword = () => {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-8 text-center animate-fade-up">

                {/* Icon & Heading */}
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center border-4 border-blue-100">
                        <ShieldAlert className="w-10 h-10 text-blue-600" />
                    </div>
                </div>

                <h1 className="text-2xl font-extrabold text-slate-900 mb-2">
                    Forgot Password?
                </h1>

                <p className="text-slate-500 mb-8 leading-relaxed text-sm">
                    For security reasons, the automatic password reset functionality is currently restricted. Please contact our <b>Administrator</b> to verify your identity and reset your credentials.
                </p>

                {/* Contact Options */}
                <div className="space-y-4 mb-8">


                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-indigo-300 transition-colors">
                        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-200">
                            <Mail size={20} />
                        </div>
                        <div className="text-left">
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Email Admin</p>
                            <p className="text-sm font-bold text-slate-900">admin@taxease.com</p>
                        </div>
                    </div>
                </div>

                {/* Back to Login */}
                <Link
                    to="/login"
                    className="inline-flex items-center gap-2 text-blue-600 font-bold text-sm hover:gap-3 transition-all"
                >
                    <ArrowLeft size={16} />
                    Back to Login
                </Link>
            </div>

            
        </div>
    );
};

export default ForgotPassword;