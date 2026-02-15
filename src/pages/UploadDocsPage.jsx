import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  CloudUpload, FileText, X, ShieldCheck, CheckCircle2, 
  ArrowRight, Download, Files, Loader2, ArrowLeft, Lock
} from "lucide-react";
import Axios from "../utils/axios";
import SummaryApi from "../common/SummerAPI";
import OrderStepper from "../component/OrderStepper";

const UploadDocsPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // --- Logic Same Rahega (Fetch/Upload Handlers) ---
  useEffect(() => {
    const fetchDocs = async () => {
        try {
            const res = await Axios({
                url: SummaryApi.getUploadedDocs?.url,
                method: SummaryApi.getUploadedDocs?.method
            });
            if (res.data.success) setUploadedDocs(res.data.data || []);
        } catch (error) { console.log(error); }
        finally { setFetching(false); }
    };
    fetchDocs();
  }, []);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) validateAndAddFiles(Array.from(e.dataTransfer.files));
  };

  const validateAndAddFiles = (newFiles) => {
    const validFiles = newFiles.filter(file => file.size <= 5 * 1024 * 1024);
    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const handleUploadToServer = async () => {
    if (selectedFiles.length === 0) return;
    setUploading(true);
    const formData = new FormData();
    selectedFiles.forEach(file => formData.append("file", file));
    try {
      const res = await Axios({
        url: SummaryApi.uploadFile.url,
        method: SummaryApi.uploadFile.method,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (res.data.success) {
        setUploadedDocs(prev => [...prev, res.data.data]);
        setSelectedFiles([]); 
      }
    } catch (error) { alert("Upload failed!"); }
    finally { setUploading(false); }
  };

  const formatSize = (bytes) => (bytes / (1024 * 1024)).toFixed(2) + " MB";

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      
      {/* --- 1. Top Mini-Navbar (Fixed) --- */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-[60] flex items-center justify-between px-6 md:px-12">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-600"><ArrowLeft size={20} /></button>
          <h1 className="text-lg font-bold text-slate-800 hidden sm:block">Document Vault</h1>
        </div>
        <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
          <Lock size={14} /><span className="text-[10px] font-black uppercase tracking-wider italic">Secure Gateway</span>
        </div>
      </header>

      {/* --- 2. Order Stepper (Fixed just below Navbar) --- */}
      {/* Yahan 'top-16' navbar ke gap ko fill karega */}
      <div className="fixed top-16 left-0 right-0 z-50 bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto">
          <OrderStepper currentStep={3} status="pending"/>
        </div>
      </div>

      {/* --- 3. Main Content Area --- */}
      {/* pt-44 ensures content starts below both headers */}
      <main className="max-w-6xl mx-auto px-4 pt-48 pb-32">
        
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Left Column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm sticky top-48">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                <FileText className="text-blue-600" size={20} /> Required Checklist
              </h3>
              <ul className="space-y-4">
                {["PAN Card", "Aadhar Card", "Form-16", "Bank Statement"].map((doc, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <CheckCircle2 size={16} className="text-green-500" /> {doc}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-8 space-y-8">
            {/* Upload Zone */}
            <div className="bg-white border border-slate-200 shadow-xl shadow-slate-200/50 rounded-3xl p-6 md:p-8">
              <div 
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current.click()}
                className={`border-2 border-dashed rounded-[2rem] p-12 flex flex-col items-center justify-center cursor-pointer transition-all
                  ${isDragging ? "border-blue-500 bg-blue-50 scale-[0.99]" : "border-slate-200 hover:border-blue-400 hover:bg-slate-50"}`}
              >
                <input type="file" multiple ref={fileInputRef} onChange={(e) => validateAndAddFiles(Array.from(e.target.files))} className="hidden" accept=".pdf,.jpg,.png" />
                <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl shadow-lg flex items-center justify-center mb-5 rotate-3"><CloudUpload size={28} /></div>
                <p className="text-xl font-black text-slate-900">Drag & Drop Documents</p>
                <p className="text-sm text-slate-400 mt-1">Files should be under 5MB</p>
              </div>

              {/* Pending Preview */}
              {selectedFiles.length > 0 && (
                <div className="mt-8 space-y-3 animate-in fade-in slide-in-from-top-4">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <span className="text-sm font-bold text-slate-700 truncate max-w-xs">{file.name}</span>
                      <button onClick={() => setSelectedFiles(selectedFiles.filter((_, i) => i !== index))} className="text-slate-300 hover:text-red-500"><X size={20} /></button>
                    </div>
                  ))}
                  <button onClick={handleUploadToServer} disabled={uploading} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black mt-4 hover:bg-blue-700 transition-all flex items-center justify-center gap-3">
                    {uploading ? <Loader2 className="animate-spin" size={20} /> : <CloudUpload size={20} />}
                    {uploading ? "UPLOADING..." : "START UPLOAD"}
                  </button>
                </div>
              )}
            </div>

            {/* Uploaded List */}
            <div className="bg-white border border-slate-200 shadow-sm rounded-3xl overflow-hidden">
               <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <h3 className="font-black text-slate-900 uppercase tracking-tight">Your Document Vault</h3>
                  <ShieldCheck size={20} className="text-green-600" />
               </div>
               {fetching ? <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto text-blue-600"/></div> : 
               uploadedDocs.length > 0 ? (
                  <div className="divide-y divide-slate-50">
                     {uploadedDocs.map((doc, i) => (
                       <div key={doc._id || i} className="flex items-center justify-between p-5 hover:bg-slate-50 transition-all">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400"><FileText size={20} /></div>
                             <div>
                                <p className="text-sm font-bold text-slate-800">{doc.name}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase">{formatSize(doc.size || 0)}</p>
                             </div>
                          </div>
                          <a href={doc.url} target="_blank" rel="noreferrer" className="text-blue-600 bg-blue-50 p-2 rounded-lg hover:bg-blue-100"><Download size={18} /></a>
                       </div>
                     ))}
                  </div>
               ) : <div className="p-16 text-center text-slate-300 font-bold"><p>No documents uploaded yet.</p></div>}
            </div>
          </div>
        </div>
      </main>

      {/* --- 4. Fixed Action Bar (Bottom) --- */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="hidden md:block">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Next Step</p>
            <p className="text-sm font-black text-slate-700">Review Approval Status</p>
          </div>
          <button onClick={() => navigate("/FileStatusPage")} className="w-full md:w-auto bg-blue-700 text-white px-10 py-4 rounded-2xl font-black hover:bg-blue-900 shadow-xl transition-all flex items-center justify-center gap-3">
            GO TO STATUS <ArrowRight size={20} />
          </button>
        </div>
      </footer>

    </div>
  );
};

export default UploadDocsPage;