import React from 'react';
import { Link } from "react-router-dom";
import { FileText, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const services = [
    { name: "ITR Filing", path: "/services/itr-filing" },
    { name: "Tax Planning", path: "/services/tax-planning" },
    { name: "GST Services", path: "/services/gst" },
    { name: "Notice Handling", path: "/services/notice-handling" },
  ];

  // const quickLinks = [
  //   { name: "Privacy Policy", path: "/privacy-policy" },
  //   { name: "Terms & Conditions", path: "/terms-conditions" },
  //   { name: "FAQ's", path: "/faqs" },
  //   { name: "Blog & Articles", path: "/blog" },
  //   { name: "Contact Us", path: "/contact" },
  // ];

  return (
    <footer className="bg-blue-950 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand & About Company */}
          <div className="space-y-6 lg:col-span-1">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl leading-tight">
                GOOD
                <span className="text-blue-400">ITR</span>
              </span>
            </Link>
            <p className="text-blue-100/80 text-sm leading-relaxed">
              India’s fastest growing destination for “Online Legal Services”. We have the vision to build legal things simplified through automation and technology. Our mission is to offer affordable, quick, and automated professional services to clients.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-lg mb-6 border-b border-blue-800 pb-2 inline-block">
              Services
            </h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.name}>
                  <Link
                    to={service.path}
                    className="text-blue-100/80 hover:text-white hover:pl-2 transition-all duration-300 text-sm flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          {/* <div>
            <h4 className="font-semibold text-lg mb-6 border-b border-blue-800 pb-2 inline-block">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-blue-100/80 hover:text-white hover:pl-2 transition-all duration-300 text-sm flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div> */}

          {/* Contact Us */}
          <div>
            <h4 className="font-semibold text-lg mb-6 border-b border-blue-800 pb-2 inline-block">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-blue-100/80 text-sm">
                <MapPin className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  Flat – G01, Bharat Apartment, Shiv Shakti Vihar, Sanaganer, Jaipur – 302029
                </span>
              </li>
              <li className="flex items-center gap-3 text-blue-100/80 text-sm hover:text-white transition-colors">
                <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <a href="tel:+919799923625">+91 9799923625</a>
              </li>
              <li className="flex items-center gap-3 text-blue-100/80 text-sm hover:text-white transition-colors">
                <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <a href="mailto:info@myallbusinessconsultant.com">info@myallbusinessconsultant.com</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-blue-800/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-blue-200/60 text-sm">
              © {currentYear} My All Business Consultant. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <span className="text-blue-200/60 text-sm">
                Trusted by businesses across India
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;