import React, { useState } from 'react';
import { 
  Search, 
  Eye, 
  Trash2, 
  Mail, 
  Phone, 
  Filter,
  MoreVertical,
  Calendar
} from 'lucide-react';

export const InquiriesPage = () => {
  // Mock Data: Yeh data actual API se aayega (database se)
  const [inquiries, setInquiries] = useState([
    {
      id: "INQ-001",
      name: "Rahul Sharma",
      email: "rahul.s@example.com",
      phone: "+91 9876543210",
      message: "I need help with GST Registration for my new startup.",
      date: "2026-03-01",
      status: "New"
    },
    {
      id: "INQ-002",
      name: "Priya Singh",
      email: "priya99@gmail.com",
      phone: "+91 8765432109",
      message: "Looking for ITR filing for the current financial year.",
      date: "2026-03-02",
      status: "In Progress"
    },
    {
      id: "INQ-003",
      name: "Amit Verma",
      email: "amit.tech@yahoo.com",
      phone: "+91 7654321098",
      message: "Got an income tax notice, need expert consultation.",
      date: "2026-02-28",
      status: "Resolved"
    },
    {
      id: "INQ-004",
      name: "Sneha Gupta",
      email: "sneha.g@outlook.com",
      phone: "+91 6543210987",
      message: "Want to register a Private Limited Company.",
      date: "2026-03-03",
      status: "New"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  // Search Filter Logic
  const filteredInquiries = inquiries.filter(inq => 
    inq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inq.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inq.phone.includes(searchTerm)
  );

  // Status Badge Styling Function
  const getStatusBadge = (status) => {
    switch (status) {
      case 'New':
        return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold tracking-wide">NEW</span>;
      case 'In Progress':
        return <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold tracking-wide">IN PROGRESS</span>;
      case 'Resolved':
        return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold tracking-wide">RESOLVED</span>;
      default:
        return <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold tracking-wide">{status}</span>;
    }
  };

  // Delete Handler (Mock)
  const handleDelete = (id) => {
    if(window.confirm("Are you sure you want to delete this inquiry?")) {
      setInquiries(inquiries.filter(inq => inq.id !== id));
    }
  };

  return (
    <div className="p-6 md:p-8 bg-slate-50 min-h-screen font-sans">
      
      {/* Page Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">Inquiries</h1>
          <p className="text-slate-500 text-sm mt-1">Manage all contact messages and client requests here.</p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm transition-all"
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        
        {/* Table Header Action Bar */}
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
          <div className="font-semibold text-slate-700">
            Total Inquiries: <span className="text-blue-600 bg-blue-100 px-2 py-0.5 rounded-md ml-1">{filteredInquiries.length}</span>
          </div>
          <button className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 font-medium transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">User Details</th>
                <th className="px-6 py-4 font-semibold">Message</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredInquiries.length > 0 ? (
                filteredInquiries.map((inquiry) => (
                  <tr key={inquiry.id} className="hover:bg-slate-50 transition-colors duration-150">
                    
                    {/* User Details Column */}
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 mb-1">{inquiry.name}</div>
                      <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-1">
                        <Mail className="w-3.5 h-3.5" /> {inquiry.email}
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                        <Phone className="w-3.5 h-3.5" /> {inquiry.phone}
                      </div>
                    </td>

                    {/* Message Column */}
                    <td className="px-6 py-4 max-w-xs">
                      <p className="text-slate-700 truncate" title={inquiry.message}>
                        {inquiry.message}
                      </p>
                    </td>

                    {/* Date Column */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        {new Date(inquiry.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                    </td>

                    {/* Status Column */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(inquiry.status)}
                    </td>

                    {/* Actions Column */}
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button 
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(inquiry.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Inquiry"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                /* Empty State */
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <Search className="w-10 h-10 text-slate-300 mb-3" />
                      <p className="text-lg font-medium text-slate-600">No inquiries found</p>
                      <p className="text-sm">Try adjusting your search criteria.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InquiriesPage;