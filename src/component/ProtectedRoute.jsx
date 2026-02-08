import { Navigate, useLocation, Outlet } from 'react-router-dom';

export const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem('access_token'); 

  if (!token || token === "undefined" || token === "null" || token === "") {
    localStorage.removeItem('access_token');
    
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children ? children : <Outlet />;
};

// --- ADMIN PROTECTED ROUTE ---
export const ProtectedRouteAdmin = ({ children }) => {
  const token = localStorage.getItem('token');
  const userRawData = localStorage.getItem('user_data');
  
  if (!token || !userRawData) {
    return <Navigate to="/admin/login" replace />;
  }

  const userData = JSON.parse(userRawData);

  if (userData?.role?.toLowerCase() !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // ✅ Yeh line white screen fix karegi
  return children ? children : <Outlet />; 
};