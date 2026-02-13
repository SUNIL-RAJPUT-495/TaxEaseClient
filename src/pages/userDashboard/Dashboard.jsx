import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  Home, ShoppingBag, Files, Mail, Settings, 
  Menu, X, Loader2, CloudUpload, FileText 
} from "lucide-react";
import Axios from "../../utils/axios";
import SummaryApi from "../../common/SummerAPI";

// --- Components Import ---
import Sidebar from "./Sidebar";
import StatsGrid from "./StatsGrid";
import ServicesList from "./ServicesList";
import SupportChat from "./SupportChat";
import DocumentsList from "./DocumentsList"; 
import SettingsPage from "./SettingsPage";  

const Dashboard = () => {
  // 1. Core States
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 2. Chat States
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // 3. Settings & Upload States
  const [profile, setProfile] = useState({ name: "", email: "", phone: "" });
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false); 
  const [selectedFile, setSelectedFile] = useState(null); 
  const [uploading, setUploading] = useState(false); 

  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: ShoppingBag, label: "My Services", path: "/dashboard/services" },
    { icon: Files, label: "Documents", path: "/dashboard/documents" },
    { icon: Mail, label: "Support Chat", path: "/dashboard/chat" },
    { icon: Settings, label: "Settings", path: "/dashboard/settings" },
  ];

  // Fetch User Logic
  const fetchUserDetails = async () => {
    try {
      const response = await Axios({
        url: SummaryApi.userDetails.url,
        method: SummaryApi.userDetails.method,
      });
      if (response.data.success) {
        setUserData(response.data.data);
        setProfile({
          name: response.data.data.name || "",
          email: response.data.data.email || "",
          phone: response.data.data.phone || "",
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      if(error.response?.status === 401) navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);








const handleSendMessage = async () => {
  if (!input.trim()) return;

  const currentInput = input;
  
  const newMessage = {
    message: currentInput,
    senderId: userData?._id,
    role: 'user', 
    timestamp: new Date()
  };

  const updatedMessages = [...messages, newMessage];
  setMessages(updatedMessages);
  setInput(""); 

  localStorage.setItem(`chat_history_${userData?._id}`, JSON.stringify(updatedMessages));

  try {
    const res = await Axios({
      url: SummaryApi.sendChat.url,
      method: SummaryApi.sendChat.method,
      data: {
        message: currentInput,
        sender: userData?._id,
        receiver: "679f220677ef999c0da9853c", 
        role: 'user'
      }
    });
    if (res.data.success) {
      console.log("Message saved to DB");
    }
  } catch (error) {
    console.error("Chat Error:", error.response?.data);
  }
};







  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleUploadSubmit = async () => {
    if (!selectedFile) return alert("Please select a file first!");
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
        setSelectedFile(null);
        fetchUserDetails(); 
      }
    } catch (err) {
      alert("Upload failed: " + (err.response?.data?.message || err.message));
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-950">
      <Sidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        navItems={navItems} 
        location={location} 
        userData={userData} 
        handleLogout={handleLogout} 
      />

      <div className="flex-1 lg:ml-64">
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 text-slate-500 hover:text-slate-900" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className="text-2xl font-bold text-slate-900 leading-none">
              {navItems.find(i => i.path === location.pathname)?.label || "Dashboard"}
            </h1>
          </div>
          <Link to="/services" className="inline-flex bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
            Buy New Service
          </Link>
        </header>

        <main className="p-6 space-y-6">
          {/* Dashboard Home - Services + Documents */}
          {location.pathname === '/dashboard' && (
            <>
              <StatsGrid 
                total={userData?.orders?.length || 0} 
                pending={userData?.orders?.filter(o => o.status !== 'paid').length || 0} 
                completed={userData?.orders?.filter(o => o.status === 'paid').length || 0} 
              />
              <ServicesList orders={userData?.orders} />
              <DocumentsList 
                documents={userData?.documents || []} 
                onUploadClick={() => setIsUploadModalOpen(true)} 
              />
            </>
          )}

          {location.pathname === '/dashboard/services' && <ServicesList orders={userData?.orders} />}
          
          {location.pathname === '/dashboard/documents' && (
            <DocumentsList 
              documents={userData?.documents || []} 
              onUploadClick={() => setIsUploadModalOpen(true)} 
            />
          )}

          {location.pathname === '/dashboard/settings' && (
            <SettingsPage 
              profile={profile} 
              onProfileChange={(e) => setProfile({ ...profile, [e.target.name]: e.target.value })} 
              onSave={(e) => { e.preventDefault(); alert("Profile Updated!"); }} 
            />
          )}

          {location.pathname === '/dashboard/chat' && (
            <SupportChat 
              userData={userData}
              messages={messages}
              input={input}
              setMessages={setMessages}
              setInput={setInput}
              onSend={handleSendMessage}
            />
          )}
        </main>
      </div>

      {/* --- Same Modal UI --- */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-900">Upload Document</h3>
              <button onClick={() => setIsUploadModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-slate-50 transition-colors ${selectedFile ? 'border-blue-300 bg-blue-50' : 'border-slate-300 hover:bg-slate-100'}`}>
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {selectedFile ? (
                    <>
                      <FileText className="w-8 h-8 text-blue-500 mb-2" />
                      <p className="text-sm text-slate-700 font-medium truncate max-w-[200px]">{selectedFile.name}</p>
                    </>
                  ) : (
                    <>
                      <CloudUpload className="w-8 h-8 text-slate-400 mb-2" />
                      <p className="text-sm text-slate-500 font-semibold">Click to upload</p>
                    </>
                  )}
                </div>
                <input type="file" className="hidden" onChange={handleFileChange} />
              </label>
              <button 
                onClick={handleUploadSubmit} 
                disabled={uploading || !selectedFile} 
                className="w-full inline-flex items-center justify-center rounded-lg text-sm font-bold bg-blue-600 text-white h-11 px-8 disabled:opacity-50"
              >
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