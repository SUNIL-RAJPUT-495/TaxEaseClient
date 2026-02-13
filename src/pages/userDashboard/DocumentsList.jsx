import React from "react";
import { FileText, Download, Files, Upload } from "lucide-react";

const DocumentsList = ({ documents = [], onUploadClick }) => (
  <div className="rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm overflow-hidden">
    <div className="flex flex-row items-center justify-between p-6 pb-4 border-b border-slate-100">
      <div className="space-y-1.5">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">Documents</h3>
        <p className="text-sm text-slate-500">Manage your uploaded documents</p>
      </div>
      
      <button 
        onClick={onUploadClick}
        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors bg-blue-600 text-white hover:bg-blue-700 h-9 px-4 py-2"
      >
        <Upload className="w-4 h-4 mr-2" />
        Upload
      </button>
    </div>

    <div className="p-0">
      {documents && documents.length > 0 ? (
        <div className="divide-y divide-slate-100">
          {documents.map((doc, index) => (
            <div key={doc._id || index} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center border border-indigo-100 text-indigo-600">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-slate-900 text-sm">{doc.name}</p>
                  <p className="text-xs text-slate-500">
                    Uploaded on {new Date(doc.uploadedAt || Date.now()).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <a 
                href={doc.url} 
                target="_blank" 
                rel="noopener noreferrer"
                download
                title="Download Document"
                className="inline-flex items-center justify-center rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100 h-9 w-9 transition-colors"
              >
                 <Download className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-slate-50/50">
           <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 mb-3">
              <Files className="w-6 h-6 text-slate-400" />
           </div>
           <p className="text-slate-500 text-sm">No documents uploaded yet.</p>
        </div>
      )}
    </div>
  </div>
);

export default DocumentsList;