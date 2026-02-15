import React, { useState, useEffect } from "react";
import { 
  Clock, FileCheck, Download, CheckCircle, XCircle, 
  AlertCircle, Loader2, ShieldCheck, MessageCircle, ArrowLeft, Lock 
} from "lucide-react";
import { useNavigate } from "react-router-dom"; 
import Axios from "../utils/axios";
import SummaryApi from "../common/SummerAPI";
import OrderStepper from "../component/OrderStepper";

const FileStatusPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [fileData, setFileData] = useState(null);
  const [userDecision, setUserDecision] = useState(null);

  useEffect(() => {
    const checkFileStatus = async () => {
      try {
        const res = await Axios({
          url: SummaryApi.getFinalFileStatus.url,
          method: SummaryApi.getFinalFileStatus.method
        });
        if (res.data.success) {
          setFileData(res.data.data);
        }
      } catch (error) {
        console.error("Status fetch error", error);
      } finally {
        setLoading(false);
      }
    };
    checkFileStatus();
  }, []);

  const handleDecision = async (decision) => {
    const reason = decision === "rejected" ? prompt("Please enter reason for rejection:") : "";
    if (decision === "rejected" && !reason) return;

    try {
      setUserDecision(decision);
      await Axios({
        url: SummaryApi.updateFileDecision.url,
        method: SummaryApi.updateFileDecision.method,
        data: { decision, reason }
      });
      alert(`File ${decision === 'approved' ? 'Accepted' : 'Rejected'} successfully!`);
    } catch (error) {
      alert("Failed to update decision.");
    }
  };

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-blue-600 w-12 h-12" />
        <p className="text-slate-500 font-bold animate-pulse uppercase tracking-widest text-xs">Authenticating Status...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      
      {/* --- 1. Top Mini-Navbar (Fixed) --- */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-[60] flex items-center justify-between px-6 md:px-12">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-600">
            <ArrowLeft size={20} />
          </button>
          <div className="h-6 w-[1px] bg-slate-200 mx-2 hidden md:block"></div>
          <h1 className="text-lg font-bold text-slate-800">Final Approval</h1>
        </div>
        <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
          <Lock size={14} /><span className="text-[10px] font-black uppercase tracking-wider italic">Secure Review</span>
        </div>
      </header>

      {/* --- 2. Order Stepper (Fixed just below Navbar) --- */}
      <div className="fixed top-16 left-0 right-0 z-50 bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto">
          {/* Step 5 active for Decision/Approval */}
          <OrderStepper currentStep={5} status={userDecision === 'rejected' ? 'rejected' : 'pending'}/>
        </div>
      </div>

      {/* --- 3. Main Content Area --- */}
      <main className="max-w-4xl mx-auto px-4 pt-48 pb-32">
        
        {/* Page Heading */}
        <div className="mb-10 text-center md:text-left">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Filing Decision</h2>
          <p className="text-slate-500 mt-2">Track your ITR progress and approve the final submission draft.</p>
        </div>

        <div className="relative">
          {/* CASE 1: Under Process */}
          {!fileData ? (
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 md:p-16 text-center shadow-xl shadow-blue-900/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-blue-50 rounded-full blur-3xl opacity-50" />
              
              <div className="w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8 rotate-12 shadow-lg shadow-blue-200">
                <Clock className="w-12 h-12 text-white -rotate-12 animate-pulse" />
              </div>

              <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-4">Under Expert Review</h2>
              <p className="text-slate-500 max-w-lg mx-auto leading-relaxed text-lg">
                Thank you for submitting your documents. Your tax file is now being drafted by our expert team. Please allow us <strong>24-48 hours</strong> to complete the process.
              </p>

              <div className="mt-10 grid grid-cols-3 gap-2 md:gap-4 border-t border-slate-100 pt-10">
                <div className="p-2 md:p-4 opacity-50">
                  <p className="font-bold text-slate-900 text-xs md:text-sm">Review</p>
                </div>
                <div className="p-2 md:p-4 bg-blue-50 rounded-2xl border border-blue-100 scale-105 shadow-sm">
                  <p className="font-bold text-blue-600 text-xs md:text-sm">Drafting</p>
                </div>
                <div className="p-2 md:p-4 opacity-50">
                  <p className="font-bold text-slate-900 text-xs md:text-sm">Approval</p>
                </div>
              </div>
            </div>
          ) : (
            /* CASE 2: Final File Ready */
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
              <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-slate-200/50">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8 pb-8 border-b border-slate-100">
                  <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-200 shrink-0">
                    <FileCheck size={32} />
                  </div>
                  <div className="text-center md:text-left">
                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">ITR Draft Ready</h2>
                    <p className="text-slate-500 mt-1 font-medium">Download and verify the details before we file it.</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-slate-50 to-white rounded-3xl p-6 border border-slate-200 flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
                  <div className="flex items-center gap-4 text-left w-full">
                    <div className="bg-red-500 text-white px-3 py-2 rounded-xl font-black text-[10px]">PDF</div>
                    <div className="truncate">
                      <p className="font-bold text-slate-800 text-sm md:text-base truncate">{fileData.fileName || "Final_Tax_Draft.pdf"}</p>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1 uppercase font-black tracking-tighter">
                        <ShieldCheck size={12} className="text-green-500" /> Secure Document
                      </p>
                    </div>
                  </div>
                  <a href={fileData.fileUrl} target="_blank" rel="noreferrer" 
                     className="w-full md:w-auto flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl hover:bg-black transition-all shadow-xl active:scale-95">
                    <Download size={18} /> DOWNLOAD
                  </a>
                </div>

                {!userDecision ? (
                  <div className="flex flex-col md:grid md:grid-cols-2 gap-4">
                    <button onClick={() => handleDecision("rejected")} 
                            className="flex items-center justify-center gap-2 py-5 rounded-2xl border-2 border-slate-100 text-slate-400 font-black hover:text-red-600 hover:border-red-100 hover:bg-red-50 transition-all uppercase text-xs tracking-widest">
                      <XCircle size={18} /> I see errors
                    </button>
                    <button onClick={() => handleDecision("approved")} 
                            className="flex items-center justify-center gap-2 py-5 rounded-2xl bg-blue-600 text-white font-black hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all scale-100 active:scale-95 uppercase text-xs tracking-widest">
                      <CheckCircle size={18} /> Approve Filing
                    </button>
                  </div>
                ) : (
                  <div className={`p-8 rounded-[2rem] flex flex-col items-center gap-4 text-center border-2 ${
                    userDecision === 'approved' ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'
                  }`}>
                    {userDecision === 'approved' ? <CheckCircle size={48} className="text-green-500" /> : <AlertCircle size={48} className="text-red-500" />}
                    <div>
                      <h3 className={`font-black text-xl italic ${userDecision === 'approved' ? 'text-green-800' : 'text-red-800'}`}>
                        {userDecision.toUpperCase()}
                      </h3>
                      <p className="text-sm text-slate-500 font-medium">Your response has been sent to our team.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Link */}
        <div className="mt-12 text-center">
            <button 
              onClick={() => navigate("/upload-documents")}
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors bg-white px-5 py-2.5 rounded-full border border-slate-200 shadow-sm"
            >
                <AlertCircle size={14} /> Incorrect documents? Re-upload here
            </button>
        </div>
      </main>

      {/* --- FLOATING CHAT SUPPORT --- */}
      <div className="fixed bottom-8 right-8 flex flex-col items-end gap-3 z-50">
        <div className="bg-white px-4 py-2 rounded-2xl shadow-2xl border border-slate-100 text-[10px] font-black uppercase tracking-tighter text-slate-700 animate-bounce">
            Need Help?
        </div>
        <button 
            onClick={() => navigate("/chat")}
            className="w-16 h-16 bg-blue-600 text-white rounded-[1.5rem] shadow-2xl flex items-center justify-center hover:bg-blue-700 hover:rotate-6 hover:scale-110 transition-all duration-300 relative group"
        >
            <MessageCircle size={30} />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 border-4 border-white rounded-full"></span>
        </button>
      </div>

    </div>
  );
};

export default FileStatusPage;