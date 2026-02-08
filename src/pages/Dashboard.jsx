import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; 
import { 
  FileText, Upload, Download, Clock, CheckCircle, 
  User, LogOut, Menu, X, Home, ShoppingBag, 
  Files, Settings, Loader2, CloudUpload, Lock, Mail, 
  Smartphone, Shield, Camera, Bell, Save 
} from "lucide-react";
import Axios from "../utils/axios"; 
import SummaryApi from "../common/SummerAPI";

// --- Helper Components ---
const StatusBadge = ({ status }) => {
  let styles = "";
  let label = "";
  switch (status) {
    case "created": styles = "bg-yellow-50 text-yellow-600 border-yellow-200"; label = "Pending Payment"; break;
    case "paid": styles = "bg-green-50 text-green-600 border-green-200"; label = "Active / Paid"; break;
    case "failed": styles = "bg-red-50 text-red-600 border-red-200"; label = "Failed"; break;
    default: styles = "bg-slate-100 text-slate-600 border-slate-200"; label = status || "Unknown";
  }
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors ${styles}`}>{label}</span>;
};

const Card = ({ children, className = "" }) => (
  <div className={`rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm ${className}`}>{children}</div>
);

const Dashboard = () => {
  // --- 1. Dashboard Core State ---
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const location = useLocation(); 

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false); 
  const [selectedFile, setSelectedFile] = useState(null); 
  const [uploading, setUploading] = useState(false); 

  // --- 2. Settings Page State (Added Fix) ---
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    role: "User"
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: ""
  });

 

  // --- 3. Fetch Data ---
  const fetchUserDetails = async () => {
    try {
      const response = await Axios({
        url: SummaryApi.userDetails.url,
        method: SummaryApi.userDetails.method,
      });
      if (response.data.success) {
        setUserData(response.data.data);
        
        // ✅ Sync Settings Form with Real User Data
        setProfile({
            name: response.data.data.name || "",
            email: response.data.data.email || "",
            phone: response.data.data.phone || "",
            role: response.data.data.role || "User"
        });
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  // --- 4. Handlers ---
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleOpenModal = () => {
    setIsUploadModalOpen(true);
    setSelectedFile(null); 
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUploadSubmit = async () => {
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile); 

    try {
      setUploading(true);
      const res = await Axios({
        url: SummaryApi.uploadFile.url, 
        method: SummaryApi.uploadFile.method,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        alert("Document Uploaded Successfully!");
        setIsUploadModalOpen(false); 
        fetchUserDetails(); 
      }
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed: " + (err.response?.data?.message || err.message));
    } finally {
      setUploading(false);
    }
  };

  // ✅ Settings Handlers (Added Fix)
  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  

  const handleSaveProfile = (e) => {
    e.preventDefault();
    alert("Profile Updated! (Backend integration required)");
  };

  // --- Navigation Items ---
  const navItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: ShoppingBag, label: "My Services", path: "/dashboard/services" },
    { icon: Files, label: "Documents", path: "/dashboard/documents" },
    { icon: Settings, label: "Settings", path: "/dashboard/settings" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  const totalServices = userData?.orders?.length || 0;
  const completedServices = userData?.orders?.filter(o => o.status === 'paid').length || 0;
  const pendingServices = totalServices - completedServices;

  // --- Render Functions ---
  const renderStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100"><ShoppingBag className="w-6 h-6 text-blue-600" /></div>
          <div><p className="text-2xl font-bold text-slate-900">{totalServices}</p><p className="text-sm text-slate-500">Total Services</p></div>
        </div>
      </Card>
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-yellow-50 flex items-center justify-center border border-yellow-100"><Clock className="w-6 h-6 text-yellow-600" /></div>
          <div><p className="text-2xl font-bold text-slate-900">{pendingServices}</p><p className="text-sm text-slate-500">Pending / Unpaid</p></div>
        </div>
      </Card>
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center border border-green-100"><CheckCircle className="w-6 h-6 text-green-600" /></div>
          <div><p className="text-2xl font-bold text-slate-900">{completedServices}</p><p className="text-sm text-slate-500">Active / Paid</p></div>
        </div>
      </Card>
    </div>
  );

  const renderServicesList = () => (
    <Card>
      <div className="flex flex-col space-y-1.5 p-6 pb-2">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">My Services</h3>
        <p className="text-sm text-slate-500">Track your purchased services and their status</p>
      </div>
      <div className="p-6 pt-0">
        <div className="space-y-4 mt-4">
          {userData?.orders?.length > 0 ? (
            [...userData.orders].reverse().map((order) => (
              <div key={order._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-blue-300 transition-colors gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{order.service}</p>
                    <p className="text-sm text-slate-500">
                      {order.plan} Plan • {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 sm:justify-end">
                  <StatusBadge status={order.status} />
                  <span className="font-medium text-slate-900">₹{order.amount}</span>
                  {order.status === 'paid' && (
                    <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-slate-100 hover:text-slate-900 h-9 w-9">
                      <Download className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-slate-500">No services purchased yet.</div>
          )}
        </div>
      </div>
    </Card>
  );

  const renderDocumentsList = () => (
    <Card>
      <div className="flex flex-row items-center justify-between p-6 pb-4 border-b border-slate-100">
        <div className="space-y-1.5">
          <h3 className="text-2xl font-semibold leading-none tracking-tight">Documents</h3>
          <p className="text-sm text-slate-500">Manage your uploaded documents</p>
        </div>
        
        <button 
          onClick={handleOpenModal}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors bg-blue-600 text-white hover:bg-blue-700 h-9 px-4 py-2"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload
        </button>
      </div>

      <div className="p-0">
        {userData?.documents && userData.documents.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {userData.documents.map((doc, index) => (
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
    </Card>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      
      {/* 1. Profile Information Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Profile Information
          </h3>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border-2 border-white shadow-sm">
                <User className="w-10 h-10" />
              </div>
              <button className="absolute bottom-0 right-0 p-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors border-2 border-white">
                <Camera className="w-3 h-3" />
              </button>
            </div>
            <div>
              <h4 className="font-medium text-slate-900">Profile Photo</h4>
              <p className="text-xs text-slate-500">JPG, GIF or PNG. Max size of 800K</p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Full Name</label>
              <input 
                type="text" 
                name="name"
                value={profile.name}
                onChange={handleProfileChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Phone Number</label>
              <input 
                type="text" 
                name="phone"
                value={profile.phone}
                onChange={handleProfileChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium text-slate-700">Email Address</label>
              <input 
                type="email" 
                name="email"
                value={profile.email}
                onChange={handleProfileChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              />
            </div>
            <div className="md:col-span-2 flex justify-end mt-2">
              <button type="submit" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm">
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 2. Security / Password Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
            <Lock className="w-5 h-5 text-blue-600" />
            Security
          </h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1 md:col-span-2">
                <label className="text-sm font-medium text-slate-700">Current Password</label>
                <input type="password" placeholder="Enter current password" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">New Password</label>
                <input type="password" placeholder="Enter new password" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Confirm Password</label>
                <input type="password" placeholder="Confirm new password" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
          </div>
          <div className="flex justify-end pt-2">
              <button className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors font-medium text-sm">
                Update Password
              </button>
          </div>
        </div>
      </div>

      </div>  );

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-950">
      
      {/* --- Sidebar --- */}
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
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium ${
                    isActive ? "bg-blue-50 text-blue-600" : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
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

      {/* --- Main Content --- */}
      <div className="flex-1 lg:ml-64">
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-slate-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button className="lg:hidden p-2 text-slate-500 hover:text-slate-900 rounded-md" onClick={() => setSidebarOpen(!sidebarOpen)}>
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 leading-none">
                   {location.pathname === '/dashboard/settings' ? 'Account Settings' : 
                    location.pathname === '/dashboard/documents' ? 'My Documents' : 
                    location.pathname === '/dashboard/services' ? 'My Services' : 'Dashboard'}
                </h1>
                <p className="text-sm text-slate-500 mt-1">Welcome back, {userData?.name?.split(" ")[0] || "User"}!</p>
              </div>
            </div>
            <Link to="/services" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2">
              Buy New Service
            </Link>
          </div>
        </header>

        <main className="p-6 space-y-6">
          
          {/* ✅ CONDITIONALLY RENDER SECTIONS BASED ON URL */}
          {location.pathname === '/dashboard' && (
             <>
               {renderStats()}
               {renderServicesList()}
               {renderDocumentsList()}
             </>
          )}

          {location.pathname === '/dashboard/services' && (
             renderServicesList()
          )}

          {location.pathname === '/dashboard/documents' && (
             renderDocumentsList()
          )}

          {location.pathname === '/dashboard/settings' && (
             renderSettings()
          )}

        </main>
      </div>

      {sidebarOpen && <div className="fixed inset-0 bg-slate-950/20 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* ✅ UPLOAD MODAL */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-900">Upload Document</h3>
              <button onClick={() => setIsUploadModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-slate-50 transition-colors ${selectedFile ? 'border-blue-300 bg-blue-50' : 'border-slate-300 hover:bg-slate-100'}`}>
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {selectedFile ? (
                    <>
                      <FileText className="w-8 h-8 text-blue-500 mb-2" />
                      <p className="text-sm text-slate-700 font-medium truncate max-w-[200px]">{selectedFile.name}</p>
                      <p className="text-xs text-slate-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </>
                  ) : (
                    <>
                      <CloudUpload className="w-8 h-8 text-slate-400 mb-2" />
                      <p className="text-sm text-slate-500"><span className="font-semibold">Click to upload</span></p>
                      <p className="text-xs text-slate-400">PDF, PNG, JPG (MAX. 5MB)</p>
                    </>
                  )}
                </div>
                <input type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.png,.jpg,.jpeg" />
              </label>
              <button onClick={handleUploadSubmit} disabled={uploading || !selectedFile} className="w-full inline-flex items-center justify-center rounded-lg text-sm font-bold transition-colors bg-blue-600 text-white hover:bg-blue-700 h-11 px-8 disabled:opacity-50 disabled:cursor-not-allowed">
                {uploading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...</> : "Upload Now"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;