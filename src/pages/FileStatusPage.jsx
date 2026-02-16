import React, { useState, useEffect } from "react";
import { 
  Clock, FileCheck, Download, CheckCircle, XCircle, 
  AlertCircle, Loader2, ShieldCheck, MessageSquare, ArrowLeft, Lock, Send, X, LayoutDashboard, PartyPopper, RefreshCcw
} from "lucide-react";
import { useNavigate } from "react-router-dom"; 
import Axios from "../utils/axios";
import SummaryApi from "../common/SummerAPI";
import OrderStepper from "../component/OrderStepper";

const FileStatusPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [fileData, setFileData] = useState([]); 
  const [userDecision, setUserDecision] = useState(null); 
  const [downloadingId, setDownloadingId] = useState(null);

  // --- Modals States (Wapas Added) ---
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isRejectSuccessOpen, setIsRejectSuccessOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDownload = async (url, filename, fileId) => {
    if (!url) return;
    setDownloadingId(fileId); 
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename || 'Tax_Document.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      window.open(url, "_blank");
    } finally {
      setDownloadingId(null);
    }
  };

  // 🔥 FETCH DATA (Dono API call fix kar di hain)
  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      // 1. Get Status (Token based call)
      const statusRes = await Axios({
        url: SummaryApi.getUserDecision.url.replace("/:userId", ""), // Frontend fix for User side
        method: "get"
      });

      // 2. Get Documents
      const docsRes = await Axios({
        url: SummaryApi.getMyDocuments.url,
        method: "get"
      });

      if (statusRes.data.success) {
        setUserDecision(statusRes.data.data.status);
      }

      if (docsRes.data.success) {
        setFileData(docsRes.data.data.reverse()); 
      }
    } catch (error) {
      console.error("Load Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // 🔥 SUBMIT DECISION (Approve or Reject with Reason)
  const submitDecision = async (decision, reason = "") => {
    try {
      setIsSubmitting(true);
      const res = await Axios({
        url: SummaryApi.updateFileDecision.url,
        method: SummaryApi.updateFileDecision.method,
        data: { decision, reason }
      });
      
      if (res.data.success) {
        setUserDecision(decision);
        setIsRejectModalOpen(false);
        if (decision === "approved") {
          setIsSuccessModalOpen(true); 
        } else {
          setIsRejectSuccessOpen(true); 
        }
      }
    } catch (error) {
      alert("Failed to update.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
      <Loader2 className="animate-spin text-blue-600 w-12 h-12" />
    </div>
  );

  const shouldShowDocuments = userDecision !== "rejected";

  return (
    <div className="min-h-screen bg-[#F8FAFC] relative font-sans">
      
      {/* --- 1. APPROVE SUCCESS MODAL --- */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" />
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in duration-300">
            <div className="p-10 text-center">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-100">
                <PartyPopper size={40} />
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-3 italic">Awesome!</h3>
              <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                Thank you for your approval. Our team will now finalize your tax filing and notify you once it's completed.
              </p>
              <button onClick={() => navigate("/dashboard")} className="w-full py-5 rounded-2xl bg-blue-600 text-white font-black hover:bg-blue-700 shadow-xl flex items-center justify-center gap-3 uppercase text-sm tracking-widest">
                <LayoutDashboard size={20} /> Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- 2. REJECTION SUCCESS MODAL --- */}
      {isRejectSuccessOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" />
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in duration-300">
            <div className="p-10 text-center">
              <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-100">
                <RefreshCcw size={40} className="animate-spin-slow" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-3 uppercase tracking-tight">Under Review</h3>
              <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                We've received your feedback. Our tax experts will review the corrections and upload updated documents within **24 hours**.
              </p>
              <button onClick={() => setIsRejectSuccessOpen(false)} className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold uppercase text-xs">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* --- 3. REJECTION INPUT MODAL (REASON BOX) --- */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsRejectModalOpen(false)} />
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-in slide-in-from-bottom-5">
            <div className="p-8">
               <div className="flex justify-between items-center mb-6">
                <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center"><AlertCircle size={24} /></div>
                <button onClick={() => setIsRejectModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2 italic">Wait, What's Wrong?</h3>
              <p className="text-slate-500 text-sm mb-6 font-medium">Please enter your feedback below.</p>
              <textarea 
                className="w-full h-32 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-red-500 outline-none transition-all resize-none font-bold"
                placeholder="E.g. Income details mismatch or wrong PAN..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
              <div className="flex gap-3 mt-8">
                <button onClick={() => setIsRejectModalOpen(false)} className="flex-1 py-4 font-bold text-slate-400 uppercase text-xs">Cancel</button>
                <button 
                  disabled={!rejectionReason.trim() || isSubmitting}
                  onClick={() => submitDecision("rejected", rejectionReason)}
                  className="flex-1 py-4 rounded-xl font-black bg-red-600 text-white shadow-lg active:scale-95 uppercase text-xs"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : "Submit Feedback"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- UI CONTENT --- */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-[60] flex items-center justify-between px-6 md:px-12 shadow-sm">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition-all"><ArrowLeft size={20} /></button>
        <h1 className="text-lg font-bold text-slate-800 tracking-tight">Final Approval</h1>
        <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100 font-black italic text-[10px] uppercase">
          <Lock size={14} /> Secure Review
        </div>
      </header>

      <div className="fixed top-16 left-0 right-0 z-50 bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto">
          <OrderStepper currentStep={5} status={userDecision === 'rejected' ? 'rejected' : 'pending'}/>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 pt-48 pb-32">
        <div className="mb-10 text-center md:text-left">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Filing Decision</h2>
          <p className="text-slate-500 mt-2 font-medium italic">Track your document status and final filing.</p>
        </div>

        {!shouldShowDocuments ? (
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-12 text-center shadow-xl animate-in fade-in zoom-in">
             <div className="w-20 h-20 bg-amber-50 text-amber-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                <RefreshCcw size={40} className="animate-spin-slow text-amber-500" />
             </div>
             <h2 className="text-2xl font-black text-slate-900 uppercase italic leading-none">Updating Drafts...</h2>
             <p className="text-slate-500 mt-4 max-w-md mx-auto leading-relaxed font-medium">
               We have hidden previous drafts. Our experts are correcting the files based on your reason: <br/>
               <span className="text-red-600 font-bold italic">"{userDecision === 'rejected' && 'Under Process'}"</span>
             </p>
             <button onClick={() => navigate("/")} className="mt-8 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold uppercase text-xs tracking-widest hover:bg-black transition-all">Back to Dashboard</button>
          </div>
        ) : (
          fileData.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 text-center shadow-xl shadow-slate-100">
               <Clock className="w-12 h-12 text-blue-600 animate-pulse mx-auto mb-4" />
               <h2 className="text-2xl font-black text-slate-900 italic uppercase">Under Review</h2>
               <p className="text-slate-500 mt-2 font-medium">Wait for 24-48 hours while we prepare your file.</p>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-12 shadow-2xl space-y-8 animate-in slide-in-from-bottom-5">
              <div className="flex items-center gap-6 pb-8 border-b border-slate-100">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg"><FileCheck size={32} /></div>
                <div className="text-left font-black uppercase tracking-tighter italic">
                  <h2 className="text-2xl text-slate-900">ITR Drafts Ready</h2>
                  <p className="text-slate-400 text-xs mt-1">Found {fileData.length} document(s) for verification</p>
                </div>
              </div>

              <div className="space-y-4">
                {fileData.map((file, index) => (
                  <div key={file._id || index} className={`p-5 border rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 transition-all group ${index === 0 ? 'bg-blue-50/50 border-blue-200' : 'bg-white border-slate-100'}`}>
                    <div className="flex items-center gap-4 text-left w-full truncate">
                      <div className="bg-red-500 text-white px-3 py-2 rounded-xl font-black text-[10px]">PDF</div>
                      <div className="truncate">
                        <p className="font-bold text-slate-800 text-sm md:text-base truncate">{file.name}</p>
                        <p className="text-[10px] text-slate-400 flex items-center gap-1 uppercase font-black"><ShieldCheck size={12} className="text-green-500" /> Official Tax Draft</p>
                      </div>
                    </div>
                    <button onClick={() => handleDownload(file.url, file.name, file._id || index)} className="w-full md:w-auto flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-black transition-all shadow-lg active:scale-95">
                      {downloadingId === (file._id || index) ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />} Download
                    </button>
                  </div>
                ))}
              </div>

              {(userDecision === "pending" || userDecision === "uploaded") ? (
                <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                  <button onClick={() => setIsRejectModalOpen(true)} className="py-5 rounded-2xl border-2 border-slate-100 text-slate-400 font-black hover:text-red-600 uppercase text-xs tracking-widest flex items-center justify-center gap-2 transition-all"><XCircle size={18} /> Found Errors</button>
                  <button onClick={() => submitDecision("approved")} className="py-5 rounded-2xl bg-blue-600 text-white font-black hover:bg-blue-700 shadow-xl uppercase text-xs tracking-widest flex items-center justify-center gap-2 transition-all"><CheckCircle size={18} /> Approve Draft</button>
                </div>
              ) : (
                <div className="p-8 rounded-[2rem] text-center border-2 bg-green-50 border-green-100 text-green-800">
                  <h3 className="font-black text-xl italic uppercase tracking-tighter">Approval Received</h3>
                  <p className="text-sm font-medium opacity-70">Final submission is in progress.</p>
                </div>
              )}
            </div>
          )
        )}
      </main>

      {/* Floating Chat */}
      <div className="fixed bottom-8 right-8 flex flex-col items-end gap-3 z-[100]">
        <div className="bg-white px-4 py-2 rounded-2xl shadow-2xl border border-slate-100 text-[10px] font-black uppercase text-slate-700 animate-bounce">Help?</div>
        <button onClick={() => navigate("/chat")} className="w-16 h-16 bg-blue-600 text-white rounded-[1.5rem] shadow-2xl flex items-center justify-center hover:bg-blue-700 border-4 border-white transition-all"><MessageSquare size={30} /></button>
      </div>

      <style>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
      `}</style>
    </div>
  );
};

export default FileStatusPage;