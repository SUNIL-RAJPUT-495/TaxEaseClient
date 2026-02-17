import { IndexPage } from "./pages/IndexPage";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Services from "./pages/Services";
import Checkout from "./pages/Checkout";
import Dashboard from "./pages/userDashboard/Dashboard";
import AdminLayout from "./component/layout/AdminLayout";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UploadDocsPage from "./pages/UploadDocsPage";
import ChatPage from "./pages/UserChatPage";
import FileStatusPage from "./pages/FileStatusPage";

// ---  Service Pages ---
import ITRFiling from "./pages/services/ITRFiling";
import GSTServices from "./pages/services/GSTServices";
import TaxPlanning from "./pages/services/TaxPlanning";  
import NoticeHandling from "./pages/services/NoticeHandling";
import MainLayout from "./component/layout/MainLayout";


// --- Admin Pages ---
import Users from "./pages/admin/Users";
import Orders from "./pages/admin/Orders";
import AllServices from "./pages/admin/AllServices";
import Setting from "./pages/admin/Setting";
import CreateServicePlan from "../src/pages/admin/services/CreateServicePlan";
import AdminLogin from "./pages/AdminLogin";
import AdminInbox from "./pages/admin/AdminInbox";
import OrderDetails from "./pages/admin/OrderDetailsView";
import EditServicePlan from "./pages/admin/services/EditServicePlan";


// protected Route 
import { ProtectedRoute } from "./component/ProtectedRoute";
import { ProtectedRouteAdmin } from "./component/ProtectedRoute";


//components 
import AuthModal from "./component/AuthModal";
import SetDocRequirements from "./pages/admin/SetDocRequirements";

function App() {
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const handleUnauthorized = () => {
      setShowAuthModal(true);
    };

    window.addEventListener("on-unauthorized", handleUnauthorized);

    return () => {
      window.removeEventListener("on-unauthorized", handleUnauthorized);
    };
  }, []);
  return (
    <BrowserRouter>
    <AuthModal isOpen={showAuthModal} />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<IndexPage />} />
          <Route path="/services" element={<Services />} />

          {/* Individual Services */}



        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/services/itr-filing" element={<ITRFiling />} />
          <Route path="/services/gst" element={<GSTServices />} />
          <Route path="/services/tax-planning" element={<TaxPlanning />} />
          <Route path="/services/notice-handling" element={<NoticeHandling />} />
          <Route path="/upload-documents" element={<UploadDocsPage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/services" element={<Dashboard />} />
          <Route path="/dashboard/documents" element={<Dashboard />} />
          <Route path="/dashboard/settings" element={<Dashboard />} />
          <Route path="/dashboard/chat" element={<Dashboard />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/FileStatusPage" element={<FileStatusPage />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route element={<ProtectedRouteAdmin />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="orders" element={<Orders />} />
            <Route path="order/:id" element={<OrderDetails />} />
            <Route path="services" element={<AllServices />} />
            <Route path="settings" element={<Setting />} />
            <Route path="inbox" element={<AdminInbox />} />
            <Route path="services/create" element={<CreateServicePlan />} />
            <Route path="chat-inbox" element={<AdminInbox />} />
            <Route path="/admin/services/edit/:id" element={<EditServicePlan />} />
            <Route path="SetDocRequirements" element={<SetDocRequirements/>}/>
          </Route>
        </Route>

        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;