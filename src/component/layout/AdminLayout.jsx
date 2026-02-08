import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Sidebar from "../../pages/admin/Sidebar"; 

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    console.log("User logged out");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      
      {/* --- Sidebar Component --- */}
      <Sidebar sidebarOpen={sidebarOpen} handleLogout={handleLogout} />

      <div className="flex-1 flex flex-col lg:ml-64 transition-all duration-200">
        
        {/* --- Header --- */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-slate-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              
              {/* Mobile Menu Toggle Button */}
              <button
                className="lg:hidden p-2 text-slate-500 hover:text-slate-900 rounded-md"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <div>
                <h1 className="text-2xl font-bold text-slate-900 leading-none">Admin Dashboard</h1>
                <p className="text-sm text-slate-500 mt-1">Manage your business</p>
              </div>
            </div>
          </div>
        </header>

        {/* --- Page Content (Outlet) --- */}
        <main className="p-6 flex-1 overflow-y-auto">
          <Outlet />
        </main>

      </div>

      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

    </div>
  );
}

export default AdminLayout;