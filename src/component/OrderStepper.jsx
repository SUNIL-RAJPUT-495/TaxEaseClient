import { 
  Check, 
  LayoutGrid, 
  CreditCard, 
  FileUp, 
  MessageSquare, 
  ShieldCheck, 
  XCircle 
} from "lucide-react";

const OrderStepper = ({ currentStep, status }) => {
  
  const steps = [
    { id: 1, label: "Select Plan", icon: LayoutGrid },
    { id: 2, label: "Payment", icon: CreditCard },
    { id: 3, label: "Upload Docs", icon: FileUp },
    { id: 4, label: "Processing", icon: MessageSquare },
    { id: 5, label: "Final Status", icon: ShieldCheck },
  ];

  return (
    <div className="fixed top-16 left-0 right-0 z-30 bg-white border-b border-slate-200 shadow-sm transition-all">
      <div className="max-w-5xl mx-auto px-4 py-4 relative">
        
        <div className="absolute left-0 top-1/2 w-full h-1 bg-slate-100 -z-10 -translate-y-1/2 rounded-full mx-4" style={{ width: "calc(100% - 32px)" }} />

        <div 
          className={`absolute left-0 top-1/2 h-1 -z-10 -translate-y-1/2 rounded-full transition-all duration-500 ease-out mx-4
            ${status === 'rejected' ? 'bg-red-500' : 'bg-blue-500'}
          `}
          style={{ width: `calc(${((currentStep - 1) / (steps.length - 1)) * 100}% - 32px)` }}
        />

        <div className="flex justify-between items-center w-full">
          {steps.map((step) => {
            const isCompleted = currentStep > step.id;
            const isActive = currentStep === step.id;
            
            const isRejected = status === 'rejected' && step.id === 5;
            const isApproved = status === 'approved' && step.id === 5;


            let circleClass = "bg-white border-blue-200 text-slate-300"; 
            let icon = <step.icon size={16} />;

            if (isRejected) {
              circleClass = "bg-red-500 border-red-500 text-white shadow-lg shadow-red-200"; 
              icon = <XCircle size={18} />;
            } else if (isCompleted || isApproved) {
              circleClass = "bg-blue-500 border-blue-600 text-white"; 
              icon = <Check size={18} strokeWidth={3} />;
            } else if (isActive) {
              circleClass = "bg-white border-blue-600 text-blue-600 shadow-lg scale-110"; 
            }

            return (
              <div key={step.id} className="flex flex-col items-center bg-white px-2">
                

                <div className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full border-2 transition-all duration-300 ${circleClass}`}>
                  {icon}
                </div>

                <span className={`mt-2 text-[10px] md:text-xs font-bold uppercase tracking-wider hidden sm:block transition-colors
                  ${isActive ? "text-blue-600" : isRejected ? "text-red-600" : isCompleted ? "text-blue-600" : "text-slate-400"}
                `}>
                  {isRejected ? "Rejected" : step.label}
                </span>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrderStepper;