import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  FileText, Upload, Download, Clock, CheckCircle, 
  User, LogOut, Menu, X, Home, ShoppingBag, 
  Files, Settings 
} from "lucide-react";

// --- Mock Data ---
const purchasedServices = [
  {
    id: "1",
    service: "ITR Filing",
    plan: "Standard",
    status: "in_review",
    purchaseDate: "2024-01-15",
    amount: "₹999",
  },
  {
    id: "2",
    service: "GST Services",
    plan: "Basic",
    status: "completed",
    purchaseDate: "2024-01-10",
    amount: "₹799",
  },
];

const documents = [
  { id: "1", name: "Form 16 - 2023-24.pdf", uploadedAt: "2024-01-16", size: "1.2 MB" },
  { id: "2", name: "Bank Statement.pdf", uploadedAt: "2024-01-16", size: "856 KB" },
];

// --- Helper Components (To replace ShadCN) ---

const StatusBadge = ({ status }) => {
  let styles = "";
  let label = "";

  switch (status) {
    case "pending":
      styles = "bg-yellow-50 text-yellow-600 border-yellow-200";
      label = "Pending";
      break;
    case "in_review":
      styles = "bg-blue-50 text-blue-600 border-blue-200";
      label = "In Review";
      break;
    case "completed":
      styles = "bg-green-50 text-green-600 border-green-200";
      label = "Completed";
      break;
    default:
      styles = "bg-slate-100 text-slate-600 border-slate-200";
      label = "Unknown";
  }

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${styles}`}>
      {label}
    </span>
  );
};

const Card = ({ children, className = "" }) => (
  <div className={`rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm ${className}`}>
    {children}
  </div>
);

// --- Main Component ---

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  const navItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard", active: true },
    { icon: ShoppingBag, label: "My Services", path: "/dashboard/services" },
    { icon: Files, label: "Documents", path: "/dashboard/documents" },
    { icon: Settings, label: "Settings", path: "/dashboard/settings" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-950">
      
      {/* --- Sidebar --- */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full">
          
          {/* Logo */}
          <div className="p-6 border-b border-slate-200">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-sm">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-slate-950">
                Tax<span className="text-blue-600">Ease</span>
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium ${
                  item.active
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-slate-200">
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-slate-900 truncate">John Doe</p>
                <p className="text-xs text-slate-500 truncate">john@example.com</p>
              </div>
            </div>
            <button 
              className="w-full flex items-center justify-start px-4 py-2 text-sm font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* --- Main Content --- */}
      <div className="flex-1 lg:ml-64">
        
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-slate-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden p-2 text-slate-500 hover:text-slate-900 rounded-md"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 leading-none">Dashboard</h1>
                <p className="text-sm text-slate-500 mt-1">Welcome back, John!</p>
              </div>
            </div>
            <Link 
              to="/services" 
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2"
            >
              Buy New Service
            </Link>
          </div>
        </header>

        {/* Dashboard Body */}
        <main className="p-6 space-y-6">
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
                  <ShoppingBag className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">2</p>
                  <p className="text-sm text-slate-500">Active Services</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-yellow-50 flex items-center justify-center border border-yellow-100">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">1</p>
                  <p className="text-sm text-slate-500">In Progress</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center border border-green-100">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">1</p>
                  <p className="text-sm text-slate-500">Completed</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Purchased Services Table */}
          <Card>
            <div className="flex flex-col space-y-1.5 p-6 pb-2">
              <h3 className="text-2xl font-semibold leading-none tracking-tight">My Services</h3>
              <p className="text-sm text-slate-500">Track your purchased services and their status</p>
            </div>
            <div className="p-6 pt-0">
              <div className="space-y-4 mt-4">
                {purchasedServices.map((item) => (
                  <div 
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-blue-300 transition-colors gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{item.service}</p>
                        <p className="text-sm text-slate-500">{item.plan} Plan • {item.purchaseDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 sm:justify-end">
                      <StatusBadge status={item.status} />
                      <span className="font-medium text-slate-900">{item.amount}</span>
                      <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-slate-100 hover:text-slate-900 h-9 w-9">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Documents Section */}
          <Card>
            <div className="flex flex-row items-center justify-between p-6 pb-2">
              <div className="space-y-1.5">
                <h3 className="text-2xl font-semibold leading-none tracking-tight">Documents</h3>
                <p className="text-sm text-slate-500">Manage your uploaded documents</p>
              </div>
              <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-slate-900 text-white hover:bg-slate-900/90 h-9 px-4 py-2">
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </button>
            </div>
            <div className="p-6 pt-4">
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div 
                    key={doc.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-red-50 flex items-center justify-center border border-red-100">
                        <FileText className="w-4 h-4 text-red-500" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 text-sm">{doc.name}</p>
                        <p className="text-xs text-slate-500">{doc.size} • {doc.uploadedAt}</p>
                      </div>
                    </div>
                    <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-slate-100 hover:text-slate-900 h-8 w-8">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </Card>

        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;