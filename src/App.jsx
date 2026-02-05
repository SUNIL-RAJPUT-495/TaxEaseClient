import { IndexPage } from "./pages/IndexPage";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Services from "./pages/Services"; 
import Checkout from "./pages/Checkout";
import Dashboard from "./pages/Dashboard";
import AdminLayout from "./component/layout/AdminLayout";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/AdminDashboard";

// ---  Service Pages ---
import ITRFiling from "./pages/services/ITRFiling";
import GSTServices from "./pages/services/GSTservices";
import TaxPlanning from "./pages/services/TaxPlanning";
import NoticeHandling from "./pages/services/NoticeHandling";
import MainLayout from "./component/layout/MainLayout";

// --- Admin Pages ---
import Users from "./pages/admin/Users";
import Orders from "./pages/admin/Orders";
import AllServices from "./pages/admin/AllServices";
import Setting from "./pages/admin/Setting";
import CreateServicePlan from "../src/pages/admin/services/CreateServicePlan";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<IndexPage />} />
          <Route path="/services" element={<Services />} />
          
          {/* Individual Services */}
          <Route path="/services/itr-filing" element={<ITRFiling />} />
          <Route path="/services/gst" element={<GSTServices />} />
          <Route path="/services/tax-planning" element={<TaxPlanning />} />
          <Route path="/services/notice-handling" element={<NoticeHandling />} />
          
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        <Route path="/checkout" element={<Checkout />} />
        <Route path="/dashboard" element={<Dashboard />} />

       <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="orders" element={<Orders />} />
          <Route path="services" element={<AllServices />} />
          <Route path="settings" element={<Setting />} />
          <Route path="services/create" element={<CreateServicePlan />} />
        </Route>
        
        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;