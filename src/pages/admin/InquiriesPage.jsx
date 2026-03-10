import React, { useState, useEffect } from 'react';
import Axios from "../../utils/axios";
import SummaryApi from '../../common/SummerAPI';
import {
  Search,
  Mail,
  Phone,
  Filter,
  Calendar,
  Loader2,
  AlertCircle
} from 'lucide-react';

export const InquiriesPage = () => {
  const [inquiries, setInquiries] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInquiries = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await Axios({
          url: SummaryApi.getEinquiry.url,
          method: SummaryApi.getEinquiry.method
        });
        
        if (response.data?.data) {
          setInquiries(response.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch inquiries:", err);
        setError("Could not load latest inquiries. Showing cached data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInquiries();
  }, []); 

  // Search Filter Logic
  const filteredInquiries = inquiries.filter(inq =>
    inq.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inq.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inq.phone?.includes(searchTerm)
  );

  
  
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

      {/* Error Banner */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 flex items-center gap-3 rounded-md">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Table Section */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {/* Table Header Action Bar */}
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
          <div className="font-semibold text-slate-700 flex items-center gap-3">
            Total Inquiries: 
            <span className="text-blue-600 bg-blue-100 px-2 py-0.5 rounded-md text-sm">{filteredInquiries.length}</span>
            {isLoading && <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />}
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
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {isLoading && inquiries.length === 0 ? (
                /* Initial Loading State */
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-3" />
                      <p className="text-sm font-medium">Loading inquiries...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredInquiries.length > 0 ? (
                filteredInquiries.map((inquiry) => (
                  <tr key={inquiry.id || inquiry._id} className="hover:bg-slate-50 transition-colors duration-150">
                    {/* User Details Column */}
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 mb-1">{inquiry.name}</div>
                      <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-1">
                        <Mail className="w-3.5 h-3.5" /> {inquiry.email}
                      </div>
                      <div className="flex font-bold text-slate-900 items-center gap-1.5 text-slate-500 text-xs">
                        <Phone className="w-3.5 h-3.5" /> {inquiry.numbers}
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
                        {new Date(inquiry.date || inquiry.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                /* Empty/No Results State */
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