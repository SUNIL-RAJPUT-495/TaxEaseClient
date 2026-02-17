import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, AlertCircle } from 'lucide-react';

const AuthModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleLoginRedirect = () => {
        localStorage.clear();
        onClose();
        navigate("/login");
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center animate-in zoom-in duration-300">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle size={32} />
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-2">Session Expired</h3>
                <p className="text-slate-500 mb-6 text-sm">
                    Access Denied: Your account is inactive. Please contact the administrator for assistance. You have been logged out.
                </p>

                <button 
                    onClick={handleLoginRedirect}
                    className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                >
                    <LogOut size={18} />
                    Login Page par Jayein
                </button>
            </div>
        </div>
    );
};

export default AuthModal;