import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  Users, 
  ShoppingBag, 
  LayoutGrid, 
  Settings, 
  FileText, 
  LogOut 
} from "lucide-react";

const Sidebar = ({ sidebarOpen, handleLogout }) => {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Dashboard", path: "/admin" },
    { icon: Users, label: "Users", path: "/admin/users" },
    { icon: ShoppingBag, label: "Orders", path: "/admin/orders" },
    { icon: LayoutGrid, label: "Services", path: "/admin/services" },
    { icon: Settings, label: "Settings", path: "/admin/settings" },
  ];

  // Helper function to check active state
  const isActive = (path) => location.pathname === path;

  return (
    <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-200 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
      <div className="flex flex-col h-full">
        
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl">
              Tax<span className="text-blue-400">Ease</span>
            </span>
          </Link>
          <p className="text-white/50 text-sm mt-2 font-medium">Admin Panel</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm ${
                isActive(item.path)
                  ? "bg-white/10 text-white font-medium"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <button 
            className="w-full flex items-center justify-start px-4 py-2 text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;