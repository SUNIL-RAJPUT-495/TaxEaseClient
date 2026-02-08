import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, FileText, ChevronDown, User, LogOut, LayoutDashboard } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();


  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token && token !== "undefined" && token !== "null") {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [location]); 

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setIsLoggedIn(false);
    navigate("/");
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { 
      name: "Services", 
      path: "/services",
      dropdown: [
        { name: "ITR Filing", path: "/services/itr-filing" },
        { name: "Tax Planning", path: "/services/tax-planning" },
        { name: "GST Services", path: "/services/gst" },
        { name: "Notice Handling", path: "/services/notice-handling" },
      ]
    },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path) => location.pathname === path;

 
  const buttonBase = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2";
  const buttonGhost = "hover:bg-slate-100 hover:text-slate-900 text-slate-700";
  const buttonPrimary = "bg-blue-600 text-white shadow hover:bg-blue-600/90";
  const buttonOutline = "border border-slate-200 bg-white shadow-sm hover:bg-slate-100 hover:text-slate-900";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200 font-sans">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-sm">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-900">
              Tax<span className="text-blue-600">Ease</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              if (link.dropdown) {
                return (
                  <div key={link.name} className="relative group h-16 flex items-center">
                    <button 
                      className={`flex items-center gap-1 text-sm font-medium transition-colors group-hover:text-blue-600 ${
                        isActive(link.path) ? "text-blue-600" : "text-slate-500"
                      }`}
                    >
                      {link.name}
                      <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                    </button>
                    <div className="absolute top-full left-0 w-56 bg-white border border-slate-200 shadow-xl rounded-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                      <div className="p-2">
                        {link.dropdown.map((subLink) => (
                          <Link
                            key={subLink.name}
                            to={subLink.path}
                            className="block px-4 py-2.5 text-sm text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            {subLink.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                    isActive(link.path) ? "text-blue-600" : "text-slate-500"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
             
              <>
                <Link to="/dashboard" className={`${buttonBase} ${buttonGhost} gap-2`}>
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link to="/services" className={`${buttonBase} ${buttonPrimary}`}>
                  Explore Services
                </Link>
                
                <button 
                  onClick={handleLogout}
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={`${buttonBase} ${buttonGhost}`}>
                  Login
                </Link>
                <Link to="/signup" className={`${buttonBase} ${buttonPrimary}`}>
                  Get Started
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-md"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 border-t border-slate-200 bg-white h-screen">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => {
                if (link.dropdown) {
                  return (
                    <div key={link.name} className="flex flex-col">
                      <button
                        onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)}
                        className={`flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                          isActive(link.path) ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {link.name}
                        <ChevronDown className={`w-4 h-4 transition-transform ${isMobileServicesOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isMobileServicesOpen && (
                        <div className="flex flex-col gap-1 pl-4 mt-1 border-l-2 border-slate-100 ml-4">
                          {link.dropdown.map((subLink) => (
                            <Link
                              key={subLink.name}
                              to={subLink.path}
                              onClick={() => setIsOpen(false)}
                              className="px-4 py-2.5 text-sm text-slate-500 hover:text-blue-600 hover:bg-blue-50/50 rounded-lg transition-colors"
                            >
                              {subLink.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive(link.path) ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:bg-slate-50"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                );
              })}


              <div className="flex flex-col gap-3 pt-6 mt-4 border-t border-slate-100 px-2">
                {isLoggedIn ? (
                 
                  <>
                    <Link 
                      to="/dashboard" 
                      onClick={() => setIsOpen(false)}
                      className={`${buttonBase} ${buttonOutline} w-full gap-2`}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Go to Dashboard
                    </Link>
                    <Link 
                      to="/services" 
                      onClick={() => setIsOpen(false)}
                      className={`${buttonBase} ${buttonPrimary} w-full`}
                    >
                      Explore Services
                    </Link>
                    <button 
                      onClick={() => { handleLogout(); setIsOpen(false); }}
                      className={`${buttonBase} border border-red-200 text-red-600 hover:bg-red-50 w-full mt-2`}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/login" 
                      onClick={() => setIsOpen(false)}
                      className={`${buttonBase} ${buttonOutline} w-full`}
                    >
                      Login
                    </Link>
                    <Link 
                      to="/signup" 
                      onClick={() => setIsOpen(false)}
                      className={`${buttonBase} ${buttonPrimary} w-full`}
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;