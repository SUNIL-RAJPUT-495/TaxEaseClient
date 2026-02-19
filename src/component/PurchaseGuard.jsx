import React from 'react';
import { Loader2, FileText } from "lucide-react";
import { useCheckPurchase } from '../customHooks/useCheckPurchase';

const PurchaseGuard = ({ serviceName, type = "category", children }) => {
  const { loading } = useCheckPurchase(serviceName, type);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
          <FileText className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-400 w-5 h-5" />
        </div>
        <div className="text-center">
          <p className="text-slate-900 font-black italic uppercase tracking-widest text-xs">
            Verifying Subscription
          </p>
          <p className="text-slate-400 text-[10px] font-bold uppercase mt-1">
            Checking status for {serviceName}...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default PurchaseGuard;