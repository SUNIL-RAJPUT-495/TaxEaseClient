import React from "react";
import { useOutletContext } from "react-router-dom";
import { FileCheck, CheckCircle, XCircle, Download } from "lucide-react";

const StatusPage = () => {
  const { setStatus, status } = useOutletContext(); 

  const handleApprove = () => {
    setStatus("approved");
    alert("You have approved the filing! Process Complete.");
  };

  const handleReject = () => {
    const reason = prompt("Please enter reason for rejection:");
    if (reason) {
      setStatus("rejected");
    }
  };

  return (
    <div className="max-w-2xl mx-auto text-center">
      
      {/* --- File Preview Card --- */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm mb-8">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
           <FileCheck className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Final Draft Ready</h2>
        <p className="text-slate-500 mb-6">Admin has uploaded your final ITR draft. Please review.</p>
        
        <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
           <div className="flex items-center gap-3">
              <div className="bg-red-100 p-2 rounded text-red-600 font-bold text-xs">PDF</div>
              <div className="text-left">
                 <p className="text-sm font-bold text-slate-700">ITR_Final_Draft_2024.pdf</p>
                 <p className="text-xs text-slate-400">2.4 MB</p>
              </div>
           </div>
           <button className="text-blue-600 hover:bg-blue-50 p-2 rounded-full transition-colors">
              <Download size={20} />
           </button>
        </div>
      </div>

      {/* --- Action Buttons --- */}
      {status === "pending" && (
        <div className="flex gap-4">
          <button 
            onClick={handleReject}
            className="flex-1 py-3 rounded-xl border-2 border-red-100 text-red-600 font-bold hover:bg-red-50 hover:border-red-200 transition-all flex items-center justify-center gap-2"
          >
            <XCircle size={20} /> Reject
          </button>
          <button 
            onClick={handleApprove}
            className="flex-1 py-3 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 shadow-lg shadow-green-200 transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle size={20} /> Approve
          </button>
        </div>
      )}

      {/* --- Success/Fail Message --- */}
      {status === "approved" && (
         <div className="bg-green-50 text-green-700 p-4 rounded-xl font-bold border border-green-200">
            🎉 You have successfully approved the document!
         </div>
      )}

      {status === "rejected" && (
         <div className="bg-red-50 text-red-700 p-4 rounded-xl font-bold border border-red-200">
            ❌ You rejected the document. Admin will contact you shortly.
         </div>
      )}

    </div>
  );
};
export default StatusPage;