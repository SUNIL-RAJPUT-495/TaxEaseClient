import React from "react";
import { Link } from "react-router-dom";
import { FileText, User, LogOut } from "lucide-react";

const Sidebar = ({ sidebarOpen, navItems, location, userData, handleLogout }) => (
  <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-slate-200">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-sm">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl text-slate-900">
            Tax<span className="text-blue-600">Ease</span>
          </span>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <Link key={item.label} to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium ${location.pathname === item.path ? "bg-blue-50 text-blue-600" : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"}`}>
            <item.icon className="w-5 h-5" /> {item.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm text-slate-900 truncate">{userData?.name || "User"}</p>
            <p className="text-xs text-slate-500 truncate">{userData?.email || "No Email"}</p>
          </div>
        </div>
        <button className="w-full flex items-center justify-start px-4 py-2 text-sm font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" /> Logout
        </button>
      </div>
    </div>
  </aside>
);

export default Sidebar;