import React, { useState, useEffect } from "react";
import { 
  Clock, FileCheck, Download, CheckCircle, XCircle, 
  AlertCircle, Loader2, ShieldCheck, MessageSquare, ArrowLeft, Lock, Send, X, LayoutDashboard, PartyPopper, RefreshCcw
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom"; 
import Axios from "../utils/axios";
import SummaryApi from "../common/SummerAPI";
import OrderStepper from "../component/OrderStepper";
import { toast } from "react-hot-toast";

const FileStatusPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeServiceId = searchParams.get("serviceId");

  const [loading, setLoading] = useState(true);
  const [fileData, setFileData] = useState([]); 
  const [userDecision, setUserDecision] = useState("pending"); 
  const [downloadingId, setDownloadingId] = useState(null);

  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isRejectSuccessOpen, setIsRejectSuccessOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 🔥 1. Added missing state for selection
  const [selectedDocId, setSelectedDocId] = useState(null);

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
    } catch (error) { window.open(url, "_blank"); } 
    finally { setDownloadingId(null); }
  };

  const fetchAllData = async () => {
    if (!activeServiceId) { setLoading(false); return; }
    try {
      setLoading(true);
      const statusApi = SummaryApi.getFileDecisionStatus || SummaryApi.getUserDecision; 
      if (statusApi) {
          const statusRes = await Axios({
            url: `${statusApi.url}?activeServiceId=${activeServiceId}`,
            method: "get"
          });
          if (statusRes.data.success) { setUserDecision(statusRes.data.data.status); }
      }
      const docsApi = SummaryApi.getMyDocuments || SummaryApi.getUploadedDocs;
      if (docsApi) {
          const docsRes = await Axios({
            url: `${docsApi.url}?activeServiceId=${activeServiceId}`,
            method: "get"
          });
          if (docsRes.data.success) {
            const adminDocs = docsRes.data.data.filter(doc => doc.uploadedBy === 'ADMIN');
            setFileData(adminDocs.reverse()); 
          }
      }
    } catch (error) { console.error("Load Error:", error); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAllData(); }, [activeServiceId]);

  const submitDecision = async (decision, docId, reason = "") => {
    if(!docId) return toast.error("Document ID is missing");
    try {
        setIsSubmitting(true);
        const res = await Axios({
            url: SummaryApi.updateFileDecision.url,
            method: SummaryApi.updateFileDecision.method,
            data: { activeServiceId, documentId: docId, decision, reason }
        });
        
        if (res.data.success) {
            // Update local state
            setFileData(prev => prev.map(f => f._id === docId ? { ...f, docStatus: decision } : f));
            setIsRejectModalOpen(false);
            if (decision === "approved") setIsSuccessModalOpen(true); 
            else setIsRejectSuccessOpen(true); 
        }
    } catch (error) { toast.error("Failed to update status."); } 
    finally { setIsSubmitting(false); }
  };

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]"><Loader2 className="animate-spin text-blue-600 w-12 h-12" /></div>;

  const shouldShowDocuments = userDecision !== "rejected";

  return (
    <div className="min-h-screen bg-[#F8FAFC] relative font-sans">
      
      {/* SUCCESS MODAL */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setIsSuccessModalOpen(false)} />
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl relative z-10 p-10 text-center animate-in zoom-in">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6"><PartyPopper size={40} /></div>
              <h3 className="text-3xl font-black text-slate-900 mb-3 italic">Awesome!</h3>
              <p className="text-slate-500 mb-8 leading-relaxed">Thank you for your approval. We will finalize your filing.</p>
              <button onClick={() => setIsSuccessModalOpen(false)} className="w-full py-5 rounded-2xl bg-blue-600 text-white font-black hover:bg-blue-700 shadow-xl uppercase text-sm tracking-widest flex items-center justify-center gap-3"><LayoutDashboard size={20} /> Close</button>
          </div>
        </div>
      )}

      {/* REJECT MODAL */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsRejectModalOpen(false)} />
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl relative z-10 p-8">
              <h3 className="text-2xl font-black text-slate-900 mb-2 italic">What's Wrong?</h3>
              <p className="text-slate-500 text-sm mb-6 font-medium">Please enter your feedback for this document.</p>
              <textarea className="w-full h-32 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-red-500 outline-none resize-none font-bold" placeholder="E.g. Income details mismatch..." value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} />
              <div className="flex gap-3 mt-8">
                <button onClick={() => setIsRejectModalOpen(false)} className="flex-1 py-4 font-bold text-slate-400">Cancel</button>
                <button disabled={!rejectionReason.trim() || isSubmitting} onClick={() => submitDecision("rejected", selectedDocId, rejectionReason)} className="flex-1 py-4 rounded-xl font-black bg-red-600 text-white shadow-lg uppercase text-xs flex justify-center items-center">{isSubmitting ? <Loader2 className="animate-spin" size={16} /> : "Submit"}</button>
              </div>
          </div>
        </div>
      )}

      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-[60] flex items-center justify-between px-6 md:px-12 shadow-sm">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition-all"><ArrowLeft size={20} /></button>
        <h1 className="text-lg font-bold text-slate-800 tracking-tight">Final Approval</h1>
        <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100 font-black italic text-[10px] uppercase"><Lock size={14} /> Secure Review</div>
      </header>

      <div className="fixed top-16 left-0 right-0 z-50 bg-white border-b border-slate-100">
          <OrderStepper currentStep={5} status={userDecision === 'rejected' ? 'rejected' : 'pending'}/>
      </div>

      <main className="max-w-4xl mx-auto px-4 pt-48 pb-32">
        <div className="mb-10 text-center md:text-left">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Filing Decision</h2>
          <p className="text-slate-500 mt-2 font-medium italic">Track your document status and final filing.</p>
        </div>

        {fileData.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 text-center shadow-xl shadow-slate-100">
               <Clock className="w-12 h-12 text-blue-600 animate-pulse mx-auto mb-4" />
               <h2 className="text-2xl font-black text-slate-900 italic uppercase">Under Review</h2>
               <p className="text-slate-500 mt-2 font-medium">Wait for 24-48 hours while we prepare your file.</p>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-12 shadow-2xl space-y-8">
              <div className="flex items-center gap-6 pb-8 border-b border-slate-100">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg"><FileCheck size={32} /></div>
                <div className="text-left font-black uppercase tracking-tighter italic">
                  <h2 className="text-2xl text-slate-900">ITR Drafts Ready</h2>
                  <p className="text-slate-400 text-xs mt-1">{fileData.length} document(s) need verification</p>
                </div>
              </div>

              <div className="space-y-6">
                {fileData.map((file, index) => (
                  <div key={file._id} className={`p-5 border rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 transition-all ${file.docStatus === 'approved' ? 'bg-green-50/50 border-green-200' : 'bg-white border-slate-100'}`}>
                    <div className="flex items-center gap-4 text-left w-full truncate">
                      <div className="bg-red-500 text-white px-3 py-2 rounded-xl font-black text-[10px]">PDF</div>
                      <div className="truncate">
                        <p className="font-bold text-slate-800 text-sm md:text-base truncate">{file.name}</p>
                        <p className="text-[10px] text-slate-400 flex items-center gap-1 uppercase font-black"><ShieldCheck size={12} className="text-green-500" /> 
                            Status: <span className={file.docStatus === 'approved' ? 'text-green-600' : 'text-blue-600'}>{file.docStatus}</span>
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 w-full md:w-auto">
                        <button onClick={() => handleDownload(file.url, file.name, file._id)} className="p-3 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600">
                            {downloadingId === file._id ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
                        </button>
                        
                        {/* 🔥 FIXED BUTTONS: Now inside loop and using file._id */}
                        {file.docStatus === 'pending' && (
                            <div className="flex gap-2">
                                <button onClick={() => { setSelectedDocId(file._id); setIsRejectModalOpen(true); }} className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-100">Reject</button>
                                <button onClick={() => submitDecision("approved", file._id)} className="px-4 py-2 bg-green-600 text-white rounded-xl text-xs font-bold hover:bg-green-700">Approve</button>
                            </div>
                        )}
                        {file.docStatus === 'approved' && <div className="text-green-600 font-black text-[10px] uppercase flex items-center gap-1"><CheckCircle size={14} /> Verified</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        }
      </main>

      <div className="fixed bottom-8 right-8 flex flex-col items-end gap-3 z-[100]">
        <button onClick={() => navigate("/chat")} className="w-16 h-16 bg-blue-600 text-white rounded-[1.5rem] shadow-2xl flex items-center justify-center hover:bg-blue-700 border-4 border-white transition-all"><MessageSquare size={30} /></button>
      </div>

      <style>{` @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } .animate-spin-slow { animation: spin-slow 8s linear infinite; } `}</style>
    </div>
  );
};

export default FileStatusPage;