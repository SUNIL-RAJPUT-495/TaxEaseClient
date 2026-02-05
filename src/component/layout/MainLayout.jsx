import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

function MainLayout() {
  return (
    <div>
      {/* Navbar Component */}
      <Navbar />
      <Outlet />
      {/* Footer Component */}
      <Footer />
    </div>
  );
}
export default MainLayout;